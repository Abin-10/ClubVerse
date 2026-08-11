import React from 'react';
import { X, Star, Trophy, Award, Shield, Activity, Flag } from 'lucide-react';
import Badge from '../common/Badge';

export default function PlayerDetailModal({ player, onClose }) {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scale-up">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/90 hover:text-white bg-slate-900/60 rounded-full backdrop-blur-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header Banner */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
          <img 
            src={player.image} 
            alt={player.name}
            className="w-full h-full object-cover object-top opacity-90" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

          <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 font-extrabold text-xs">
                  #{player.number}
                </span>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  {player.position}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1">{player.name}</h2>
            </div>
            
            <div className="bg-amber-500 text-slate-950 px-3 py-1 rounded-xl font-extrabold text-sm flex items-center gap-1 shadow-md">
              <Star className="w-4 h-4 fill-current" />
              <span>{player.rating}</span>
            </div>
          </div>
        </div>

        {/* Player Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {player.goals !== undefined && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Goals</span>
                <span className="text-xl font-black text-slate-900">{player.goals}</span>
              </div>
            )}
            {player.assists !== undefined && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Assists</span>
                <span className="text-xl font-black text-slate-900">{player.assists}</span>
              </div>
            )}
            {player.cleanSheets !== undefined && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Clean Sheets</span>
                <span className="text-xl font-black text-slate-900">{player.cleanSheets}</span>
              </div>
            )}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Matches</span>
              <span className="text-xl font-black text-slate-900">{player.matchesPlayed}</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Player Profile & Bio
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {player.bio}
            </p>
          </div>

          {/* Additional details */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-blue-600" />
              <span>Nationality: <b>{player.nationality}</b></span>
            </div>
            <div>
              <span>Age: <b>{player.age} Years</b></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
