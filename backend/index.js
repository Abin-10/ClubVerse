import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Player from './models/Player.js';
import Coach from './models/Coach.js';
import StadiumBooking from './models/StadiumBooking.js';
import Stadium from './models/Stadium.js';
import Team from './models/Team.js';
import Fixture from './models/Fixture.js';
import Ticket from './models/Ticket.js';
import CommunityPost from './models/CommunityPost.js';
import FanPoll from './models/FanPoll.js';
import Announcement from './models/Announcement.js';
import { isValidEmail } from './utils/validators.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'clubverse_jwt_secret_key_2026_super_secure';

// Helper to generate signed JWT token (7-day validity)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No session token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session token.' });
  }
};

// In-Memory Store for Email OTP Verification Codes
const otpStore = new Map();

// In-Memory Store for Password Setup Invitation Tokens
const inviteTokenStore = new Map();

// Helper to create Nodemailer Transporter
const createTransporter = async () => {
  const emailUser = (process.env.EMAIL_USER || '').trim();
  const rawPass = (process.env.EMAIL_PASS || '').trim();
  const emailPass = rawPass.replace(/\s+/g, ''); // Strip all spaces from Gmail App Password

  if (emailUser && emailPass) {
    console.log(`📧 Setting up Gmail SMTP Transporter for: ${emailUser}`);
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (err) {
      console.warn('Ethereal test account warning:', err.message);
      return null;
    }
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware with larger limit for profile image uploads
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Seed Admin Account Helper
const seedAdminUser = async () => {
  try {
    const adminEmail = 'soccer097711@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminUser) {
      await User.create({
        full_name: 'Club Administrator',
        email: adminEmail.toLowerCase(),
        password: 'admin123',
        role: 'Admin',
        must_change_password: false,
        status: 'Active',
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      });
      console.log('✅ Admin user created: soccer097711@gmail.com with password: admin123');
    } else {
      adminUser.role = 'Admin';
      if (!adminUser.password) adminUser.password = 'admin123';
      await adminUser.save();
      console.log('✅ Admin user verified: soccer097711@gmail.com');
    }
  } catch (err) {
    console.warn('Admin user seeding note:', err.message);
  }
};

// Connect to MongoDB
connectDB().then(async () => {
  seedAdminUser();
  await seedInitialData();
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ClubVerse Server Running' });
});

// Register Endpoint (Public - Fan Accounts Only)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address with a valid domain (e.g. alex@example.com).' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email address already exists.' });
    }

    // Public registration is restricted to Fans
    const newUser = await User.create({
      full_name: fullName,
      email: email.toLowerCase(),
      password: password,
      role: 'Fan',
      must_change_password: false,
      status: 'Active'
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Fan account registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        profile_image: newUser.profile_image,
        phone: newUser.phone,
        bio: newUser.bio,
        favorite_player: newUser.favorite_player,
        mustChangePassword: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// Admin User Creation Endpoint (Admin creates Player or Coach with DOB as initial password)
app.post('/api/admin/users/create', async (req, res) => {
  try {
    const { fullName, email, role, dob } = req.body;

    if (!fullName || !email || !role || !dob) {
      return res.status(400).json({ message: 'Full name, email, role (Player/Coach), and DOB (YYYY-MM-DD) are required.' });
    }

    if (!['Player', 'Coach'].includes(role)) {
      return res.status(400).json({ message: 'Admin can only register Players or Coaches via this endpoint.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email address already exists.' });
    }

    // Initial password set to Date of Birth (DOB)
    const newUser = await User.create({
      full_name: fullName,
      email: email.toLowerCase(),
      password: dob, // Initial password is DOB
      dob: dob,
      role: role,
      must_change_password: true,
      status: 'Active'
    });

    res.status(201).json({
      message: `${role} account created successfully! Initial password set to DOB (${dob}).`,
      user: {
        id: newUser._id,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        dob: newUser.dob,
        mustChangePassword: true
      }
    });
  } catch (error) {
    console.error('Admin user creation error:', error);
    res.status(500).json({ message: error.message || 'Server error creating user' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    // Special auto-create / ensure for requested Admin email
    if (cleanEmail === 'soccer097711@gmail.com') {
      if (!user) {
        user = await User.create({
          full_name: 'Club Administrator',
          email: cleanEmail,
          password: password || 'admin123',
          role: 'Admin',
          must_change_password: false,
          status: 'Active'
        });
      } else {
        if (user.role !== 'Admin') {
          user.role = 'Admin';
        }
        if (user.password !== password) {
          user.password = password; // Update password if provided
        }
        await user.save();
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profile_image,
        bio: user.bio,
        favorite_player: user.favorite_player,
        mustChangePassword: user.must_change_password || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google Auth Endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, email: bodyEmail, name: bodyName } = req.body;

    let email = bodyEmail;
    let name = bodyName;

    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          if (payload.email) {
            email = payload.email;
            name = payload.name || name;
          }
        }
      } catch (tokErr) {
        console.warn('Token verification fetch error, using request payload:', tokErr);
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Valid Google email is required.' });
    }

    const cleanEmail = email.toLowerCase();
    const isTargetAdmin = cleanEmail === 'soccer097711@gmail.com';

    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        full_name: name || (isTargetAdmin ? 'Club Administrator' : 'Google User'),
        email: cleanEmail,
        password: 'google_oauth_protected',
        role: isTargetAdmin ? 'Admin' : 'Fan',
        must_change_password: false,
        status: 'Active'
      });
    } else if (isTargetAdmin && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        phone: user.phone,
        bio: user.bio,
        favorite_player: user.favorite_player,
        mustChangePassword: user.must_change_password || false
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: error.message || 'Server error during Google authentication' });
  }
});

// GET /api/auth/session - Verify active session token & return user
app.get('/api/auth/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'No active session token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ valid: false, message: 'User session invalid or user not found.' });
    }

    res.json({
      valid: true,
      token,
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profile_image,
        bio: user.bio,
        favorite_player: user.favorite_player,
        mustChangePassword: user.must_change_password || false
      }
    });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Session token expired or invalid.' });
  }
});

// Get User Profile Endpoint (MongoDB)
app.get('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let user;

    if (!userId || userId === 'admin' || userId === 'current' || userId === 'undefined') {
      user = await User.findOne({ email: 'soccer097711@gmail.com' });
    } else {
      try {
        user = await User.findById(userId);
      } catch (e) {
        user = await User.findOne({ email: userId.toLowerCase() });
      }
    }

    if (!user) {
      user = await User.findOne({ role: 'Admin' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        profile_image: user.profile_image || '',
        bio: user.bio || 'Passionate ClubVerse VIP Supporter ⚽',
        favorite_player: user.favorite_player || 'Marcus Rashford',
        dob: user.dob || ''
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// Update User Profile Endpoint (MongoDB)
app.put('/api/user/profile', async (req, res) => {
  try {
    const { email, name, phone, profile_image, bio, favorite_player } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to update profile' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.full_name = name;
    if (phone !== undefined) user.phone = phone;
    if (profile_image !== undefined) user.profile_image = profile_image;
    if (bio !== undefined) user.bio = bio;
    if (favorite_player !== undefined) user.favorite_player = favorite_player;

    await user.save();

    // Sync profile image and name updates across all CommunityPost documents (posts & comments)
    if (profile_image !== undefined || name) {
      try {
        const userIdentifiers = [user._id.toString(), user.email.toLowerCase(), user.full_name];
        if (name) userIdentifiers.push(name);

        const matchingPosts = await CommunityPost.find({
          $or: [
            { author_id: { $in: userIdentifiers } },
            { author_name: { $in: [user.full_name, name].filter(Boolean) } },
            { 'comments.author_id': { $in: userIdentifiers } },
            { 'comments.author_name': { $in: [user.full_name, name].filter(Boolean) } }
          ]
        });

        for (const post of matchingPosts) {
          let isModified = false;
          const matchesAuthor = userIdentifiers.includes(post.author_id) ||
            post.author_name === user.full_name ||
            (name && post.author_name === name);

          if (matchesAuthor) {
            if (profile_image !== undefined) post.author_avatar = profile_image;
            if (name) post.author_name = name;
            isModified = true;
          }

          if (Array.isArray(post.comments)) {
            for (const cmt of post.comments) {
              const matchesCmt = userIdentifiers.includes(cmt.author_id) ||
                cmt.author_name === user.full_name ||
                (name && cmt.author_name === name);
              if (matchesCmt) {
                if (profile_image !== undefined) cmt.author_avatar = profile_image;
                if (name) cmt.author_name = name;
                isModified = true;
              }
            }
          }

          if (isModified) {
            post.markModified('comments');
            await post.save();
          }
        }
      } catch (syncErr) {
        console.warn('Community post sync note:', syncErr);
      }
    }

    res.json({
      message: 'Profile updated successfully in MongoDB!',
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profile_image,
        bio: user.bio,
        favorite_player: user.favorite_player,
        mustChangePassword: user.must_change_password || false
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
});

// Change Password Endpoint (MongoDB)
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check old password unless:
    // 1. Google OAuth account
    // 2. Admin-created account that must change password (they don't know the temp password)
    const isGoogleAccount = user.password === 'google_oauth_protected';
    const isForcedChange = user.must_change_password === true;
    if (!isGoogleAccount && !isForcedChange && oldPassword !== 'google_oauth_protected' && user.password !== oldPassword) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    user.must_change_password = false;
    await user.save();

    res.json({
      message: 'Password set/updated successfully in MongoDB!',
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        mustChangePassword: false
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message || 'Server error updating password' });
  }
});

// Send OTP to Email Endpoint (Nodemailer)
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in-memory OTP record (valid 10 mins)
    otpStore.set(cleanEmail, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    const transporter = await createTransporter();
    if (transporter) {
      const senderAddress = process.env.EMAIL_USER ? `"ClubVerse Security" <${process.env.EMAIL_USER}>` : '"ClubVerse Security" <no-reply@clubverse.com>';
      const mailOptions = {
        from: senderAddress,
        to: cleanEmail,
        subject: `Your ClubVerse Password Reset OTP: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e1d8; border-radius: 20px; background-color: #fffdf8;">
            <h2 style="color: #20221f; font-family: Georgia, serif; margin-top: 0;">ClubVerse FC Security</h2>
            <p style="color: #6f716b; font-size: 14px;">You requested a password reset for your ClubVerse account (${cleanEmail}).</p>
            <div style="background-color: #20221f; color: #bef264; padding: 16px 28px; border-radius: 14px; display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 18px 0;">
              ${otpCode}
            </div>
            <p style="color: #6f716b; font-size: 13px; margin-top: 10px;">This OTP verification code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e4e1d8; margin-top: 24px;" />
            <p style="color: #999; font-size: 11px; margin-bottom: 0;">© 2026 ClubVerse FC • Spotify Arena Platform</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Real OTP Email sent to ${cleanEmail}! Message ID: ${info.messageId}`);
      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        console.log(`🔗 Preview Email at Ethereal: ${testUrl}`);
      }
    } else {
      console.log(`⚠️ SMTP transporter fallback. OTP for ${cleanEmail} is: ${otpCode}`);
    }

    res.json({
      message: `Verification OTP has been sent to your email (${cleanEmail}). Please check your inbox and spam folder!`,
      email: cleanEmail
    });
  } catch (error) {
    console.error('Send OTP Email Error:', error);
    res.status(500).json({ message: error.message || 'Failed to send OTP email.' });
  }
});

// Verify OTP & Reset Password Endpoint (MongoDB)
app.post('/api/auth/reset-password-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP code, and new password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({ message: 'No active OTP request found for this email. Please request a new OTP code.' });
    }

    if (Date.now() > storedRecord.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ message: 'OTP code has expired. Please request a new OTP code.' });
    }

    if (storedRecord.code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check the email sent to your inbox.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        full_name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: newPassword,
        role: 'Fan',
        must_change_password: false,
        status: 'Active'
      });
    } else {
      user.password = newPassword;
      user.must_change_password = false;
      await user.save();
    }

    // Clean up OTP record
    otpStore.delete(cleanEmail);

    res.json({
      message: 'OTP verified & password updated successfully in MongoDB!',
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Reset password OTP error:', error);
    res.status(500).json({ message: error.message || 'Server error resetting password' });
  }
});

