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
  Heart
} from 'lucide-react';

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
      setPhone(user.phone || '');
      setBio(user.bio || 'Passionate ClubVerse VIP Supporter ⚽');
      setFavoritePlayer(user.favorite_player || 'Marcus Rashford');
      setProfileImage(user.profile_image || avatarPresets[0]);
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

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New password and confirm password do not match.');
      setIsUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassErrorMsg('New password must be at least 6 characters long.');
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
          { id: 'notifications', label: 'Notifications', icon: Bell },
          ...(!isUserAdmin ? [{ id: 'membership', label: 'Pass Tier', icon: ShieldCheck }] : []),
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

              {/* Avatar Quick Presets & Upload Info */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs text-[#6F716B] font-bold">Pick preset:</span>
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                        profileImage === preset ? 'border-[#7A8B5A] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6F716B]">
                  Click the camera icon to upload your own picture, or pick a preset above. Max size 5MB.
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

            {/* Phone Number */}
            <div className={isUserAdmin ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  placeholder="+1 (555) 000-0000"
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
                placeholder="At least 6 characters"
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

      {/* SUB-TAB 4: MEMBERSHIP TIER */}
      {activeSubTab === 'membership' && !isUserAdmin && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#20221F] to-[#2E332B] text-white space-y-4 max-w-xl shadow-warm-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase">
              Active Member Tier
            </span>
            <span className="text-xs text-white/70 font-mono">ID: VIP-98214</span>
          </div>

          <h3 className="font-serif font-black text-2xl">ClubVerse VIP Gold Pass</h3>
          <p className="text-xs text-white/80">
            Enjoy full stadium privileges, complimentary matchday streams, 20% official kit discount, and priority ticket booking.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-full bg-white text-[#20221F] text-xs font-bold hover:bg-[#BEF264] transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>
      )}

    </motion.div>
  );
}
