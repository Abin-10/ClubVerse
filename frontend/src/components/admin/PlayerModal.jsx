import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Phone, Calendar, Hash, Image as ImageIcon, AlertCircle, CheckCircle2, Upload, Camera } from 'lucide-react';

export default function PlayerModal({ isOpen, onClose, onSave, playerToEdit }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('Forward');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [preferredFoot, setPreferredFoot] = useState('Left');
  const [height, setHeight] = useState('178 cm');
  const [weight, setWeight] = useState('72 kg');
  const [contractTerm, setContractTerm] = useState('June 2029');
  const [roleAccess, setRoleAccess] = useState('First Team Professional Player');
  const [marketValue, setMarketValue] = useState('€120M');
  const [medicalClearance, setMedicalClearance] = useState('100% Match Fit');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [status, setStatus] = useState('Active');

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  useEffect(() => {
    if (playerToEdit) {
      setFullName(playerToEdit.full_name || '');
      setEmail(playerToEdit.email || '');
      setPosition(playerToEdit.position || 'Forward');
      setJerseyNumber(playerToEdit.jersey_number !== undefined && playerToEdit.jersey_number !== null ? String(playerToEdit.jersey_number) : '');
      setDateOfBirth(playerToEdit.date_of_birth ? playerToEdit.date_of_birth.substring(0, 10) : '');
      setPhone(playerToEdit.phone || '');
      setNationality(playerToEdit.nationality || '');
      setPreferredFoot(playerToEdit.preferred_foot || 'Left');
      setHeight(playerToEdit.height || '178 cm');
      setWeight(playerToEdit.weight || '72 kg');
      setContractTerm(playerToEdit.contract_term || 'June 2029');
      setRoleAccess(playerToEdit.role_access || 'First Team Professional Player');
      setMarketValue(playerToEdit.market_value || '€120M');
      setMedicalClearance(playerToEdit.medical_clearance || '100% Match Fit');
      setBio(playerToEdit.bio || 'Passionate ClubVerse VIP Supporter ⚽');
      setProfileImage(playerToEdit.profile_image || defaultAvatar);
      setStatus(playerToEdit.status || 'Active');
    } else {
      setFullName('');
      setEmail('');
      setPosition('Forward');
      setJerseyNumber('');
      setDateOfBirth('');
      setPhone('');
      setNationality('');
      setPreferredFoot('Left');
      setHeight('178 cm');
      setWeight('72 kg');
      setContractTerm('June 2029');
      setRoleAccess('First Team Professional Player');
      setMarketValue('€120M');
      setMedicalClearance('100% Match Fit');
      setBio('Passionate ClubVerse VIP Supporter ⚽');
      setProfileImage(defaultAvatar);
      setStatus('Active');
    }
    setFieldErrors({});
    setTouched({});
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (field, val) => {
    let err = '';
    if (field === 'fullName') {
      if (!val.trim()) err = 'Player full name is required.';
      else if (val.trim().length < 2) err = 'Name must be at least 2 characters.';
    }
    if (field === 'email' && val.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) err = 'Invalid email address.';
    }
    if (field === 'position') {
      if (!val) err = 'Playing position is required.';
    }
    if (field === 'jerseyNumber' && val) {
      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 99) err = 'Jersey number must be between 1 and 99.';
    }
    return err;
  };

  const handleBlur = (field, val) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      fullName: validateField('fullName', fullName),
      position: validateField('position', position),
      jerseyNumber: validateField('jerseyNumber', jerseyNumber),
      email: validateField('email', email)
    };

    const activeErrs = {};
    Object.keys(errors).forEach((k) => { if (errors[k]) activeErrs[k] = errors[k]; });

    setFieldErrors(activeErrs);
    setTouched({ fullName: true, position: true, jerseyNumber: true, email: true });

    if (Object.keys(activeErrs).length > 0) return;

    setLoading(true);

    await onSave({
      _id: playerToEdit?._id,
      full_name: fullName.trim(),
      email: email.trim(),
      position,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      date_of_birth: dateOfBirth,
      phone: phone.trim(),
      nationality: nationality.trim(),
      preferred_foot: preferredFoot.trim(),
      height: height.trim(),
      weight: weight.trim(),
      contract_term: contractTerm.trim(),
      role_access: roleAccess.trim(),
      market_value: marketValue.trim(),
      medical_clearance: medicalClearance.trim(),
      bio: bio.trim(),
      profile_image: profileImage || defaultAvatar,
      status
    });

    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-warm-lg my-8 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full hover:bg-[#EFEEE8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              <span>{playerToEdit ? 'Edit Player Account' : 'New Player Registration'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#20221F] font-serif tracking-tight">
              {playerToEdit ? 'Update Player Details' : 'Add Player to Squad'}
            </h2>
            <p className="text-xs text-[#6F716B]">
              Fill out official squad details for this player. These details will be saved to the DB and displayed on the Player Dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & VIP Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Gavi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName', fullName)}
                  className={`w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border px-4 py-2.5 font-medium transition-all focus:outline-none focus:bg-[#FFFDF8] ${
                    touched.fullName && fieldErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#E4E1D8] focus:border-[#7A8B5A]'
                  }`}
                />
                {touched.fullName && fieldErrors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  VIP Supporter Tag / Bio
                </label>
                <input
                  type="text"
                  placeholder="Passionate ClubVerse VIP Supporter ⚽"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Position & Jersey Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="RIGHT WINGER / FORWARD"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Jersey Number (#)
                </label>
                <input
                  type="number"
                  placeholder="7"
                  min="1"
                  max="99"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                  onBlur={() => handleBlur('jerseyNumber', jerseyNumber)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
                {touched.jerseyNumber && fieldErrors.jerseyNumber && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.jerseyNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="abin37523@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email', email)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="9539437002"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Nationality & Preferred Foot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Nationality
                </label>
                <input
                  type="text"
                  placeholder="England"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Preferred Foot
                </label>
                <select
                  value={preferredFoot}
                  onChange={(e) => setPreferredFoot(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                >
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Height
                </label>
                <input
                  type="text"
                  placeholder="178 cm"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Weight
                </label>
                <input
                  type="text"
                  placeholder="72 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Contract Term & Role Access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Contract Term
                </label>
                <input
                  type="text"
                  placeholder="June 2029"
                  value={contractTerm}
                  onChange={(e) => setContractTerm(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Role Access
                </label>
                <input
                  type="text"
                  placeholder="First Team Professional Player"
                  value={roleAccess}
                  onChange={(e) => setRoleAccess(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Estimated Market Value & Medical Clearance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Estimated Market Value
                </label>
                <input
                  type="text"
                  placeholder="€120M"
                  value={marketValue}
                  onChange={(e) => setMarketValue(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Medical & Fitness Clearance
                </label>
                <input
                  type="text"
                  placeholder="100% Match Fit"
                  value={medicalClearance}
                  onChange={(e) => setMedicalClearance(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Date of Birth & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Profile Photo Upload & Image URL */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                Player Profile Photo (File Upload or Image URL)
              </label>
              
              <div className="flex items-center gap-3">
                <div className="relative group flex-shrink-0">
                  <img 
                    src={profileImage || defaultAvatar} 
                    alt="Preview" 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#7A8B5A] shadow-warm-sm"
                  />
                  <label 
                    htmlFor="admin-player-photo-file-upload"
                    className="absolute -bottom-1 -right-1 p-1 bg-[#20221F] text-white rounded-full cursor-pointer hover:bg-[#7A8B5A] transition-colors shadow-md"
                    title="Upload image file"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#BEF264]" />
                  </label>
                  <input 
                    type="file" 
                    id="admin-player-photo-file-upload" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...) or choose file..."
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="flex-1 bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                    />
                    <label 
                      htmlFor="admin-player-photo-file-upload"
                      className="px-4 py-2.5 bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold rounded-full cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 shadow-warm-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#BEF264]" />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-[#6F716B] ml-2">
                    Click <strong>Upload Photo</strong> to select a image file from your device, or paste a web URL.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#E4E1D8]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-[#E4E1D8] text-[#20221F] font-bold text-xs bg-[#FFFDF8] hover:bg-[#EFEEE8] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-sm transition-all duration-300"
              >
                {loading ? 'Saving...' : playerToEdit ? 'Update Player' : 'Save Player to Squad'}
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