// ==========================================
// ADMIN DASHBOARD API ENDPOINTS
// ==========================================

// Seed Initial Default Data Helper
const seedInitialData = async () => {
  try {
    const playerCount = await Player.countDocuments();
    if (playerCount === 0) {
      await Player.insertMany([
        {
          full_name: 'Gavi',
          email: 'abin37523@gmail.com',
          position: 'Right Winger / Forward',
          jersey_number: 7,
          date_of_birth: '2001-09-05',
          phone: '9539437002',
          nationality: 'England',
          preferred_foot: 'Left',
          height: '178 cm',
          weight: '72 kg',
          contract_term: 'June 2029',
          role_access: 'First Team Professional Player',
          market_value: '€120M',
          medical_clearance: '100% Match Fit',
          bio: 'Passionate ClubVerse VIP Supporter ⚽',
          profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        },
        {
          full_name: 'Marcus Rashford',
          email: 'marcus.rashford@clubverse.com',
          position: 'Forward',
          jersey_number: 10,
          date_of_birth: '1997-10-31',
          phone: '+44 7700 900077',
          nationality: 'England',
          preferred_foot: 'Right',
          height: '180 cm',
          weight: '70 kg',
          contract_term: 'June 2028',
          role_access: 'First Team Professional Player',
          market_value: '€85M',
          medical_clearance: '100% Match Fit',
          bio: 'ClubVerse Star Forward • Dedicated to tactical execution.',
          profile_image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        },
        {
          full_name: 'Bukayo Saka',
          email: 'bukayo.saka@clubverse.com',
          position: 'Winger',
          jersey_number: 7,
          date_of_birth: '2001-09-05',
          phone: '+44 7700 900088',
          nationality: 'England',
          preferred_foot: 'Left',
          height: '178 cm',
          weight: '72 kg',
          contract_term: 'June 2029',
          role_access: 'First Team Professional Player',
          market_value: '€120M',
          medical_clearance: '100% Match Fit',
          bio: 'ClubVerse First Team Winger • Dedicated to squad victory.',
          profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        },
        {
          full_name: 'Erling Haaland',
          email: 'erling.haaland@clubverse.com',
          position: 'Striker',
          jersey_number: 9,
          date_of_birth: '2000-07-21',
          phone: '+47 900 12 345',
          nationality: 'Norway',
          preferred_foot: 'Left',
          height: '194 cm',
          weight: '88 kg',
          contract_term: 'June 2029',
          role_access: 'First Team Professional Player',
          market_value: '€180M',
          medical_clearance: '100% Match Fit',
          bio: 'Lethal Striker • Record Breaking Goalscorer.',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        }
      ]);
    }

    const coachCount = await Coach.countDocuments();
    if (coachCount === 0) {
      await Coach.insertMany([
        {
          full_name: 'Mikel Arteta',
          email: 'mikel.arteta@clubverse.com',
          phone: '+44 7700 911122',
          specialization: 'Tactical Head Coach',
          experience: 8,
          profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        },
        {
          full_name: 'Pep Guardiola',
          email: 'pep.guardiola@clubverse.com',
          phone: '+34 612 345 678',
          specialization: 'Possession & Attack Strategy',
          experience: 16,
          profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        }
      ]);
    }
  } catch (err) {
    console.warn('Seed initial admin data note:', err.message);
  }
};

// GET Player Profile by Email (for Player Dashboard)
app.get('/api/player/profile/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    let player = await Player.findOne({ email });

    // If player record doesn't exist yet in Player collection, create or construct from User account or defaults
    if (!player) {
      const userAccount = await User.findOne({ email });
      if (userAccount) {
        player = await Player.create({
          full_name: userAccount.full_name || 'Gavi',
          email: email,
          position: 'Right Winger / Forward',
          jersey_number: 7,
          date_of_birth: userAccount.dob || '2001-09-05',
          phone: userAccount.phone || '9539437002',
          nationality: 'England',
          preferred_foot: 'Left',
          height: '178 cm',
          weight: '72 kg',
          contract_term: 'June 2029',
          role_access: 'First Team Professional Player',
          market_value: '€120M',
          medical_clearance: '100% Match Fit',
          bio: userAccount.bio || 'Passionate ClubVerse VIP Supporter ⚽',
          profile_image: userAccount.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          status: 'Active'
        });
      } else {
        return res.status(404).json({ message: 'Player record not found for this email.' });
      }
    }

    res.json({
      id: player._id,
      full_name: player.full_name,
      email: player.email,
      position: player.position,
      jersey_number: player.jersey_number,
      date_of_birth: player.date_of_birth,
      phone: player.phone,
      nationality: player.nationality,
      preferred_foot: player.preferred_foot || 'Left',
      height: player.height || '178 cm',
      weight: player.weight || '72 kg',
      contract_term: player.contract_term || 'June 2029',
      role_access: player.role_access || 'First Team Professional Player',
      market_value: player.market_value || '€120M',
      medical_clearance: player.medical_clearance || '100% Match Fit',
      bio: player.bio || 'Passionate ClubVerse VIP Supporter ⚽',
      profile_image: player.profile_image,
      status: player.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch player profile' });
  }
});

// GET Coach Profile by Email (for Coach Dashboard)
app.get('/api/coach/profile/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(404).json({ message: 'Coach record not found for this email.' });
    }
    res.json({
      id: coach._id,
      full_name: coach.full_name,
      email: coach.email,
      phone: coach.phone,
      specialization: coach.specialization,
      experience: coach.experience,
      nationality: coach.nationality,
      profile_image: coach.profile_image,
      status: coach.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch coach profile' });
  }
});

// Helper to format relative time-ago strings for audit activity logs
function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Just now';
  const diff = Date.now() - new Date(dateInput).getTime();
  if (isNaN(diff) || diff < 0) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

