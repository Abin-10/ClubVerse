import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  Upload, 
  Award, 
  Target, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  Globe, 
  Activity,
  Sparkles
} from 'lucide-react';
import EditPlayerProfileModal from './EditPlayerProfileModal';

export default function PlayerProfileView({ currentUser, onUpdateUserData, triggerToast }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const player = {
    name: currentUser?.name || currentUser?.full_name || 'Gavi',
    email: currentUser?.email || 'abin37523@gmail.com',
    phone: currentUser?.phone || '9539437002',
    position: currentUser?.position || 'RIGHT WINGER / FORWARD',
    jersey_number: currentUser?.jersey_number !== undefined && currentUser?.jersey_number !== null ? currentUser.jersey_number : 7,
    date_of_birth: currentUser?.date_of_birth || '2001-09-05',
    nationality: currentUser?.nationality || 'England',
    preferred_foot: currentUser?.preferred_foot || 'Left',
    height: currentUser?.height || '178 cm',
    weight: currentUser?.weight || '72 kg',
    status: currentUser?.status || 'Active',
    profile_image: currentUser?.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: currentUser?.bio || 'Passionate ClubVerse VIP Supporter ⚽',
    contract_until: currentUser?.contract_term || currentUser?.contract_until || 'June 2029',
    role_access: currentUser?.role_access || 'First Team Professional Player',
    market_value: currentUser?.market_value || '€120M',
    medical_clearance: currentUser?.medical_clearance || '100% Match Fit'
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Profile Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md relative overflow-hidden"
      >
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A8B5A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          
          {/* Avatar with Squad Badge */}
          <div className="relative group flex-shrink-0">
            <img 
              src={player.profile_image} 
              alt={player.name} 
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover border-4 border-white shadow-warm-lg"
            />
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-[#20221F] text-[#BEF264] flex items-center justify-center font-serif font-black text-lg border-2 border-white shadow-warm-md">
              #{player.jersey_number}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
                    {player.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase tracking-wider">
                    {player.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A8B5A] font-extrabold mt-1 uppercase tracking-wider">
                  {player.position}
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm flex items-center justify-center gap-2 transition-all"
              >
                <Edit3 className="w-4 h-4 text-[#BEF264]" />
                <span>Edit Profile</span>
              </motion.button>
            </div>

            {/* Bio */}
            <p className="text-xs text-[#6F716B] leading-relaxed max-w-2xl flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
              <span>{player.bio}</span>
            </p>

            {/* Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <div className="text-[10px] font-bold text-[#6F716B]">Nationality</div>
                <div className="text-xs font-black text-[#20221F] mt-0.5">{player.nationality}</div>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <div className="text-[10px] font-bold text-[#6F716B]">Preferred Foot</div>
                <div className="text-xs font-black text-[#20221F] mt-0.5">{player.preferred_foot}</div>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <div className="text-[10px] font-bold text-[#6F716B]">Height / Weight</div>
                <div className="text-xs font-black text-[#20221F] mt-0.5">{player.height} / {player.weight}</div>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <div className="text-[10px] font-bold text-[#6F716B]">Contract Term</div>
                <div className="text-xs font-black text-[#20221F] mt-0.5">{player.contract_until}</div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Account Details & Contact Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Information */}
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <h3 className="font-serif font-black text-base text-[#20221F] border-b border-[#E4E1D8] pb-3">
            Contact & Identification
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <div className="flex items-center gap-2 text-[#6F716B] font-semibold">
                <Mail className="w-4 h-4 text-[#7A8B5A]" />
                <span>Email Address</span>
              </div>
              <span className="font-bold text-[#20221F]">{player.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <div className="flex items-center gap-2 text-[#6F716B] font-semibold">
                <Phone className="w-4 h-4 text-[#7A8B5A]" />
                <span>Phone Number</span>
              </div>
              <span className="font-bold text-[#20221F]">{player.phone}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <div className="flex items-center gap-2 text-[#6F716B] font-semibold">
                <Calendar className="w-4 h-4 text-[#7A8B5A]" />
                <span>Date of Birth</span>
              </div>
              <span className="font-bold text-[#20221F]">{player.date_of_birth}</span>
            </div>
          </div>
        </div>

        {/* Club Squad Status */}
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <h3 className="font-serif font-black text-base text-[#20221F] border-b border-[#E4E1D8] pb-3">
            Squad Authorization & Status
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <span className="text-[#6F716B] font-semibold">Role Access</span>
              <span className="font-bold text-[#7A8B5A] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {player.role_access}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <span className="text-[#6F716B] font-semibold">Estimated Market Value</span>
              <span className="font-bold text-[#20221F]">{player.market_value}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <span className="text-[#6F716B] font-semibold">Medical & Fitness Clearance</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {player.medical_clearance}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditPlayerProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => {
          if (onUpdateUserData) onUpdateUserData(updated);
        }}
        triggerToast={triggerToast}
      />

    </div>
  );
}
