import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCw, 
  Eye, 
  Award, 
  Target, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  Globe,
  Activity
} from 'lucide-react';

export default function PlayerCard({ player, onInspect }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!player) return null;

  // Database values directly from MongoDB
  const goals = player.goals ?? 0;
  const assists = player.assists ?? 0;
  const matches = player.matches ?? 0;
  const rating = (player.rating !== undefined && player.rating !== null && player.rating > 0)
    ? Number(player.rating).toFixed(1) 
    : '0.0';

  const photo = player.profile_image || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="w-full h-[380px] [perspective:1000px] group">
      <div 
        className={`relative w-full h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ================= FRONT OF CARD ================= */}
        <div className="absolute inset-0 w-full h-full bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-5 shadow-warm-md flex flex-col justify-between [backface-visibility:hidden]">
          
          {/* Card Header: Jersey # & Position */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#20221F] text-[#BEF264] shadow-warm-sm border border-[#7A8B5A]/30">
              #{player.jersey_number || 10}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#7A8B5A]/15 text-[#7A8B5A] uppercase tracking-wider">
              {player.position || 'Forward'}
            </span>
          </div>

          {/* Center: Large Player Image with Subtle Glow */}
          <div className="relative my-auto flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7A8B5A]/40 to-[#BEF264]/40 rounded-full blur-md group-hover:scale-110 transition-transform" />
              <img 
                src={photo} 
                alt={player.full_name} 
                className="w-full h-full object-cover rounded-full border-4 border-[#FFFDF8] shadow-warm-lg relative z-10"
              />
            </div>
            
            <h3 className="font-serif font-black text-lg text-[#20221F] text-center line-clamp-1">
              {player.full_name}
            </h3>
            <p className="text-[11px] text-[#6F716B] font-semibold text-center">
              {player.nationality || 'ClubVerse FC'} • {player.market_value || '€85M'}
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-center my-1">
            <div>
              <div className="text-xs font-black text-[#20221F]">{goals}</div>
              <div className="text-[9px] text-[#6F716B] font-bold uppercase">Goals</div>
            </div>
            <div>
              <div className="text-xs font-black text-[#20221F]">{assists}</div>
              <div className="text-[9px] text-[#6F716B] font-bold uppercase">Assists</div>
            </div>
            <div>
              <div className="text-xs font-black text-[#7A8B5A]">{rating}</div>
              <div className="text-[9px] text-[#6F716B] font-bold uppercase">Rating</div>
            </div>
          </div>

          {/* Card Actions: Flip & View Profile */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsFlipped(true)}
              className="flex-1 py-2 rounded-full bg-[#EFEEE8] border border-[#E4E1D8] text-[#20221F] text-xs font-bold hover:bg-[#E4E1D8] transition-all flex items-center justify-center gap-1.5 shadow-warm-sm"
              title="Flip Card for details"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={() => onInspect && onInspect(player)}
              className="p-2 rounded-full bg-[#20221F] text-white hover:bg-[#7A8B5A] transition-all shadow-warm-sm"
              title="Inspect Full Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

        </div>


        {/* ================= BACK OF CARD ================= */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#20221F] via-[#2A2E26] to-[#1A1C18] text-white rounded-3xl p-5 shadow-warm-lg flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] border border-[#7A8B5A]/40">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h4 className="font-serif font-black text-sm text-[#BEF264]">{player.full_name}</h4>
              <span className="text-[10px] text-[#A1A19A] uppercase tracking-wider">{player.role_access || 'First Team Star'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#BEF264] text-[#20221F]">
              #{player.jersey_number || 10}
            </span>
          </div>

          {/* Attribute Details List */}
          <div className="space-y-2 text-xs py-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#A1A19A] flex items-center gap-1.5 text-[11px]">
                <Globe className="w-3.5 h-3.5 text-[#BEF264]" />
                Nationality
              </span>
              <span className="font-bold text-white text-[11px]">{player.nationality || 'England'}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#A1A19A] flex items-center gap-1.5 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-[#BEF264]" />
                Preferred Foot
              </span>
              <span className="font-bold text-white text-[11px]">{player.preferred_foot || 'Left'}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#A1A19A] flex items-center gap-1.5 text-[11px]">
                <Activity className="w-3.5 h-3.5 text-[#BEF264]" />
                Physique
              </span>
              <span className="font-bold text-white text-[11px]">{player.height || '178 cm'} • {player.weight || '72 kg'}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[#A1A19A] flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BEF264]" />
                Fitness Status
              </span>
              <span className="font-bold text-[#BEF264] text-[11px]">{player.medical_clearance || '100% Fit'}</span>
            </div>
          </div>

          {/* Card Actions on Back */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsFlipped(false)}
              className="flex-1 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#BEF264]" />
              <span>Flip Back</span>
            </button>

            <button
              onClick={() => onInspect && onInspect(player)}
              className="py-2 px-4 rounded-full bg-[#BEF264] text-[#20221F] text-xs font-black hover:bg-white transition-all shadow-warm-md"
            >
              Full Profile 👤
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