// GET Admin Overview Stats (Dynamic from MongoDB)
app.get('/api/admin/stats', async (req, res) => {
  try {
    await ensureDefaultFixtures();

    const totalPlayers = await Player.countDocuments();
    const activePlayers = await Player.countDocuments({ status: 'Active' });
    const totalCoaches = await Coach.countDocuments();
    const activeCoaches = await Coach.countDocuments({ status: 'Active' });

    // Fetch upcoming fixtures from MongoDB
    const fixtures = await Fixture.find({ status: { $ne: 'Completed' } })
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url')
      .sort({ match_date: 1 });

    const upcomingMatches = fixtures.map(f => {
      const homeName = f.home_team?.name || 'ClubVerse FC';
      const awayName = f.away_team?.name || 'Opponent';
      const isHome = homeName.toLowerCase().includes('clubverse');
      const opponent = isHome ? awayName : homeName;

      const d = f.match_date ? new Date(f.match_date) : new Date();
      const formattedDate = isNaN(d.getTime())
        ? 'TBD'
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

      return {
        id: f._id,
        opponent: opponent,
        homeTeam: homeName,
        awayTeam: awayName,
        homeTeamObj: f.home_team,
        awayTeamObj: f.away_team,
        date: formattedDate,
        time: f.match_time || '20:00 GMT',
        venue: f.venue || (isHome ? 'ClubVerse Arena (Home)' : `${opponent} Stadium (Away)`),
        status: f.status || 'Upcoming'
      };
    });

    // Build real-time audit activity feed from latest MongoDB records
    const recentPlayers = await Player.find().sort({ createdAt: -1, _id: -1 }).limit(4);
    const recentCoaches = await Coach.find().sort({ createdAt: -1, _id: -1 }).limit(3);
    const recentUsers = await User.find().sort({ created_at: -1, _id: -1 }).limit(3);
    const recentFixtures = await Fixture.find().sort({ created_at: -1, _id: -1 }).limit(3);

    const activities = [];

    recentPlayers.forEach(p => {
      const dateVal = p.createdAt || (p._id ? p._id.getTimestamp() : new Date());
      activities.push({
        id: `p-${p._id}`,
        title: `${p.full_name} registered in squad (${p.position || 'Forward'})`,
        type: 'Player Registration',
        time: formatTimeAgo(dateVal),
        timestamp: new Date(dateVal).getTime(),
        user: 'Admin'
      });
    });

    recentCoaches.forEach(c => {
      const dateVal = c.createdAt || (c._id ? c._id.getTimestamp() : new Date());
      activities.push({
        id: `c-${c._id}`,
        title: `${c.full_name} appointed as ${c.specialization || 'Tactical Coach'}`,
        type: 'Coach Appointed',
        time: formatTimeAgo(dateVal),
        timestamp: new Date(dateVal).getTime(),
        user: 'Admin'
      });
    });

    recentUsers.forEach(u => {
      const dateVal = u.created_at || (u._id ? u._id.getTimestamp() : new Date());
      activities.push({
        id: `u-${u._id}`,
        title: `${u.full_name || u.email || 'Fan'} registered in MongoDB user system`,
        type: 'User Registration',
        time: formatTimeAgo(dateVal),
        timestamp: new Date(dateVal).getTime(),
        user: 'System'
      });
    });

    recentFixtures.forEach(f => {
      const dateVal = f.created_at || (f._id ? f._id.getTimestamp() : new Date());
      activities.push({
        id: `f-${f._id}`,
        title: `Matchday fixture vs ${f.away_team?.name || f.home_team?.name || 'Opponent'} synchronized`,
        type: 'Fixture Sync',
        time: formatTimeAgo(dateVal),
        timestamp: new Date(dateVal).getTime(),
        user: 'MongoDB'
      });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      totalPlayers,
      activePlayers,
      totalCoaches,
      activeCoaches,
      upcomingMatchesCount: upcomingMatches.length,
      recentActivitiesCount: activities.length,
      upcomingMatches,
      recentActivities: activities.slice(0, 6)
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch admin stats' });
  }
});

// Helper function to calculate player statistics from DB
const computePlayerStatsFromDB = async (players) => {
  try {
    if (!Array.isArray(players) || players.length === 0) return players || [];
    let fixtures = [];
    try {
      fixtures = await Fixture.find().populate('home_team', 'name short_name').populate('away_team', 'name short_name').lean();
    } catch (fErr) {
      console.warn('Fetch fixtures in computePlayerStatsFromDB warning:', fErr.message);
      fixtures = await Fixture.find().lean();
    }

    const clubVerseCompletedMatchesCount = fixtures.filter(fix => {
      if (fix.status !== 'Completed') return false;
      const homeName = (fix.home_team?.name || fix.home_team || '').toString().toLowerCase();
      const homeShort = (fix.home_team?.short_name || '').toString().toUpperCase();
      const awayName = (fix.away_team?.name || fix.away_team || '').toString().toLowerCase();
      const awayShort = (fix.away_team?.short_name || '').toString().toUpperCase();
      return homeShort === 'CVFC' || homeName.includes('clubverse') || awayShort === 'CVFC' || awayName.includes('clubverse');
    }).length;

    return players.map(p => {
      if (!p) return p;
      const pidStr = p._id ? p._id.toString() : '';
      const pNameLower = (p.full_name || '').toLowerCase();
      let dbGoals = p.goals || 0;
      let dbAssists = p.assists || 0;
      let perfMatchesCount = 0;
      let ratingSum = 0;
      let ratingCount = 0;

      fixtures.forEach(fix => {
        if (fix.player_performances && Array.isArray(fix.player_performances)) {
          const perf = fix.player_performances.find(
            item => (item.player_id && item.player_id.toString() === pidStr) ||
                    (item.player_name && item.player_name.toLowerCase() === pNameLower)
          );
          if (perf) {
            perfMatchesCount += 1;
            dbGoals += (perf.goals || 0);
            dbAssists += (perf.assists || 0);
            if (perf.rating && perf.rating > 0) {
              ratingSum += perf.rating;
              ratingCount += 1;
            }
          }
        }
      });

      const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : (p.rating || 0);
      const totalMatches = Math.max(perfMatchesCount, clubVerseCompletedMatchesCount, p.matches || 0);

      return {
        ...p,
        goals: dbGoals,
        assists: dbAssists,
        matches: totalMatches,
        rating: Number(avgRating)
      };
    });
  } catch (err) {
    console.error('computePlayerStatsFromDB error:', err.message);
    return players || [];
  }
};

// GET All Players (Public / Fan Endpoint)
app.get('/api/players', async (req, res) => {
  try {
    await seedInitialData();
    const players = await Player.find().sort({ createdAt: -1 }).lean();
    const result = await computePlayerStatsFromDB(players);
    res.json(result);
  } catch (err) {
    console.error('GET /api/players error:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch players' });
  }
});

// GET All Players (Admin Endpoint)
app.get('/api/admin/players', async (req, res) => {
  try {
    await seedInitialData();
    const players = await Player.find().sort({ createdAt: -1 }).lean();
    const result = await computePlayerStatsFromDB(players);
    res.json(result);
  } catch (err) {
    console.error('GET /api/admin/players error:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch players' });
  }
});

