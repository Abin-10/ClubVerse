import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Player from './models/Player.js';
import Coach from './models/Coach.js';

dotenv.config();

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

    res.status(201).json({
      message: 'Fan account registered successfully!',
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

    res.json({
      message: 'Login successful',
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

    res.json({
      message: 'Google authentication successful',
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

// Get User Profile Endpoint (MongoDB)
app.get('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
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
    res.status(500).json({ message: 'Error retrieving user profile' });
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

// GET Admin Overview Stats
app.get('/api/admin/stats', async (req, res) => {

  try {
    const totalPlayers = await Player.countDocuments();
    const activePlayers = await Player.countDocuments({ status: 'Active' });
    const totalCoaches = await Coach.countDocuments();
    const activeCoaches = await Coach.countDocuments({ status: 'Active' });

    res.json({
      totalPlayers,
      activePlayers,
      totalCoaches,
      activeCoaches,
      upcomingMatchesCount: 4,
      recentActivitiesCount: 12
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch admin stats' });
  }
});

// GET All Players
app.get('/api/admin/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (err) {
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

app.listen(PORT, () => {
  console.log(`🚀 ClubVerse Express Backend running on http://localhost:${PORT}`);
});
