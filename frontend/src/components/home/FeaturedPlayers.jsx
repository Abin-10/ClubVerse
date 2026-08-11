import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, ArrowUpRight } from 'lucide-react';

export default function FeaturedPlayers({ onSelectPlayer }) {
  const [activePosition, setActivePosition] = useState('ALL');

  const positions = ['ALL', 'FORWARDS', 'MIDFIELDERS', 'DEFENDERS', 'GOALKEEPERS'];

  const squad = [
    {
      id: 1,
      name: "Lamine Yamal",
      position: "FORWARDS",
      role: "Right Winger",
      number: 19,
      rating: 92,
      pace: 96,
      shooting: 86,
      passing: 91,
      dribbling: 97,
      defense: 45,
      physicality: 76,
      goals: 14,
      assists: 18,
      marketValue: "€180M",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      bio: "Generational talent from the youth academy. Famous for sharp dribbling, curlers, and vision."
    },
    {
      id: 2,
      name: "Robert Lewandowski",
      position: "FORWARDS",
      role: "Center Forward",
      number: 9,
      rating: 91,
      pace: 84,
      shooting: 94,
      passing: 82,
      dribbling: 87,
      defense: 44,
      physicality: 88,
      goals: 29,
      assists: 9,
      marketValue: "€25M",
      country: "Poland",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
      bio: "Goalscoring leader with exceptional positioning and clinical finish inside the box."
    },
    {
      id: 3,
      name: "Pedri González",
      position: "MIDFIELDERS",
      role: "Central Midfielder",
      number: 8,
      rating: 90,
      pace: 86,
      shooting: 81,
      passing: 95,
      dribbling: 94,
      defense: 72,
      physicality: 75,
      goals: 8,
      assists: 12,
      marketValue: "€120M",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800",
      bio: "Midfield orchestrator controlling tempo with precise passing and spatial awareness."
    },
    {
      id: 4,
      name: "Gavi (Pablo Martín)",
      position: "MIDFIELDERS",
      role: "Central Midfielder",
      number: 6,
      rating: 88,
      pace: 88,
      shooting: 79,
      passing: 89,
      dribbling: 90,
      defense: 84,
      physicality: 89,
      goals: 6,
      assists: 9,
      marketValue: "€90M",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
      bio: "High-intensity midfielder with tackle commitment, tactical intelligence, and energy."
    },
    {
      id: 5,
      name: "Ronald Araújo",
      position: "DEFENDERS",
      role: "Center Back",
      number: 4,
      rating: 89,
      pace: 90,
      shooting: 55,
      passing: 75,
      dribbling: 72,
      defense: 92,
      physicality: 93,
      goals: 4,
      assists: 2,
      marketValue: "€85M",
      country: "Uruguay",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      bio: "Defensive leader known for aerial dominance, sprint speed, and one-on-one tackle strength."
    },
    {
      id: 6,
      name: "Marc-André ter Stegen",
      position: "GOALKEEPERS",
      role: "Goalkeeper",
      number: 1,
      rating: 89,
      pace: 50,
      shooting: 30,
      passing: 91,
      dribbling: 60,
      defense: 90,
      physicality: 86,
      goals: 0,
      assists: 1,
      marketValue: "€30M",
      country: "Germany",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      bio: "Experienced shot-stopper with elite distribution skills initiating team build-up."
    }
  ];

  const filteredSquad = activePosition === 'ALL' 
    ? squad 
    : squad.filter(p => p.position === activePosition);

  return (
    <section id="players" className="py-24 bg-[#F7F5EF] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm">
              <Users className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>FIRST TEAM ROSTER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
              Featured Players
            </h2>
            <p className="text-sm text-[#6F716B] mt-2 font-medium max-w-xl">
              Discover key playmakers and academy stars driving ClubVerse performance on the pitch.
            </p>
          </div>

          {/* Position Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#EFEEE8] p-1.5 rounded-full border border-[#E4E1D8] overflow-x-auto">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setActivePosition(pos)}
                className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${
                  activePosition === pos
                    ? 'bg-[#7A8B5A] text-white shadow-warm-sm font-bold'
                    : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#FFFDF8]'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Squad Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSquad.map((player) => (
              <motion.div 
                key={player.id} 
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => onSelectPlayer(player)}
                className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E4E1D8] shadow-warm-sm hover:shadow-warm-md group cursor-pointer transition-all hover:-translate-y-1.5"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEEE8]">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20221F]/70 via-transparent to-transparent"></div>

                  {/* Jersey Number */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-[#2E332B] text-[#B08D57] font-bold text-xs flex items-center justify-center shadow-warm-sm">
                    #{player.number}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-[#FFFDF8]/90 backdrop-blur-md text-[#20221F] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-warm-sm border border-[#E4E1D8]">
                    <Star className="w-3.5 h-3.5 fill-[#B08D57] text-[#B08D57]" />
                    <span>{player.rating}</span>
                  </div>

                  {/* Name */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="text-[10px] font-bold text-[#B08D57] uppercase tracking-widest block">
                      {player.role} • {player.country}
                    </span>
                    <h3 className="text-2xl font-semibold text-white font-serif tracking-tight">
                      {player.name}
                    </h3>
                  </div>
                </div>

                {/* Stats & Market Value */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#EFEEE8] p-2 rounded-xl border border-[#E4E1D8]">
                      <span className="text-[9px] font-bold text-[#6F716B] block uppercase">PACE</span>
                      <span className="text-xs font-bold text-[#7A8B5A]">{player.pace}</span>
                    </div>
                    <div className="bg-[#EFEEE8] p-2 rounded-xl border border-[#E4E1D8]">
                      <span className="text-[9px] font-bold text-[#6F716B] block uppercase">SHOOTING</span>
                      <span className="text-xs font-bold text-[#20221F]">{player.shooting}</span>
                    </div>
                    <div className="bg-[#EFEEE8] p-2 rounded-xl border border-[#E4E1D8]">
                      <span className="text-[9px] font-bold text-[#6F716B] block uppercase">PASSING</span>
                      <span className="text-xs font-bold text-[#B08D57]">{player.passing}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E4E1D8] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#6F716B] uppercase block">MARKET VALUE</span>
                      <span className="text-xs font-bold text-[#20221F]">{player.marketValue}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#7A8B5A]">
                      <span>View Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