// POST Add New Player
app.post('/api/admin/players', async (req, res) => {
  try {
    const {
      full_name,
      email,
      position,
      jersey_number,
      date_of_birth,
      phone,
      nationality,
      preferred_foot,
      height,
      weight,
      contract_term,
      role_access,
      market_value,
      medical_clearance,
      bio,
      profile_image,
      status
    } = req.body;

    if (!full_name || !position) {
      return res.status(400).json({ message: 'Player full name and position are required.' });
    }

    const newPlayer = await Player.create({
      full_name,
      email: email || '',
      position,
      jersey_number: jersey_number ? parseInt(jersey_number) : null,
      date_of_birth: date_of_birth || '',
      phone: phone || '',
      nationality: nationality || '',
      preferred_foot: preferred_foot || 'Left',
      height: height || '178 cm',
      weight: weight || '72 kg',
      contract_term: contract_term || 'June 2029',
      role_access: role_access || 'First Team Professional Player',
      market_value: market_value || '€120M',
      medical_clearance: medical_clearance || '100% Match Fit',
      bio: bio || 'Passionate ClubVerse VIP Supporter ⚽',
      profile_image: profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      status: status || 'Active'
    });

    // Also create / update a User account for this player so login works correctly
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      let userAccount = await User.findOne({ email: cleanEmail });
      const tempPassword = `player_${Date.now()}`;
      const setupToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

      if (!userAccount) {
        userAccount = await User.create({
          full_name,
          email: cleanEmail,
          password: tempPassword,
          role: 'Player',
          must_change_password: true,
          status: status || 'Active',
          phone: phone || null,
          profile_image: profile_image || null,
          bio: bio || null
        });
      } else {
        // Update existing user to Player role
        userAccount.role = 'Player';
        userAccount.must_change_password = true;
        userAccount.full_name = full_name;
        userAccount.status = status || 'Active';
        await userAccount.save();
      }

      // Store invite token (valid 48 hours)
      inviteTokenStore.set(setupToken, {
        email: cleanEmail,
        role: 'Player',
        expiresAt: Date.now() + 48 * 60 * 60 * 1000
      });

      // Send invitation email
      try {
        const transporter = await createTransporter();
        if (transporter) {
          const setupLink = `http://localhost:5173/setup-password?token=${setupToken}`;
          const senderAddress = process.env.EMAIL_USER ? `"ClubVerse FC" <${process.env.EMAIL_USER}>` : '"ClubVerse FC" <no-reply@clubverse.com>';
          await transporter.sendMail({
            from: senderAddress,
            to: cleanEmail,
            subject: `Welcome to ClubVerse FC – Set Your Player Password`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e1d8; border-radius: 20px; background-color: #fffdf8;">
                <h2 style="color: #20221f; font-family: Georgia, serif; margin-top: 0;">Welcome to ClubVerse FC ⚽</h2>
                <p style="color: #6f716b; font-size: 14px;">Hi <strong>${full_name}</strong>, you have been added as a <strong>Player</strong> to ClubVerse FC.</p>
                <p style="color: #6f716b; font-size: 14px;">Click the button below to set your password and access your Player Dashboard.</p>
                <a href="${setupLink}" style="display: inline-block; margin: 18px 0; padding: 14px 28px; background-color: #7a8b5a; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">Set My Password →</a>
                <p style="color: #999; font-size: 12px;">This link expires in 48 hours. If you did not expect this email, please ignore it.</p>
                <hr style="border: none; border-top: 1px solid #e4e1d8; margin-top: 24px;" />
                <p style="color: #999; font-size: 11px; margin-bottom: 0;">© 2026 ClubVerse FC • Spotify Arena Platform</p>
              </div>
            `
          });
          console.log(`✉️ Player invitation email sent to ${cleanEmail}`);
        }
      } catch (emailErr) {
        console.warn('Failed to send player invite email:', emailErr.message);
      }
    }

    res.status(201).json({ message: 'Player created successfully! Invitation email sent.', player: newPlayer });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create player' });
  }
});

// PUT Edit Player
app.put('/api/admin/players/:id', async (req, res) => {
  try {
    const {
      full_name,
      email,
      position,
      jersey_number,
      date_of_birth,
      phone,
      nationality,
      preferred_foot,
      height,
      weight,
      contract_term,
      role_access,
      market_value,
      medical_clearance,
      bio,
      profile_image,
      status
    } = req.body;

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email,
        position,
        jersey_number: jersey_number ? parseInt(jersey_number) : null,
        date_of_birth,
        phone,
        nationality: nationality || '',
        preferred_foot: preferred_foot || 'Left',
        height: height || '178 cm',
        weight: weight || '72 kg',
        contract_term: contract_term || 'June 2029',
        role_access: role_access || 'First Team Professional Player',
        market_value: market_value || '€120M',
        medical_clearance: medical_clearance || '100% Match Fit',
        bio: bio || 'Passionate ClubVerse VIP Supporter ⚽',
        profile_image,
        status
      },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Player not found.' });
    }

    // Sync the User account role to 'Player' if email exists
    if (updatedPlayer.email) {
      const cleanEmail = updatedPlayer.email.toLowerCase();
      const userAccount = await User.findOne({ email: cleanEmail });
      if (userAccount && userAccount.role !== 'Player') {
        userAccount.role = 'Player';
        await userAccount.save();
      }
    }

    res.json({ message: 'Player details updated successfully!', player: updatedPlayer });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update player' });
  }
});

// DELETE Delete Player
app.delete('/api/admin/players/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    // Also remove the User account linked to this player
    if (deletedPlayer.email) {
      await User.deleteOne({ email: deletedPlayer.email.toLowerCase() });
    }
    res.json({ message: 'Player deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete player' });
  }
});

// GET All Coaches
app.get('/api/admin/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch coaches' });
  }
});

// POST Add New Coach
app.post('/api/admin/coaches', async (req, res) => {
  try {
    const { full_name, email, phone, specialization, experience, nationality, profile_image, status } = req.body;

    if (!full_name) {
      return res.status(400).json({ message: 'Coach full name is required.' });
    }

    const newCoach = await Coach.create({
      full_name,
      email: email || '',
      phone: phone || '',
      specialization: specialization || 'General Tactics',
      experience: experience ? parseInt(experience) : 0,
      nationality: nationality || '',
      profile_image: profile_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      status: status || 'Active'
    });

    // Also create / update a User account for this coach so login works correctly
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      let userAccount = await User.findOne({ email: cleanEmail });
      const tempPassword = `coach_${Date.now()}`;
      const setupToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

      if (!userAccount) {
        userAccount = await User.create({
          full_name,
          email: cleanEmail,
          password: tempPassword,
          role: 'Coach',
          must_change_password: true,
          status: status || 'Active',
          phone: phone || null,
          profile_image: profile_image || null
        });
      } else {
        // Update existing user to Coach role
        userAccount.role = 'Coach';
        userAccount.must_change_password = true;
        userAccount.full_name = full_name;
        userAccount.status = status || 'Active';
        await userAccount.save();
      }

      // Store invite token (valid 48 hours)
      inviteTokenStore.set(setupToken, {
        email: cleanEmail,
        role: 'Coach',
        expiresAt: Date.now() + 48 * 60 * 60 * 1000
      });

      // Send invitation email
      try {
        const transporter = await createTransporter();
        if (transporter) {
          const setupLink = `http://localhost:5173/setup-password?token=${setupToken}`;
          const senderAddress = process.env.EMAIL_USER ? `"ClubVerse FC" <${process.env.EMAIL_USER}>` : '"ClubVerse FC" <no-reply@clubverse.com>';
          await transporter.sendMail({
            from: senderAddress,
            to: cleanEmail,
            subject: `Welcome to ClubVerse FC – Set Your Coach Password`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e1d8; border-radius: 20px; background-color: #fffdf8;">
                <h2 style="color: #20221f; font-family: Georgia, serif; margin-top: 0;">Welcome to ClubVerse FC ⚽</h2>
                <p style="color: #6f716b; font-size: 14px;">Hi <strong>${full_name}</strong>, you have been appointed as a <strong>Coach</strong> at ClubVerse FC.</p>
                <p style="color: #6f716b; font-size: 14px;">Click the button below to set your password and access your Coach Dashboard.</p>
                <a href="${setupLink}" style="display: inline-block; margin: 18px 0; padding: 14px 28px; background-color: #7a8b5a; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">Set My Password →</a>
                <p style="color: #999; font-size: 12px;">This link expires in 48 hours. If you did not expect this email, please ignore it.</p>
                <hr style="border: none; border-top: 1px solid #e4e1d8; margin-top: 24px;" />
                <p style="color: #999; font-size: 11px; margin-bottom: 0;">© 2026 ClubVerse FC • Spotify Arena Platform</p>
              </div>
            `
          });
          console.log(`✉️ Coach invitation email sent to ${cleanEmail}`);
        }
      } catch (emailErr) {
        console.warn('Failed to send coach invite email:', emailErr.message);
      }
    }

    res.status(201).json({ message: 'Coach created successfully! Invitation email sent.', coach: newCoach });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create coach' });
  }
});

// PUT Edit Coach
app.put('/api/admin/coaches/:id', async (req, res) => {
  try {
    const { full_name, email, phone, specialization, experience, nationality, profile_image, status } = req.body;

    const updatedCoach = await Coach.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email,
        phone,
        specialization,
        experience: experience ? parseInt(experience) : 0,
        nationality: nationality || '',
        profile_image,
        status
      },
      { new: true }
    );

    if (!updatedCoach) {
      return res.status(404).json({ message: 'Coach not found.' });
    }

    // Sync the User account role to 'Coach' if email exists
    if (updatedCoach.email) {
      const cleanEmail = updatedCoach.email.toLowerCase();
      const userAccount = await User.findOne({ email: cleanEmail });
      if (userAccount && userAccount.role !== 'Coach') {
        userAccount.role = 'Coach';
        await userAccount.save();
        console.log(`🔄 Synced User role to Coach for: ${cleanEmail}`);
      }
    }

    res.json({ message: 'Coach details updated successfully!', coach: updatedCoach });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update coach' });
  }
});

// DELETE Delete Coach
app.delete('/api/admin/coaches/:id', async (req, res) => {
  try {
    const deletedCoach = await Coach.findByIdAndDelete(req.params.id);
    if (!deletedCoach) {
      return res.status(404).json({ message: 'Coach not found.' });
    }
    // Also remove the User account linked to this coach
    if (deletedCoach.email) {
      await User.deleteOne({ email: deletedCoach.email.toLowerCase() });
    }
    res.json({ message: 'Coach deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete coach' });
  }
});

// POST Verify Setup Token (for invitation link email)
app.get('/api/auth/setup-password/:token', async (req, res) => {
  const { token } = req.params;
  const record = inviteTokenStore.get(token);
  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'This invitation link has expired or is invalid. Please contact your admin.' });
  }
  res.json({ email: record.email, role: record.role });
});

// POST Setup Password via Invitation Token
app.post('/api/auth/setup-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const record = inviteTokenStore.get(token);
    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: 'This invitation link has expired or is invalid.' });
    }

    const user = await User.findOne({ email: record.email });
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    user.password = newPassword;
    user.must_change_password = false;
    await user.save();

    // Invalidate token after use
    inviteTokenStore.delete(token);

    res.json({
      message: 'Password set successfully! You can now log in.',
      user: {
        id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        mustChangePassword: false
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to set password.' });
  }
});

// --- STADIUM BOOKING API ENDPOINTS ---

// --- STADIUM BOOKING API ENDPOINTS ---

const INITIAL_SEED_BOOKINGS = [
  {
    stadium_id: "apex-central",
    stadium_name: "Apex Central Arena",
    stadium_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    location: "London, UK • East End District",
    user_id: "guest",
    user_name: "Alexander Wright",
    user_email: "alexander.wright@clubverse.com",
    user_phone: "+44 7700 900077",
    team_name: "ClubVerse Fan XI",
    special_notes: "Request main gate entry pass.",
    booking_date: "2026-08-15",
    match_title: "ClubVerse FC vs Northern Derby",
    selected_seats: ["Block A (Row 1, Seat 4)", "Block A (Row 1, Seat 5)"],
    total_seats: 2,
    hourly_rate: 250,
    total_price: 145,
    payment_method: "Fan Wallet Balance",
    payment_status: "Paid",
    booking_status: "Confirmed"
  }
];

// Get all stadium bookings (optionally filter by user_id or stadium_id)
app.get('/api/stadium-bookings', async (req, res) => {
  try {
    const { user_id, stadium_id, status } = req.query;
    let query = {};
    if (user_id) query.user_id = user_id;
    if (stadium_id) query.stadium_id = stadium_id;
    if (status) query.booking_status = status;

    let bookings = await StadiumBooking.find(query).sort({ created_at: -1 });
    if (bookings.length === 0 && !user_id && !stadium_id && !status) {
      bookings = await StadiumBooking.insertMany(INITIAL_SEED_BOOKINGS);
      console.log('✅ Seeded initial stadium bookings collection in MongoDB.');
    }
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch stadium bookings.' });
  }
});

// Create a new stadium booking (saved directly to MongoDB)
app.post('/api/stadium-bookings', async (req, res) => {
  try {
    const {
      stadium_id,
      stadium_name,
      stadium_image,
      location,
      user_id,
      user_name,
      user_email,
      user_phone,
      team_name,
      special_notes,
      booking_date,
      match_title,
      selected_seats,
      total_seats,
      time_slot,
      duration_hours,
      hourly_rate,
      total_price,
      payment_method
    } = req.body;

    if (!stadium_id || !booking_date || !user_name || !user_email || !total_price) {
      return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    const booking = await StadiumBooking.create({
      stadium_id,
      stadium_name,
      stadium_image: stadium_image || '',
      location: location || '',
      user_id: user_id || 'guest',
      user_name,
      user_email,
      user_phone: user_phone || '',
      team_name: team_name || '',
      special_notes: special_notes || '',
      booking_date,
      match_title: match_title || 'ClubVerse Matchday',
      selected_seats: Array.isArray(selected_seats) ? selected_seats : [],
      total_seats: total_seats || (selected_seats ? selected_seats.length : 1),
      time_slot: time_slot || 'Matchday Session',
      duration_hours: duration_hours || 2,
      hourly_rate: hourly_rate || 150,
      total_price: Number(total_price),
      payment_method: payment_method || 'Fan Wallet Balance',
      payment_status: 'Paid',
      booking_status: 'Pending' // Requires Admin Approval
    });

    // Send email confirmation asynchronously to fan
    (async () => {
      try {
        const recipient = (user_email || '').trim() || 'soccer097711@gmail.com';
        const transporter = await createTransporter();
        if (transporter && recipient) {
          const senderAddress = process.env.EMAIL_USER ? `"ClubVerse Stadiums" <${process.env.EMAIL_USER}>` : '"ClubVerse Stadiums" <no-reply@clubverse.com>';
          await transporter.sendMail({
            from: senderAddress,
            to: recipient,
            subject: `🏟️ Stadium Reservation Received: ${stadium_name || 'Campnow'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #F7F5EF; border-radius: 24px;">
                <div style="background-color: #20221F; color: #ffffff; padding: 24px; border-radius: 20px; text-align: center;">
                  <h1 style="font-family: Georgia, serif; margin: 0; color: #BEF264; font-size: 24px;">ClubVerse Stadiums</h1>
                  <p style="margin: 6px 0 0 0; color: #a1a1aa; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Reservation Request Confirmation</p>
                </div>
                <div style="background-color: #FFFDF8; border: 1px solid #E4E1D8; border-radius: 20px; padding: 24px; margin-top: 16px;">
                  <h2 style="color: #20221F; margin-top: 0; font-size: 18px;">Hello ${user_name || 'Fan'},</h2>
                  <p style="color: #6F716B; font-size: 14px;">
                    We have received your stadium reservation request for <strong>${stadium_name || 'Stadium'}</strong>!
                  </p>
                  <div style="background-color: #F7F5EF; border: 1px solid #E4E1D8; border-radius: 16px; padding: 18px; margin: 16px 0; font-size: 13px; color: #6F716B;">
                    <div>📅 <strong>Date:</strong> ${booking_date}</div>
                    <div>🕒 <strong>Slot:</strong> ${time_slot || 'Matchday Session'}</div>
                    <div>💰 <strong>Total Paid:</strong> ₹${Number(total_price).toLocaleString('en-IN')}</div>
                    <div>💳 <strong>Payment Method:</strong> ${payment_method || 'Paid'}</div>
                  </div>
                </div>
              </div>
            `
          });
          console.log(`✉️ Stadium booking email sent to fan (${recipient})`);
        }
      } catch (err) {
        console.warn('⚠️ Error sending stadium booking email:', err.message);
      }
    })();

    res.status(201).json({ success: true, booking, message: 'Stadium booking request submitted for Admin approval!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to process stadium booking.' });
  }
});

// ADMIN ENDPOINT: Update Booking Status (Accept / Approve or Reject)
app.patch('/api/stadium-bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Confirmed' (Accepted), 'Rejected', 'Completed'

    if (!['Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status.' });
    }

    const booking = await StadiumBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found.' });
    }

    booking.booking_status = status;
    await booking.save();

    res.json({ success: true, booking, message: `Booking status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update booking status.' });
  }
});

// Cancel a stadium booking (Fan action)
app.patch('/api/stadium-bookings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await StadiumBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found.' });
    }

    booking.booking_status = 'Cancelled';
    await booking.save();

    res.json({ success: true, booking, message: 'Booking has been cancelled.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to cancel booking.' });
  }
});

// --- STADIUM MANAGEMENT API ENDPOINTS (ADMIN & FAN) ---

// Initial seed data for stadiums
const DEFAULT_SEED_STADIUMS = [
  {
    name: "Campnow",
    location: "London, UK • East End District",
    capacity: "250 Seats • 11v11 FIFA Pitch",
    price_per_hour: 5000,
    availability_status: "Available",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80"
    ],
    pitch_type: "Hybrid Desso GrassMaster",
    dimensions: "105m x 68m (UEFA Standard)",
    description: "The flagship stadium of ClubVerse FC featuring state-of-the-art hybrid grass pitch, 50 VIP seats, 120 pitchside seats, and 80 outer stand seats.",
    facilities: [
      "250 Total Seats Capacity",
      "50 VIP Platinum Seats",
      "120 Pitchside Seats (4x30)",
      "80 Outer Stand Seats (4x20)",
      "FIFA Certified Hybrid Turf",
      "4K Floodlight System",
      "Press & Media Center"
    ],
    blocked_dates: [],
    seating_tiers: [
      { name: 'VIP Seats', price: 5000, seats_info: '50 Seats (25 North / 25 South)', total_seats: 50 },
      { name: '4 Side Prime', price: 3000, seats_info: '30 Seats Each Side (Total 120 Seats)', total_seats: 120 },
      { name: '4 Side Regular', price: 1000, seats_info: '20 Seats Each Side (Total 80 Seats)', total_seats: 80 }
    ],
    rating: 4.9,
    reviews_count: 128
  },
  {
    name: "Metropolis Olympic Arena",
    location: "Manchester, UK • Sports City Hub",
    capacity: "250 Seats • Convertible Pitch",
    price_per_hour: 3000,
    availability_status: "Available",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80"
    ],
    pitch_type: "Shock-Absorbing 4G Synthetic",
    dimensions: "100m x 64m",
    description: "A futuristic 250-seat stadium venue equipped with shock-absorbing synthetic turf and digital scoreboards.",
    facilities: [
      "250 Seats Circular Arena",
      "Shock-Absorbing 4G Turf",
      "Indoor Warmup Facility",
      "Digital HD Scoreboard",
      "4 Team Dressing Rooms"
    ],
    blocked_dates: [],
    seating_tiers: [
      { name: 'VIP Seats', price: 5000, seats_info: '50 Seats (25 North / 25 South)', total_seats: 50 },
      { name: '4 Side Prime', price: 3000, seats_info: '30 Seats Each Side (Total 120 Seats)', total_seats: 120 },
      { name: '4 Side Regular', price: 1000, seats_info: '20 Seats Each Side (Total 80 Seats)', total_seats: 80 }
    ],
    rating: 4.8,
    reviews_count: 94
  }
];

