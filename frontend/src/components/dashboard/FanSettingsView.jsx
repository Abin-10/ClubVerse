import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Phone,
  Mail,
  Heart,
  X
} from 'lucide-react';

const PASSWORD_RULES = [
  { id: 'length',  label: 'At least 8 characters',           test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'At least one uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'At least one lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number',  label: 'At least one number (0–9)',        test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'At least one special character (!@#$…)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getPasswordStrength(password) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '', color: '' };
  if (passed <= 2)  return { score: 1, label: 'Weak',      color: '#EF4444' };
  if (passed === 3) return { score: 2, label: 'Fair',      color: '#F59E0B' };
  if (passed === 4) return { score: 3, label: 'Strong',    color: '#7A8B5A' };
  return               { score: 4, label: 'Very Strong', color: '#16A34A' };
}

export default function FanSettingsView({ currentUser, onUpdateUserData, triggerToast, isAdmin = false }) {
  const isUserAdmin = isAdmin || currentUser?.role === 'Admin' || currentUser?.role === 'admin';
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [favoritePlayer, setFavoritePlayer] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  // Preset Avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  ];

  useEffect(() => {
    const user = currentUser || JSON.parse(localStorage.getItem('clubverse_user') || '{}');
    if (user) {
      setName(user.name || user.full_name || '');
      setEmail(user.email || '');
      const rawPhone = user.phone || '';
      setPhone(rawPhone.startsWith('+1') || rawPhone.startsWith('+44') || !rawPhone ? '+91 98765 43210' : rawPhone);
      setBio(user.bio || 'Passionate ClubVerse VIP Supporter ⚽');
      setFavoritePlayer(user.favorite_player || 'Marcus Rashford');
      setProfileImage(user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');
    }
  }, [currentUser]);

  // Handle Profile Picture File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileErrorMsg('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImg = reader.result;
        setProfileImage(newImg);
        const updatedUser = {
          ...(currentUser || JSON.parse(localStorage.getItem('clubverse_user') || '{}')),
          profile_image: newImg
        };
        localStorage.setItem('clubverse_user', JSON.stringify(updatedUser));
        if (onUpdateUserData) onUpdateUserData(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset) => {
    setProfileImage(preset);
    const updatedUser = {
      ...(currentUser || JSON.parse(localStorage.getItem('clubverse_user') || '{}')),
      profile_image: preset
    };
    localStorage.setItem('clubverse_user', JSON.stringify(updatedUser));
    if (onUpdateUserData) onUpdateUserData(updatedUser);
  };

  // Save Profile Changes to MongoDB
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const payload = {
        email: email,
        name: name,
        phone: phone,
        profile_image: profileImage,
      };
      if (!isUserAdmin) {
        payload.bio = bio;
        payload.favorite_player = favoritePlayer;
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setProfileSuccessMsg('Profile settings updated in MongoDB successfully!');
        
        // Update LocalStorage & Parent State
        const updatedUser = {
          ...(currentUser || {}),
          name: name,
          email: email,
          phone: phone,
          profile_image: profileImage,
          ...(!isUserAdmin ? { bio, favorite_player: favoritePlayer } : {})
        };
        localStorage.setItem('clubverse_user', JSON.stringify(updatedUser));
        if (onUpdateUserData) onUpdateUserData(updatedUser);
        if (triggerToast) triggerToast('Profile saved to MongoDB!');
      } else {
        setProfileErrorMsg(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Save Profile Error:', err);
      // Fallback local update if offline
      const updatedUser = {
        ...(currentUser || {}),
        name: name,
        email: email,
        phone: phone,
        profile_image: profileImage,
        ...(!isUserAdmin ? { bio, favorite_player: favoritePlayer } : {})
      };
      localStorage.setItem('clubverse_user', JSON.stringify(updatedUser));
      if (onUpdateUserData) onUpdateUserData(updatedUser);
      setProfileSuccessMsg('Profile updated locally!');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change Password in MongoDB
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPassSuccessMsg('');
    setPassErrorMsg('');

    const ruleResults = PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(newPassword) }));
    const allRulesPassed = ruleResults.every((r) => r.passed);

    if (!allRulesPassed) {
      setPassErrorMsg('New password must meet all 5 security requirements below (8+ chars, uppercase, lowercase, number, special character).');
      setIsUpdatingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New password and confirm password do not match.');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          oldPassword: oldPassword.trim() !== '' ? oldPassword : 'google_oauth_protected',
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPassSuccessMsg('Password changed successfully in MongoDB!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (triggerToast) triggerToast('Password Updated!');
      } else {
        setPassErrorMsg(data.message || 'Error updating password.');
      }
    } catch (err) {
      console.error('Password Update Error:', err);
      setPassErrorMsg('Unable to connect to server. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-8"
    >
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-6">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            {isUserAdmin ? 'Admin Account Settings' : 'Fan Account Settings'}
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Manage your personal profile details, avatar, security, and MongoDB synced preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold text-[#7A8B5A]">
          <ShieldCheck className="w-4 h-4 text-[#7A8B5A]" />
          <span>MongoDB Connected</span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E1D8] pb-4">
        {[
          { id: 'profile', label: 'Profile & Avatar', icon: User },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PROFILE & AVATAR SETTINGS */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
          
          {profileSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          {/* Profile Picture Upload Section */}
          <div className="space-y-3 bg-[#F7F5EF] p-6 rounded-3xl border border-[#E4E1D8]">
            <label className="block text-xs font-bold text-[#20221F]">Profile Picture / Avatar</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Avatar Preview */}
              <div className="relative group">
                <img 
                  src={profileImage || avatarPresets[0]} 
                  alt="Fan Avatar Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-warm-md"
                />
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#20221F] text-white shadow-lg cursor-pointer hover:bg-[#7A8B5A] transition-colors"
                  title="Upload New Photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </div>

              {/* Avatar Upload Info */}
              <div className="space-y-1 text-center sm:text-left flex-1">
                <p className="text-xs font-black text-[#20221F]">Upload Profile Picture</p>
                <p className="text-[11px] text-[#6F716B]">
                  Click the camera icon on your picture to upload your custom avatar. Max file size 5MB.
                </p>
              </div>

            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email Address (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                <input 
                  type="email" 
                  value={email}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#EFEEE8] text-xs font-bold text-[#6F716B] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number (Indian Format) */}
            <div className={isUserAdmin ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Favorite Player */}
            {!isUserAdmin && (
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Favorite Player</label>
                <div className="relative">
                  <Heart className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                  <input 
                    type="text" 
                    value={favoritePlayer}
                    onChange={(e) => setFavoritePlayer(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                    placeholder="e.g. Marcus Rashford"
                  />
                </div>
              </div>
            )}

            {/* Fan Bio */}
            {!isUserAdmin && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#20221F] mb-1">Fan Bio</label>
                <textarea 
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  placeholder="Share your passion for ClubVerse..."
                />
              </div>
            )}

          </div>

          {/* Save Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSavingProfile}
            className="px-6 py-3 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#BEF264]" />
            <span>{isSavingProfile ? 'Saving to MongoDB...' : 'Save Profile Changes'}</span>
          </motion.button>

        </form>
      )}

      {/* SUB-TAB 2: PASSWORD & SECURITY */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
          
          {passSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{passSuccessMsg}</span>
            </div>
          )}

          {passErrorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{passErrorMsg}</span>
            </div>
          )}

          {/* Info note for Google Sign In / Password Reset */}
          <div className="p-3.5 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-xs font-bold text-[#627146] flex flex-wrap items-center justify-between gap-2">
            <span>Forgot password or using Google Sign-In?</span>
            <Link 
              to="/login" 
              state={{ view: 'forgot' }}
              className="px-3.5 py-1.5 rounded-full bg-[#20221F] text-white text-[11px] font-bold hover:bg-[#7A8B5A] transition-colors"
            >
              Reset Password
            </Link>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">Current Password (Optional for Google Users)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
              <input 
                type={showOldPass ? 'text' : 'password'} 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                placeholder="Enter current password (if set)"
              />
              <button 
                type="button" 
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F]"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
              <input 
                type={showNewPass ? 'text' : 'password'} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                placeholder="Create a strong password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F]"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Checklist & Strength Bar */}
          {(() => {
            const strength = getPasswordStrength(newPassword);
            return (
              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#20221F]">
                  <span>Password Requirements</span>
                  {newPassword.length > 0 && (
                    <span style={{ color: strength.color }} className="font-extrabold">{strength.label}</span>
                  )}
                </div>

                {/* Strength Meter Bar */}
                {newPassword.length > 0 && (
                  <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-[#E4E1D8]">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className="h-full transition-all duration-300" 
                        style={{ backgroundColor: step <= strength.score ? strength.color : '#E4E1D8' }} 
                      />
                    ))}
                  </div>
                )}

                {/* 5 Rules Checklist */}
                <div className="space-y-1.5 pt-1">
                  {PASSWORD_RULES.map((r) => {
                    const isPassed = r.test(newPassword);
                    return (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] flex-shrink-0" />
                        )}
                        <span className={isPassed ? 'text-[#16A34A] font-bold' : 'text-[#6F716B]'}>
                          {r.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
              <input 
                type={showNewPass ? 'text' : 'password'} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                placeholder="Re-enter new password"
                required
              />
            </div>
            {confirmPassword.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold">
                {newPassword === confirmPassword ? (
                  <span className="text-[#16A34A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full py-3 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-[#BEF264]" />
            <span>{isUpdatingPassword ? 'Updating MongoDB Password...' : 'Update Password'}</span>
          </motion.button>

        </form>
      )}

      {/* SUB-TAB 3: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-4 max-w-xl">
          {[
            { title: 'Matchday Reminders', desc: 'Get SMS & push alerts 1 hour before kick-off.' },
            { title: 'Goal & VAR Instant Alerts', desc: 'Live match score updates during games.' },
            { title: 'Ticket Priority Drops', desc: 'Early access notifications for derby & final tickets.' },
            { title: 'Fan Reward Multipliers', desc: 'Special promo notifications for 2x point weekends.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#20221F]">{item.title}</h4>
                <p className="text-[11px] text-[#6F716B]">{item.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7A8B5A]" />
            </div>
          ))}
        </div>
      )}


    </motion.div>
  );
}
