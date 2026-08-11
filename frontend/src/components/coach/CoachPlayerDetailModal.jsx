import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Target, Zap, ShieldCheck, CheckCircle2, Activity, Calendar } from 'lucide-react';

export default function CoachPlayerDetailModal({ isOpen, onClose, player }) {
  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-warm-lg space-y-6 relative max-h-[90vh] overflow-y-auto font-sans"
        >
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full hover:bg-[#F7F5EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-[#E4E1D8] pb-5">
            <img 
              src={player.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'} 
              alt={player.full_name || player.name} 
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#7A8B5A] shadow-warm-md" 
            />
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-serif font-black text-2xl text-[#20221F]">{player.full_name || player.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase">
                  #{player.jersey_number || 'N/A'}
                </span>
              </div>
              <p className="text-xs text-[#7A8B5A] font-extrabold uppercase">{player.position}</p>
              <p className="text-xs text-[#6F716B]">{player.email || 'player@clubverse.com'} • {player.phone || '+44 7700 900000'}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
              <div className="text-[10px] font-bold text-[#6F716B]">Goals</div>
              <div className="font-serif font-black text-2xl text-[#20221F]">{player.goals || 12}</div>
            </div>
            <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
              <div className="text-[10px] font-bold text-[#6F716B]">Assists</div>
              <div className="font-serif font-black text-2xl text-[#20221F]">{player.assists || 8}</div>
            </div>
            <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
              <div className="text-[10px] font-bold text-[#6F716B]">Pass Acc.</div>
              <div className="font-serif font-black text-2xl text-[#20221F]">{player.passAccuracy || '88%'}</div>
            </div>
            <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8]">
              <div className="text-[10px] font-bold text-[#6F716B]">Avg Rating</div>
              <div className="font-serif font-black text-2xl text-[#20221F]">{player.matchRating || '8.5'}</div>
            </div>
          </div>

          {/* Fitness & Tactical Notes */}
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-[#627146] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#7A8B5A]">
                <CheckCircle2 className="w-4 h-4 text-[#7A8B5A]" />
                <span>Fitness & Clearance Status</span>
              </div>
              <p className="text-[#20221F] font-bold">{player.fitnessStatus || '100% Fit (Match Ready)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
              <span className="font-bold text-[#20221F] block">Coach Tactical Notes</span>
              <p className="text-[#6F716B] leading-relaxed">
                {player.notes || 'Demonstrates exceptional off-the-ball movement and tactical pressing triggers. Key asset for high-tempo counter-attacks.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-colors"
            >
              Close Profile
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