// GET all stadiums (auto-seeds defaults if collection is empty, normalizes 1000->250)
app.get('/api/stadiums', async (req, res) => {
  try {
    let stadiums = await Stadium.find().sort({ created_at: -1 });
    if (stadiums.length === 0) {
      stadiums = await Stadium.insertMany(DEFAULT_SEED_STADIUMS);
      console.log('✅ Seeded initial stadium collection in MongoDB.');
    } else {
      // Normalize any older 1000 seats records & ensure seating_tiers exist
      let updatedAny = false;
      for (let s of stadiums) {
        let changed = false;
        if (!s.capacity || s.capacity.includes('1,000') || s.capacity.includes('1000')) {
          s.capacity = '250 Seats';
          changed = true;
        }
        if (!s.seating_tiers || s.seating_tiers.length === 0) {
          s.seating_tiers = [
            { name: 'VIP Seats', price: 5000, seats_info: '50 Seats (25 North / 25 South)', total_seats: 50 },
            { name: '4 Side Prime', price: 3000, seats_info: '30 Seats Each Side (Total 120 Seats)', total_seats: 120 },
            { name: '4 Side Regular', price: 1000, seats_info: '20 Seats Each Side (Total 80 Seats)', total_seats: 80 }
          ];
          changed = true;
        }
        if (changed) {
          await s.save();
          updatedAny = true;
        }
      }
      if (updatedAny) {
        stadiums = await Stadium.find().sort({ created_at: -1 });
      }
    }
    res.json({ success: true, stadiums });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch stadiums.' });
  }
});

// POST create new stadium (Admin)
app.post('/api/stadiums', async (req, res) => {
  try {
    const {
      name,
      location,
      capacity,
      price_per_hour,
      availability_status,
      image,
      gallery,
      description,
      pitch_type,
      dimensions,
      facilities,
      blocked_dates,
      seating_tiers
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Stadium Name and Location are required.' });
    }

    const defaultTiers = [
      { name: 'VIP Seats', price: 5000, seats_info: '50 Seats (25 North / 25 South)', total_seats: 50 },
      { name: '4 Side Prime', price: 3000, seats_info: '30 Seats Each Side (Total 120 Seats)', total_seats: 120 },
      { name: '4 Side Regular', price: 1000, seats_info: '20 Seats Each Side (Total 80 Seats)', total_seats: 80 }
    ];

    const newStadium = await Stadium.create({
      name,
      location,
      capacity: capacity && !capacity.includes('1,000') ? capacity : '250 Seats',
      price_per_hour: Number(price_per_hour) || 0,
      availability_status: availability_status || 'Available',
      image: image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
      gallery: Array.isArray(gallery) ? gallery : [],
      description: description || '',
      pitch_type: pitch_type || 'FIFA Certified Hybrid Grass',
      dimensions: dimensions || '105m x 68m (UEFA Standard)',
      facilities: Array.isArray(facilities) ? facilities : ['Floodlight System', 'Dressing Locker Rooms'],
      blocked_dates: Array.isArray(blocked_dates) ? blocked_dates : [],
      seating_tiers: Array.isArray(seating_tiers) && seating_tiers.length > 0 ? seating_tiers : defaultTiers
    });

    res.status(201).json({ success: true, stadium: newStadium, message: 'Stadium created successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create stadium.' });
  }
});

// PUT update existing stadium (Admin)
app.put('/api/stadiums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found.' });
    }

    const updates = req.body;
    Object.assign(stadium, updates);
    if (updates.seating_tiers) {
      stadium.markModified('seating_tiers');
    }
    await stadium.save();

    res.json({ success: true, stadium, message: 'Stadium updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update stadium.' });
  }
});

// DELETE stadium (Admin)
app.delete('/api/stadiums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stadium.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Stadium not found.' });
    }
    res.json({ success: true, message: 'Stadium deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete stadium.' });
  }
});

// ============================================================
// TEAM MANAGEMENT ROUTES (Admin — Max 10 Teams)
// ============================================================

const DEFAULT_TEAMS = [
  { name: 'ClubVerse FC', short_name: 'CVFC', logo_color: '#EF4444', logo_url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' },
  { name: 'Manchester City', short_name: 'MCY', logo_color: '#06B6D4', logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Real Madrid', short_name: 'RMA', logo_color: '#EAB308', logo_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80' },
  { name: 'FC Barcelona', short_name: 'BAR', logo_color: '#EF4444', logo_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80' },
  { name: 'Arsenal FC', short_name: 'ARS', logo_color: '#DC2626', logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80' }
];

// GET all teams (auto-seeds defaults if empty)
app.get('/api/teams', async (req, res) => {
  try {
    let teams = await Team.find().sort({ created_at: -1 });
    if (teams.length === 0) {
      teams = await Team.insertMany(DEFAULT_TEAMS);
      console.log('✅ Seeded initial teams in MongoDB.');
    }
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch teams.' });
  }
});

// POST create team (max 10 enforced)
app.post('/api/teams', async (req, res) => {
  try {
    const { name, short_name, logo_color, logo_url } = req.body;
    if (!name || !short_name) {
      return res.status(400).json({ message: 'Team name and short name are required.' });
    }

    const count = await Team.countDocuments();
    if (count >= 10) {
      return res.status(400).json({ message: 'Maximum of 10 teams allowed. Delete a team before adding a new one.' });
    }

    const existing = await Team.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'A team with this name already exists.' });
    }

    const team = await Team.create({
      name: name.trim(),
      short_name: short_name.trim().toUpperCase().slice(0, 4),
      logo_color: logo_color || '#3B82F6',
      logo_url: logo_url || ''
    });

    res.status(201).json({ success: true, team, message: 'Team created successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create team.' });
  }
});

// PUT update team
app.put('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: 'Team not found.' });

    const { name, short_name, logo_color, logo_url } = req.body;
    if (name) team.name = name.trim();
    if (short_name) team.short_name = short_name.trim().toUpperCase().slice(0, 4);
    if (logo_color !== undefined) team.logo_color = logo_color;
    if (logo_url !== undefined) team.logo_url = logo_url;
    await team.save();

    res.json({ success: true, team, message: 'Team updated successfully!' });
  } catch (err) {
    console.error('Update team error:', err);
    res.status(500).json({ message: err.message || 'Failed to update team.' });
  }
});

// DELETE team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Team not found.' });
    res.json({ success: true, message: 'Team deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete team.' });
  }
});

// ============================================================
// FIXTURE MANAGEMENT ROUTES (Admin)
// ============================================================

