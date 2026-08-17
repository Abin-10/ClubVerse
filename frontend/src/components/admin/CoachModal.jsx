import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, Mail, Phone, Briefcase, Calendar, Image as ImageIcon, AlertCircle, Upload, Camera } from 'lucide-react';
import { isValidEmail } from '../../utils/validators';

export default function CoachModal({ isOpen, onClose, onSave, coachToEdit }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Tactical Head Coach');
  const [experience, setExperience] = useState('5');
  const [nationality, setNationality] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [status, setStatus] = useState('Active');

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const defaultAvatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80';

  useEffect(() => {
    if (coachToEdit) {
      setFullName(coachToEdit.full_name || '');
      setEmail(coachToEdit.email || '');
      setPhone(coachToEdit.phone || '');
      setSpecialization(coachToEdit.specialization || 'Tactical Head Coach');
      setExperience(coachToEdit.experience !== undefined && coachToEdit.experience !== null ? String(coachToEdit.experience) : '5');
      setNationality(coachToEdit.nationality || '');
      setProfileImage(coachToEdit.profile_image || defaultAvatar);
      setStatus(coachToEdit.status || 'Active');
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setSpecialization('Tactical Head Coach');
      setExperience('5');
      setNationality('');
      setProfileImage(defaultAvatar);
      setStatus('Active');
    }
    setFieldErrors({});
    setTouched({});
  }, [coachToEdit, isOpen]);

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
      if (!val.trim()) err = 'Coach full name is required.';
      else if (val.trim().length < 2) err = 'Name must be at least 2 characters.';
    }
    if (field === 'email' && val.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) err = 'Invalid email address.';
    }
    if (field === 'experience' && val) {
      const num = parseInt(val);
      if (isNaN(num) || num < 0 || num > 50) err = 'Experience must be between 0 and 50 years.';
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
      email: validateField('email', email),
      experience: validateField('experience', experience)
    };

    const activeErrs = {};
    Object.keys(errors).forEach((k) => { if (errors[k]) activeErrs[k] = errors[k]; });

    setFieldErrors(activeErrs);
    setTouched({ fullName: true, email: true, experience: true });

    if (Object.keys(activeErrs).length > 0) return;

    setLoading(true);

    await onSave({
      _id: coachToEdit?._id,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      experience: experience ? parseInt(experience) : 0,
      nationality: nationality.trim(),
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
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-warm-lg my-8 relative"
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
              <Award className="w-3.5 h-3.5" />
              <span>{coachToEdit ? 'Edit Coach Profile' : 'Add New Coach'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#20221F] font-serif tracking-tight">
              {coachToEdit ? 'Update Coach Details' : 'Appoint Coaching Staff'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Mikel Arteta"
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

            {/* Specialization & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="Tactical Head Coach"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  placeholder="8"
                  min="0"
                  max="50"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  onBlur={() => handleBlur('experience', experience)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
                {touched.experience && fieldErrors.experience && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.experience}</span>
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
                  placeholder="coach@clubverse.com"
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
                  placeholder="+44 7700 911122"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Status & Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Nationality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spain, Argentina…"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-2.5 font-medium focus:outline-none focus:border-[#7A8B5A] transition-all"
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
                Coach Profile Photo (File Upload or Image URL)
              </label>
              
              <div className="flex items-center gap-3">
                <div className="relative group flex-shrink-0">
                  <img 
                    src={profileImage || defaultAvatar} 
                    alt="Preview" 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#7A8B5A] shadow-warm-sm"
                  />
                  <label 
                    htmlFor="admin-coach-photo-file-upload"
                    className="absolute -bottom-1 -right-1 p-1 bg-[#20221F] text-white rounded-full cursor-pointer hover:bg-[#7A8B5A] transition-colors shadow-md"
                    title="Upload image file"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#BEF264]" />
                  </label>
                  <input 
                    type="file" 
                    id="admin-coach-photo-file-upload" 
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
                      htmlFor="admin-coach-photo-file-upload"
                      className="px-4 py-2.5 bg-[#7A8B5A] hover:bg-[#627146] text-white text-xs font-bold rounded-full cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 shadow-warm-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#BEF264]" />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-[#6F716B] ml-2">
                    Click <strong>Upload Photo</strong> to select an image file from your device, or paste a web URL.
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
                className="flex-1 py-3 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white font-bold text-xs shadow-warm-sm transition-all duration-300"
              >
                {loading ? 'Saving...' : coachToEdit ? 'Update Coach' : 'Save Coach'}
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
