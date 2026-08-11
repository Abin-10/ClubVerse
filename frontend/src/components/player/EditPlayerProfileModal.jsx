import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CheckCircle2, User, Mail, Phone, Calendar, Award, Sparkles } from 'lucide-react';

export default function EditPlayerProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  triggerToast
}) {
  if (!isOpen) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-warm-lg space-y-6 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full hover:bg-[#F7F5EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Controlled Squad Record</span>
            </div>
            <h3 className="font-serif font-black text-2xl text-[#20221F]">Official Player Profile</h3>
            <p className="text-xs text-[#6F716B]">
              All official player metrics and contract attributes are registered by Club Administration and cannot be directly modified by the player.
            </p>
          </div>

          {/* Notice Box */}
          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#7A8B5A]/30 flex items-start gap-3 text-xs text-[#6F716B]">
            <Lock className="w-4 h-4 text-[#7A8B5A] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#20221F]">Information Locked by Administration</p>
              <p className="text-[11px] mt-0.5">
                If you need to request changes to your jersey number, contract term, position, or personal details, please contact your Club Administrator.
              </p>
            </div>
          </div>

          {/* Locked Details Summary */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Full Name</span>
                <span className="font-black text-[#20221F] text-sm mt-0.5 block">{player.name}</span>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Squad Position</span>
                <span className="font-bold text-[#7A8B5A] mt-0.5 block">{player.position}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Jersey Number</span>
                <span className="font-black font-serif text-[#20221F] text-sm mt-0.5 block">#{player.jersey_number}</span>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Contract Term</span>
                <span className="font-bold text-[#20221F] mt-0.5 block">{player.contract_until}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Market Value</span>
                <span className="font-bold text-[#20221F] mt-0.5 block">{player.market_value}</span>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
                <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Fitness Clearance</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">{player.medical_clearance}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
              <span className="text-[10px] font-bold text-[#6F716B] uppercase block">Role Access</span>
              <span className="font-bold text-[#7A8B5A] mt-0.5 block">{player.role_access}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-end pt-3 border-t border-[#E4E1D8]">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm transition-all text-center"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