// Helper to generate a full round-robin season schedule for all teams in DB
async function generateLeagueSchedule(forceRecreate = false) {
  const teams = await Team.find();
  if (teams.length < 2) return [];

  const firstStadium = await Stadium.findOne();
  const dbStadiumName = firstStadium ? firstStadium.name : 'Campnow';

  const existingCount = await Fixture.countDocuments();
  if (!forceRecreate && existingCount >= teams.length * 2) {
    return await Fixture.find()
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url')
      .sort({ match_date: 1 });
  }

  if (forceRecreate) {
    await Fixture.deleteMany({});
  }

  const times = ['15:00 BST', '17:30 BST', '20:00 BST', '19:45 BST', '16:30 BST'];
  const formations = [
    '4-3-3 High Press',
    '4-2-3-1 Mid-Block',
    '3-5-2 Counter Attack',
    '4-4-2 Diamond',
    '4-1-4-1 Control Possession'
  ];
  const coachNotesList = [
    'Excellent execution of wing overloads and defensive transitions.',
    'Clean sheet achieved. High pressing trapped opponent in build-up phase.',
    'Solid tactical discipline and midfield dominance throughout 90 minutes.',
    'Fast counter-attacking play exploited space behind the opposition high line.',
    'Dominant aerial performance and set-piece efficiency secured the result.'
  ];

  const teamList = [...teams];
  if (teamList.length % 2 !== 0) {
    teamList.push(null);
  }

  const n = teamList.length;
  const numRounds = n - 1;
  const half = n / 2;

  const fixturesToInsert = [];
  const baseDate = new Date();
  baseDate.setHours(16, 0, 0, 0);

  // Offset matchday dates: start completed matches 10 days ago, upcoming matches ahead
  let matchDayOffset = -12;

  for (let round = 0; round < numRounds; round++) {
    const roundDate = new Date(baseDate.getTime() + matchDayOffset * 24 * 60 * 60 * 1000);
    const isPast = matchDayOffset < 0;

    for (let i = 0; i < half; i++) {
      const home = teamList[i];
      const away = teamList[n - 1 - i];

      if (home && away) {
        const actualHome = round % 2 === 0 ? home : away;
        const actualAway = round % 2 === 0 ? away : home;

        const exists = await Fixture.findOne({
          home_team: actualHome._id,
          away_team: actualAway._id
        });

        if (!exists) {
          const homeScore = Math.floor(Math.random() * 4);
          const awayScore = Math.floor(Math.random() * 3);
          const status = isPast ? 'Completed' : 'Upcoming';

          fixturesToInsert.push({
            home_team: actualHome._id,
            away_team: actualAway._id,
            match_date: roundDate,
            match_time: times[fixturesToInsert.length % times.length],
            venue: (actualHome.name || '').toLowerCase().includes('clubverse') ? dbStadiumName : `${actualHome.name} Stadium`,
            status: status,
            home_score: isPast ? homeScore : undefined,
            away_score: isPast ? awayScore : undefined,
            coach_notes: isPast ? coachNotesList[fixturesToInsert.length % coachNotesList.length] : undefined,
            tactical_formation: formations[fixturesToInsert.length % formations.length],
            squad_readiness: 'Roster Finalized',
            competition: 'Premier League'
          });
        }
      }
    }

    const last = teamList.pop();
    teamList.splice(1, 0, last);
    matchDayOffset += 3;
  }

  if (fixturesToInsert.length > 0) {
    await Fixture.insertMany(fixturesToInsert);
    console.log(`✅ Auto-generated ${fixturesToInsert.length} league fixtures across ${teams.length} teams.`);
  }

  return await Fixture.find()
    .populate('home_team', 'name short_name logo_color logo_url')
    .populate('away_team', 'name short_name logo_color logo_url')
    .sort({ match_date: 1 });
}

// Helper to auto-seed initial fixtures if empty
async function ensureDefaultFixtures() {
  const firstStadium = await Stadium.findOne();
  const dbStadiumName = firstStadium ? firstStadium.name : 'Campnow';

  let teams = await Team.find();
  if (teams.length < 2) {
    teams = await Team.insertMany(DEFAULT_TEAMS);
  }

  let fixtures = await Fixture.find();
  if (fixtures.length < 4 && teams.length >= 2) {
    await generateLeagueSchedule(false);
  } else {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let f of fixtures) {
      if (!f.venue || f.venue === 'Apex Central Arena' || f.venue === 'ClubVerse Arena') {
        f.venue = dbStadiumName;
        await f.save();
      }
    }
  }
}

// GET all fixtures (populated with team data from MongoDB DB)
app.get('/api/fixtures', async (req, res) => {
  try {
    await ensureDefaultFixtures();
    const fixtures = await Fixture.find()
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url')
      .sort({ match_date: 1 });
    res.json(fixtures);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch fixtures.' });
  }
});

// GET upcoming fixtures only (fetches admin-added fixtures from MongoDB DB)
app.get('/api/fixtures/upcoming', async (req, res) => {
  try {
    await ensureDefaultFixtures();
    const fixtures = await Fixture.find({ status: { $ne: 'Completed' } })
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url')
      .sort({ match_date: 1 });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Filter out matches whose match_date is before today
    const upcomingOnly = fixtures.filter(f => {
      if (!f.match_date) return true;
      return new Date(f.match_date).getTime() >= startOfToday.getTime();
    });

    res.json(upcomingOnly);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch upcoming fixtures.' });
  }
});

// POST generate round-robin season schedule for all teams
app.post('/api/fixtures/generate-league', async (req, res) => {
  try {
    const fixtures = await generateLeagueSchedule(true);
    res.json({
      success: true,
      message: `Successfully generated season schedule with ${fixtures.length} fixtures!`,
      fixtures
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to generate league schedule.' });
  }
});

// POST create fixture
app.post('/api/fixtures', async (req, res) => {
  try {
    const { home_team, away_team, match_date, match_time, venue } = req.body;
    if (!home_team || !away_team || !match_date || !match_time) {
      return res.status(400).json({ message: 'Home team, away team, match date, and match time are required.' });
    }
    if (home_team === away_team) {
      return res.status(400).json({ message: 'Home and away teams must be different.' });
    }

    const fixture = await Fixture.create({
      home_team,
      away_team,
      match_date: new Date(match_date),
      match_time,
      venue: venue || 'ClubVerse Arena'
    });

    const populated = await Fixture.findById(fixture._id)
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url');

    res.status(201).json({ success: true, fixture: populated, message: 'Fixture created successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create fixture.' });
  }
});

// PUT update fixture
app.put('/api/fixtures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fixture = await Fixture.findById(id);
    if (!fixture) return res.status(404).json({ message: 'Fixture not found.' });

    const { home_team, away_team, match_date, match_time, venue, status, home_score, away_score, player_performances } = req.body;
    if (home_team) fixture.home_team = home_team;
    if (away_team) fixture.away_team = away_team;
    if (match_date) fixture.match_date = new Date(match_date);
    if (match_time) fixture.match_time = match_time;
    if (venue) fixture.venue = venue;
    if (status) fixture.status = status;
    if (home_score !== undefined) fixture.home_score = Number(home_score);
    if (away_score !== undefined) fixture.away_score = Number(away_score);
    if (player_performances !== undefined) fixture.player_performances = player_performances;

    if (fixture.home_team.toString() === fixture.away_team.toString()) {
      return res.status(400).json({ message: 'Home and away teams must be different.' });
    }

    await fixture.save();
    const populated = await Fixture.findById(id)
      .populate('home_team', 'name short_name logo_color logo_url')
      .populate('away_team', 'name short_name logo_color logo_url');

    res.json({ success: true, fixture: populated, message: 'Fixture updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update fixture.' });
  }
});

// DELETE fixture
app.delete('/api/fixtures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Fixture.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Fixture not found.' });
    // Also remove associated tickets
    await Ticket.deleteMany({ fixture_id: id });
    res.json({ success: true, message: 'Fixture and associated tickets deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete fixture.' });
  }
});

// ============================================================
// TICKET BOOKING ROUTES (Fan)
// ============================================================

// GET booked seat counts for all fixtures
app.get('/api/tickets/counts', async (req, res) => {
  try {
    const counts = await Ticket.aggregate([
      { $match: { ticket_status: 'Booked' } },
      { $group: { _id: '$fixture_id', bookedCount: { $sum: 1 } } }
    ]);
    const map = {};
    counts.forEach(c => {
      if (c._id) map[c._id.toString()] = c.bookedCount;
    });
    res.json({ success: true, counts: map });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch ticket counts.' });
  }
});

// GET booked seats for a specific fixture
app.get('/api/tickets/fixture/:fixtureId', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const tickets = await Ticket.find({ fixture_id: fixtureId, ticket_status: 'Booked' })
      .select('seat_number section row seat price user_id user_name');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch booked seats.' });
  }
});

// GET Razorpay key configuration
app.get('/api/payments/razorpay-key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_3ujiEJJapHR3Se' });
});

