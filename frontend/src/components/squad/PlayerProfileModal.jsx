import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  Target, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  Globe, 
  Sparkles,
  Activity,
  Heart,
  TrendingUp
} from 'lucide-react';

export default function PlayerProfileModal({ player, onClose }) {
  if (!player) return null;

  const photo = player.profile_image || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80';
  const goals = player.goals ?? 0;
  const assists = player.assists ?? 0;
  const matches = player.matches ?? 0;
  const rating = (player.rating !== undefined && player.rating !== null && player.rating > 0)
    ? Number(player.rating).toFixed(1) 
    : '0.0';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-2xl w-full shadow-warm-lg overflow-hidden relative my-8"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-black/40 hover:bg-black/70 rounded-full z-20 transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Banner Header */}
          <div className="relative bg-gradient-to-r from-[#20221F] via-[#2A2E26] to-[#7A8B5A] p-6 sm:p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#BEF264]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                <img 
                  src={photo} 
                  alt={player.full_name} 
                  className="w-full h-full object-cover rounded-3xl border-4 border-[#FFFDF8] shadow-warm-lg"
                />
                <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#BEF264] text-[#20221F] font-black text-sm rounded-full shadow-warm-md">
                  #{player.jersey_number || 10}
                </span>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 text-[#BEF264] text-xs font-bold border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{player.role_access || 'First Team Professional'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  {player.full_name}
                </h2>
                <p className="text-xs text-[#A1A19A] font-semibold">
                  {player.position || 'Forward'} • {player.nationality || 'England'} • {player.market_value || '€120M'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Key Statistics Grid */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6F716B] mb-3">
                Season Stats & Performance
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-center">
                  <div className="text-xl font-black text-[#20221F] font-serif">{goals}</div>
                  <div className="text-[10px] text-[#6F716B] font-bold uppercase mt-0.5">Goals Scored</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-center">
                  <div className="text-xl font-black text-[#20221F] font-serif">{assists}</div>
                  <div className="text-[10px] text-[#6F716B] font-bold uppercase mt-0.5">Assists</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-center">
                  <div className="text-xl font-black text-[#20221F] font-serif">{matches}</div>
                  <div className="text-[10px] text-[#6F716B] font-bold uppercase mt-0.5">Matches Played</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#7A8B5A]/15 border border-[#7A8B5A]/30 text-center">
                  <div className="text-xl font-black text-[#7A8B5A] font-serif">{rating}</div>
                  <div className="text-[10px] text-[#7A8B5A] font-extrabold uppercase mt-0.5">Avg Rating ⭐</div>
                </div>
              </div>
            </div>

            {/* Detailed Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2.5">
                <h5 className="text-xs font-bold text-[#20221F] pb-1 border-b border-[#E4E1D8]">Player Profile</h5>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Date of Birth</span>
                  <span className="font-bold text-[#20221F]">{player.date_of_birth || '2001-09-05'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Preferred Foot</span>
                  <span className="font-bold text-[#20221F]">{player.preferred_foot || 'Left'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Height & Weight</span>
                  <span className="font-bold text-[#20221F]">{player.height || '178 cm'} • {player.weight || '72 kg'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2.5">
                <h5 className="text-xs font-bold text-[#20221F] pb-1 border-b border-[#E4E1D8]">Contract & Fitness</h5>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Contract Term</span>
                  <span className="font-bold text-[#20221F]">{player.contract_term || 'June 2029'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Market Valuation</span>
                  <span className="font-bold text-[#7A8B5A]">{player.market_value || '€120M'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Fitness Status</span>
                  <span className="font-extrabold text-emerald-600">{player.medical_clearance || '100% Fit'}</span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
              <h5 className="text-xs font-bold text-[#20221F] mb-1">Player Biography</h5>
              <p className="text-xs text-[#6F716B] leading-relaxed">
                {player.bio || 'Passionate ClubVerse VIP Supporter ⚽. Dedicated to excellence on the pitch and bringing victory to the squad.'}
              </p>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#20221F] text-white font-bold text-xs shadow-warm-md hover:bg-[#7A8B5A] transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