// POST book seats for a fixture
app.post('/api/tickets/book', async (req, res) => {
  try {
    const { fixture_id, user_id, user_name, user_email, seats, payment_status, razorpay_payment_id, razorpay_order_id } = req.body;
    if (!fixture_id || !user_id || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Fixture ID, user ID, and at least one seat are required.' });
    }

    // Verify fixture exists and is upcoming
    const fixture = await Fixture.findById(fixture_id);
    if (!fixture) return res.status(404).json({ message: 'Fixture not found.' });
    if (fixture.status !== 'Upcoming') {
      return res.status(400).json({ message: 'Tickets can only be booked for upcoming fixtures.' });
    }

    // Check 30-minute pre-match booking deadline
    if (fixture.match_date) {
      const matchDateObj = new Date(fixture.match_date);
      let hours = 12, minutes = 0;
      if (fixture.match_time) {
        const timeStr = String(fixture.match_time).trim();
        const twelveHrMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
        if (twelveHrMatch) {
          let h = parseInt(twelveHrMatch[1], 10);
          const m = twelveHrMatch[2] ? parseInt(twelveHrMatch[2], 10) : 0;
          const period = twelveHrMatch[3].toUpperCase();
          if (period === 'PM' && h < 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
          hours = h;
          minutes = m;
        } else {
          const twentyFourMatch = timeStr.match(/^(\d{1,2}):(\d{2})/);
          if (twentyFourMatch) {
            hours = parseInt(twentyFourMatch[1], 10);
            minutes = parseInt(twentyFourMatch[2], 10);
          }
        }
      }
      const kickoff = new Date(matchDateObj.getFullYear(), matchDateObj.getMonth(), matchDateObj.getDate(), hours, minutes, 0, 0);
      const diffMs = kickoff.getTime() - Date.now();
      const thirtyMinsMs = 30 * 60 * 1000;
      if (diffMs < thirtyMinsMs) {
        return res.status(400).json({ message: 'Ticket booking is disabled for fans within 30 minutes of match kickoff.' });
      }
    }

    // Check total seat cap (250 per fixture)
    const existingCount = await Ticket.countDocuments({ fixture_id, ticket_status: 'Booked' });
    if (existingCount + seats.length > 250) {
      return res.status(400).json({ message: `Only ${250 - existingCount} seats remaining for this fixture.` });
    }

    // Check for already-booked seats
    const seatNumbers = seats.map(s => s.seat_number);
    const alreadyBooked = await Ticket.find({ fixture_id, seat_number: { $in: seatNumbers }, ticket_status: 'Booked' });
    if (alreadyBooked.length > 0) {
      const bookedLabels = alreadyBooked.map(t => t.seat_number).join(', ');
      return res.status(400).json({ message: `Seats already booked: ${bookedLabels}` });
    }

    // Create tickets
    const ticketDocs = seats.map(s => ({
      fixture_id,
      user_id,
      user_name: user_name || 'Guest',
      user_email: user_email || '',
      seat_number: s.seat_number,
      section: s.section,
      row: s.row,
      seat: s.seat,
      price: s.price,
      payment_status: payment_status || 'Paid',
      razorpay_payment_id: razorpay_payment_id || '',
      razorpay_order_id: razorpay_order_id || '',
      ticket_status: 'Booked'
    }));

    const created = await Ticket.insertMany(ticketDocs);

    // Send email confirmation asynchronously to fan
    (async () => {
      try {
        let recipient = (user_email || '').trim();
        if (!recipient && user_id && user_id !== 'guest') {
          const u = await User.findById(user_id);
          if (u && u.email) recipient = u.email;
        }
        if (!recipient) recipient = 'soccer097711@gmail.com';

        const transporter = await createTransporter();
        if (transporter && recipient) {
          const matchTitle = `${fixture.home_team?.name || 'Home'} vs ${fixture.away_team?.name || 'Away'}`;
          const formattedDate = fixture.match_date ? new Date(fixture.match_date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : 'Upcoming Match';
          const seatsList = created.map(t => `${t.seat_number} (${t.section || 'Regular'})`).join(', ');
          const totalPrice = created.reduce((sum, t) => sum + t.price, 0);
          const senderAddress = process.env.EMAIL_USER ? `"ClubVerse Ticketing" <${process.env.EMAIL_USER}>` : '"ClubVerse Ticketing" <no-reply@clubverse.com>';

          await transporter.sendMail({
            from: senderAddress,
            to: recipient,
            subject: `🎟️ Match Pass Confirmed: ${matchTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #F7F5EF; border-radius: 24px;">
                <div style="background-color: #20221F; color: #ffffff; padding: 24px; border-radius: 20px; text-align: center;">
                  <h1 style="font-family: Georgia, serif; margin: 0; color: #BEF264; font-size: 24px;">ClubVerse FC</h1>
                  <p style="margin: 6px 0 0 0; color: #a1a1aa; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Official Match Pass Confirmation</p>
                </div>

                <div style="background-color: #FFFDF8; border: 1px solid #E4E1D8; border-radius: 20px; padding: 24px; margin-top: 16px;">
                  <h2 style="color: #20221F; margin-top: 0; font-size: 18px;">Hello ${user_name || 'Fan'},</h2>
                  <p style="color: #6F716B; font-size: 14px; line-height: 1.5;">
                    Your match ticket reservation has been successfully confirmed and paid! Below are your official match pass details:
                  </p>

                  <div style="background-color: #F7F5EF; border: 1px solid #E4E1D8; border-radius: 16px; padding: 18px; margin: 16px 0;">
                    <div style="font-size: 16px; font-weight: bold; color: #20221F; margin-bottom: 8px;">
                      ⚽ ${matchTitle}
                    </div>
                    <div style="font-size: 13px; color: #6F716B; margin-bottom: 6px;">
                      📅 <strong>Date & Time:</strong> ${formattedDate} • ${fixture.match_time || '20:00 GMT'}
                    </div>
                    <div style="font-size: 13px; color: #6F716B; margin-bottom: 6px;">
                      📍 <strong>Venue:</strong> ${fixture.venue || 'Campnow Stadium'}
                    </div>
                    <div style="font-size: 13px; color: #6F716B; margin-bottom: 6px;">
                      🎟️ <strong>Seats Reserved:</strong> <span style="color: #20221F; font-weight: bold;">${seatsList}</span>
                    </div>
                    <div style="font-size: 13px; color: #6F716B;">
                      💰 <strong>Total Amount Paid:</strong> <span style="color: #7A8B5A; font-weight: bold; font-size: 15px;">₹${totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  ${razorpay_payment_id ? `
                    <div style="background-color: #20221F; color: #ffffff; padding: 12px 18px; border-radius: 12px; font-size: 12px; font-family: monospace; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <span>Razorpay Payment ID:</span>
                      <strong style="color: #BEF264;">${razorpay_payment_id}</strong>
                    </div>
                  ` : ''}

                  <div style="padding: 16px; border: 2px dashed #7A8B5A; border-radius: 16px; text-align: center; background-color: rgba(122, 139, 90, 0.05);">
                    <span style="font-size: 11px; color: #7A8B5A; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: block;">Digital Stadium Entry Pass Code</span>
                    <div style="font-family: monospace; font-size: 20px; font-weight: bold; color: #20221F; letter-spacing: 4px; margin-top: 4px;">
                      CV-${created[0]._id.toString().substring(18).toUpperCase()}
                    </div>
                  </div>

                  <p style="color: #6F716B; font-size: 12px; margin-top: 20px; text-align: center;">
                    Show this digital pass code on your mobile device at stadium entry turnstiles.
                  </p>
                </div>

                <div style="text-align: center; margin-top: 20px; color: #a1a1aa; font-size: 11px;">
                  © 2026 ClubVerse FC • Spotify Arena Platform • All rights reserved
                </div>
              </div>
            `
          });
          console.log(`✉️ Match booking confirmation email sent to fan (${recipient})`);
        }
      } catch (emailErr) {
        console.warn('⚠️ Error sending match ticket email:', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      tickets: created,
      total_price: created.reduce((sum, t) => sum + t.price, 0),
      message: `${created.length} seat(s) booked successfully!`
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'One or more seats are already booked for this fixture.' });
    }
    res.status(500).json({ message: err.message || 'Failed to book seats.' });
  }
});

// GET user's ticket bookings
app.get('/api/tickets/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.find({ user_id: userId })
      .populate({
        path: 'fixture_id',
        populate: [
          { path: 'home_team', select: 'name short_name logo_color logo_url' },
          { path: 'away_team', select: 'name short_name logo_color logo_url' }
        ]
      })
      .sort({ booking_date: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch user tickets.' });
  }
});

// GET all match ticket bookings (Admin endpoint)
app.get('/api/admin/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate({
        path: 'fixture_id',
        populate: [
          { path: 'home_team', select: 'name short_name logo_color logo_url' },
          { path: 'away_team', select: 'name short_name logo_color logo_url' }
        ]
      })
      .sort({ booking_date: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch admin tickets.' });
  }
});

// CANCEL a ticket
app.put('/api/tickets/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    ticket.ticket_status = 'Cancelled';
    await ticket.save();
    res.json({ success: true, message: 'Ticket cancelled successfully.', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to cancel ticket.' });
  }
});
// ============================================================
// FAN COMMUNITY HUB ENDPOINTS
// ============================================================

// GET all community posts (Clean user posts only, no Marcus Vance or Elena Rostova)
app.get('/api/community/posts', async (req, res) => {
  try {
    // Delete any legacy seed posts for Marcus Vance or Elena Rostova
    await CommunityPost.deleteMany({ author_name: { $in: ['Marcus Vance', 'Elena Rostova'] } });

    // Fetch all users to map latest profile images in real-time
    const allUsers = await User.find({}, '_id email full_name profile_image');
    const userMap = new Map();
    allUsers.forEach(u => {
      if (u.profile_image) {
        userMap.set(u._id.toString(), u.profile_image);
        if (u.email) userMap.set(u.email.toLowerCase(), u.profile_image);
        if (u.full_name) userMap.set(u.full_name, u.profile_image);
      }
    });

    const rawPosts = await CommunityPost.find().sort({ is_pinned: -1, created_at: -1 });
    const posts = rawPosts.map(p => {
      const postObj = p.toObject();
      const updatedAvatar = userMap.get(postObj.author_id) || userMap.get(postObj.author_name);
      if (updatedAvatar) {
        postObj.author_avatar = updatedAvatar;
      }
      if (Array.isArray(postObj.comments)) {
        postObj.comments = postObj.comments.map(c => {
          const cmtAvatar = userMap.get(c.author_id) || userMap.get(c.author_name);
          return cmtAvatar ? { ...c, author_avatar: cmtAvatar } : c;
        });
      }
      return postObj;
    });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch community posts.' });
  }
});

// CLEAR ALL community posts (Admin / Reset endpoint)
app.delete('/api/community/posts/reset/all', async (req, res) => {
  try {
    await CommunityPost.deleteMany({});
    res.json({ success: true, message: 'All community posts cleared.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to clear community posts.' });
  }
});

// CREATE new community post
app.post('/api/community/posts', async (req, res) => {
  try {
    const { author_id, author_name, author_avatar, author_badge, category, content, image, poll } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required.' });
    }

    const post = await CommunityPost.create({
      author_id: author_id || 'guest',
      author_name: author_name || 'Anonymous Fan',
      author_avatar: author_avatar || '',
      author_badge: author_badge || 'Supporter Member',
      category: category || 'General',
      content: content.trim(),
      image: image || '',
      poll: poll || null
    });

    res.status(201).json({ success: true, post, message: 'Community post published successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to publish post.' });
  }
});

// LIKE / UNLIKE community post
app.post('/api/community/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const uid = user_id || 'guest';

    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const hasLiked = post.liked_by.includes(uid);
    if (hasLiked) {
      post.liked_by = post.liked_by.filter(u => u !== uid);
      post.likes_count = Math.max(0, post.likes_count - 1);
    } else {
      post.liked_by.push(uid);
      post.likes_count += 1;
    }

    await post.save();
    res.json({ success: true, likes_count: post.likes_count, liked_by: post.liked_by });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update like status.' });
  }
});

// ADD COMMENT to community post
app.post('/api/community/posts/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { author_id, author_name, author_avatar, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const newComment = {
      author_id: author_id || 'guest',
      author_name: author_name || 'ClubVerse Fan',
      author_avatar: author_avatar || '',
      content: content.trim(),
      created_at: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ success: true, comments: post.comments, comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to add comment.' });
  }
});

// VOTE in poll
app.post('/api/community/posts/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { option_id, user_id } = req.body;
    const uid = user_id || 'guest';

    const post = await CommunityPost.findById(id);
    if (!post || !post.poll) return res.status(404).json({ message: 'Poll not found.' });

    if (post.poll.voted_users && post.poll.voted_users.includes(uid)) {
      return res.status(400).json({ message: 'You have already voted in this poll.' });
    }

    const option = post.poll.options.find(o => o.id === option_id);
    if (!option) return res.status(400).json({ message: 'Invalid option selected.' });

    option.votes += 1;
    post.poll.total_votes += 1;
    post.poll.voted_users.push(uid);

    post.markModified('poll');
    await post.save();

    res.json({ success: true, poll: post.poll });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to record vote.' });
  }
});

// DELETE community post
app.delete('/api/community/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CommunityPost.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Post not found.' });
    res.json({ success: true, message: 'Community post deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete post.' });
  }
});

// ============================================================
// CLUB ANNOUNCEMENTS & BULLETINS ROUTES (Coach / Squad)
// ============================================================

// GET all announcements (auto-seeds defaults if empty)
app.get('/api/announcements', async (req, res) => {
  try {
    let announcements = await Announcement.find().sort({ published_at: -1 });
    if (announcements.length === 0) {
      announcements = await Announcement.insertMany([
        {
          title: 'Squad Briefing & Starting XI Strategy vs Manchester City',
          category: 'Match Briefing',
          author: 'Mikel Arteta (Head Coach)',
          content: 'High-press tactical briefing scheduled for tomorrow morning. All first team wingers and midfielders are required in Tactical Room B.',
          published_at: new Date()
        },
        {
          title: 'First Team Recovery & Cryotherapy Schedule',
          category: 'Medical Notice',
          author: 'Dr. Sam Wilson (Medical Head)',
          content: 'Hydration and cryotherapy suites are reserved exclusively for first team squad following high-intensity training.',
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          title: 'Pre-Season International Tour Schedule Confirmed',
          category: 'Club Announcement',
          author: 'Club Administration',
          content: 'ClubVerse FC will travel to Tokyo & Los Angeles for international fixture series.',
          published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ]);
      console.log('✅ Seeded default announcements in MongoDB.');
    }
    res.json({ success: true, announcements });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch announcements.' });
  }
});

// POST create new announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: 'Announcement title and content are required.' });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'Coach Announcement',
      author: author || 'Head Coach',
      published_at: new Date()
    });

    res.status(201).json({ success: true, announcement, message: 'Announcement published successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to publish announcement.' });
  }
});

// DELETE announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Announcement not found.' });
    res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete announcement.' });
  }
});

// ============================================================
// DYNAMIC FAN DASHBOARD & WALLET ENDPOINTS
// ============================================================

// GET Fan Dashboard metrics & active poll for a user
app.get('/api/fan/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let user = null;
    if (userId && userId !== 'null' && userId !== 'undefined') {
      try {
        user = await User.findById(userId);
      } catch (uErr) {
        console.warn('Find user by ID warning:', uErr.message);
      }
    }

    // Ensure active poll exists
    let activePoll = await FanPoll.findOne({ is_active: true });
    if (!activePoll) {
      activePoll = await FanPoll.create({
        question: 'Who will score first in the Derby?',
        reward_points: 50,
        options: [
          { id: 'opt1', label: 'ClubVerse Win (2-0)', votes: 68 },
          { id: 'opt2', label: 'Draw Match (1-1)', votes: 20 },
          { id: 'opt3', label: 'Rival Win (0-1)', votes: 12 }
        ],
        voted_users: [],
        is_active: true
      });
    }

    // Count real-time passes booked from Ticket collection
    let realPassesCount = 0;
    if (userId && userId !== 'null' && userId !== 'undefined') {
      try {
        realPassesCount = await Ticket.countDocuments({ user_id: userId, ticket_status: 'Booked' });
      } catch (tErr) {
        console.warn('Count tickets warning:', tErr.message);
      }
    }

    // Determine poll status for this user
    let hasVoted = false;
    let selectedOptionId = null;
    if (user && activePoll && Array.isArray(activePoll.voted_users)) {
      const voteRecord = activePoll.voted_users.find(v => v.user_id === user._id.toString());
      if (voteRecord) {
        hasVoted = true;
        selectedOptionId = voteRecord.option_id;
      }
    }

    // Format poll options with real percentages
    const totalVotes = activePoll.options.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;
    const formattedOptions = activePoll.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      votes: Math.round(((opt.votes || 0) / totalVotes) * 100)
    }));

    res.json({
      success: true,
      user: user ? {
        id: user._id,
        name: user.full_name,
        email: user.email,
        profile_image: user.profile_image,
        role: user.role,
        fan_points: user.fan_points || 250
      } : null,
      wallet: {
        total_balance: user?.total_balance ?? 6010.29,
        recent_topup: user?.recent_topup ?? 200.00,
        rupee_percentage: user?.rupee_percentage ?? 72,
        tether_percentage: user?.tether_percentage ?? 28,
        card_balance: user?.card_balance ?? 390.00,
        card_number: user?.card_number ?? '5802',
        card_expiry: user?.card_expiry ?? '09/28'
      },
      activity: {
        total_hours: user?.activity_total_hours ?? 186,
        trend: user?.activity_trend ?? '+14.2%',
        days: user?.weekly_activity?.length ? user.weekly_activity : [
          { day: 'Mon', hours: 18, height: '40%' },
          { day: 'Tue', hours: 24, height: '55%' },
          { day: 'Wed', hours: 20, height: '45%' },
          { day: 'Thu', hours: 32, height: '70%' },
          { day: 'Fri', hours: 42, height: '92%', highlight: true },
          { day: 'Sat', hours: 28, height: '60%' },
          { day: 'Sun', hours: 22, height: '50%' }
        ]
      },
      spending: {
        spent_this_week: user?.spent_this_week ?? 820.65,
        passes_count: realPassesCount > 0 ? realPassesCount : 10,
        assets_count: user?.assets_count ?? 26,
        graph_points: user?.spending_graph?.length ? user.spending_graph : [
          { day: 'Mon', x: 20, y: 110, val: 320 },
          { day: 'Tue', x: 90, y: 130, val: 280 },
          { day: 'Wed', x: 160, y: 90, val: 510 },
          { day: 'Thu', x: 230, y: 120, val: 410 },
          { day: 'Fri', x: 300, y: 40, val: 820.65, label: 'LMCO' },
          { day: 'Sat', x: 370, y: 80, val: 640 },
          { day: 'Sun', x: 440, y: 100, val: 520 }
        ]
      },
      perks: user?.vip_contract ?? {
        matchday_vip: 86,
        merch_perks: 10,
        hospitality: 4,
        milestone: 140,
        bonuses: 48,
        hourly: 16
      },
      poll: {
        id: activePoll._id,
        question: activePoll.question,
        reward_points: activePoll.reward_points,
        options: formattedOptions,
        has_voted: hasVoted,
        selected_option_id: selectedOptionId
      }
    });
  } catch (err) {
    console.error('Fan Dashboard fetch error:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch dashboard data.' });
  }
});

// TOP UP Fan Virtual Wallet
app.post('/api/fan/wallet/topup', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid top up amount.' });
    }

    let updatedUser = null;
    if (userId && userId !== 'null' && userId !== 'undefined') {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.total_balance = (user.total_balance || 6010.29) + numericAmount;
          user.card_balance = (user.card_balance || 390.00) + numericAmount;
          user.recent_topup = numericAmount;
          await user.save();
          updatedUser = user;
        }
      } catch (uErr) {
        console.warn('Topup user find warning:', uErr.message);
      }
    }

    res.json({
      success: true,
      message: `Successfully topped up ₹${numericAmount.toFixed(2)} to wallet!`,
      wallet: {
        total_balance: updatedUser ? updatedUser.total_balance : 6010.29 + numericAmount,
        recent_topup: numericAmount,
        rupee_percentage: updatedUser?.rupee_percentage ?? 72,
        tether_percentage: updatedUser?.tether_percentage ?? 28,
        card_balance: updatedUser ? updatedUser.card_balance : 390.00 + numericAmount,
        card_number: updatedUser?.card_number ?? '5802',
        card_expiry: updatedUser?.card_expiry ?? '09/28'
      }
    });
  } catch (err) {
    console.error('Wallet topup error:', err);
    res.status(500).json({ message: err.message || 'Failed to process top up.' });
  }
});

// RECORD Fan Match Poll Vote
app.post('/api/fan/poll/vote', async (req, res) => {
  try {
    const { userId, pollId, optionId } = req.body;

    let poll = null;
    if (pollId) {
      try {
        poll = await FanPoll.findById(pollId);
      } catch (pErr) {
        console.warn('Find poll by ID warning:', pErr.message);
      }
    }
    if (!poll) {
      poll = await FanPoll.findOne({ is_active: true });
    }

    if (!poll) {
      return res.status(404).json({ message: 'Active fan poll not found.' });
    }

    const option = poll.options.find(o => o.id === optionId);
    if (!option) {
      return res.status(400).json({ message: 'Invalid poll option.' });
    }

    // Increment option vote count
    option.votes = (option.votes || 0) + 1;
    if (userId && !poll.voted_users.some(v => v.user_id === userId)) {
      poll.voted_users.push({ user_id: userId, option_id: optionId });
    }

    poll.markModified('options');
    poll.markModified('voted_users');
    await poll.save();

    // Reward fan points to user in DB
    let newFanPoints = 300;
    if (userId && userId !== 'null' && userId !== 'undefined') {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.fan_points = (user.fan_points || 250) + (poll.reward_points || 50);
          await user.save();
          newFanPoints = user.fan_points;
        }
      } catch (uErr) {
        console.warn('Award points user warning:', uErr.message);
      }
    }

    const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;
    const formattedOptions = poll.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      votes: Math.round(((opt.votes || 0) / totalVotes) * 100)
    }));

    res.json({
      success: true,
      message: `Vote recorded! +${poll.reward_points || 50} VIP Points Claimed`,
      fan_points: newFanPoints,
      poll: {
        id: poll._id,
        options: formattedOptions,
        has_voted: true,
        selected_option_id: optionId
      }
    });
  } catch (err) {
    console.error('Fan poll vote error:', err);
    res.status(500).json({ message: err.message || 'Failed to record vote.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ClubVerse Express Backend running on http://localhost:${PORT}`);
});
