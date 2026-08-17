import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';

export default function UpcomingMatches() {
  const [selectedComp, setSelectedComp] = useState('ALL');

  const competitions = ['ALL', 'La Liga', 'Champions Cup', 'Copa Cup'];

  const matches = [
    {
      id: 1,
      competition: 'La Liga',
      compBadge: 'LA LIGA • MATCHDAY 28',
      homeTeam: 'ClubVerse FC',
      awayTeam: 'Real Madrid',
      homeCrest: 'CV',
      awayCrest: 'RMA',
      date: 'May 12, 2026',
      time: '9:00 PM CEST',
      stadium: 'Spotify Arena, Barcelona',
      status: 'EL CLÁSICO',
      priceFrom: '€85',
      isHome: true
    },
    {
      id: 2,
      competition: 'Champions Cup',
      compBadge: 'UCL • QUARTER FINAL',
      homeTeam: 'ClubVerse FC',
      awayTeam: 'Bayern Munich',
      homeCrest: 'CV',
      awayCrest: 'BAY',
      date: 'May 18, 2026',
      time: '8:45 PM CEST',
      stadium: 'Spotify Arena, Barcelona',
      status: 'HIGH DEMAND',
      priceFrom: '€110',
      isHome: true
    },
    {
      id: 3,
      competition: 'La Liga',
      compBadge: 'LA LIGA • MATCHDAY 29',
      homeTeam: 'Atlético Madrid',
      awayTeam: 'ClubVerse FC',
      homeCrest: 'ATM',
      awayCrest: 'CV',
      date: 'May 24, 2026',
      time: '6:30 PM CEST',
      stadium: 'Metropolitano Stadium, Madrid',
      status: 'AWAY MATCH',
      priceFrom: '€65',
      isHome: false
    },
    {
      id: 4,
      competition: 'Copa Cup',
      compBadge: 'COPA CUP • FINAL',
      homeTeam: 'ClubVerse FC',
      awayTeam: 'Athletic Club',
      homeCrest: 'CV',
      awayCrest: 'ATH',
      date: 'June 02, 2026',
      time: '10:00 PM CEST',
      stadium: 'Cartuja Stadium, Sevilla',
      status: 'FINAL',
      priceFrom: '€95',
      isHome: true
    }
  ];

  const filteredMatches = selectedComp === 'ALL'
    ? matches
    : matches.filter(m => m.competition === selectedComp);

  const scrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="matches" className="py-24 bg-[#F7F5EF] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm">
              <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>MATCH SCHEDULE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
              Upcoming Fixtures
            </h2>
            <p className="text-sm text-[#6F716B] mt-2 font-medium max-w-xl">
              Static matchday pass tiers for upcoming home and tournament clashes at Spotify Arena.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#EFEEE8] p-1.5 rounded-full border border-[#E4E1D8] overflow-x-auto">
            {competitions.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedComp(comp)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  selectedComp === comp
                    ? 'bg-[#7A8B5A] text-white shadow-warm-sm'
                    : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#FFFDF8]'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Fixtures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((match) => (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E4E1D8] shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">
                      {match.compBadge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#EFEEE8] text-[#20221F]">
                      {match.status}
                    </span>
                  </div>

                  {/* Teams Block */}
                  <div className="bg-[#EFEEE8]/60 p-4 rounded-2xl border border-[#E4E1D8] mb-5 space-y-3">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          match.homeCrest === 'CV' 
                            ? 'bg-[#2E332B] text-[#B08D57]' 
                            : 'bg-[#FFFDF8] text-[#20221F] border border-[#E4E1D8]'
                        }`}>
                          {match.homeCrest}
                        </div>
                        <span className={`text-xs font-bold ${match.homeCrest === 'CV' ? 'text-[#20221F]' : 'text-[#6F716B]'}`}>
                          {match.homeTeam}
                        </span>
                      </div>
                      {match.isHome && <span className="text-[9px] font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2 py-0.5 rounded">HOME</span>}
                    </div>

                    <div className="h-px bg-[#E4E1D8] w-full"></div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          match.awayCrest === 'CV' 
                            ? 'bg-[#2E332B] text-[#B08D57]' 
                            : 'bg-[#FFFDF8] text-[#20221F] border border-[#E4E1D8]'
                        }`}>
                          {match.awayCrest}
                        </div>
                        <span className={`text-xs font-bold ${match.awayCrest === 'CV' ? 'text-[#20221F]' : 'text-[#6F716B]'}`}>
                          {match.awayTeam}
                        </span>
                      </div>
                      {!match.isHome && <span className="text-[9px] font-bold text-[#6F716B] bg-[#EFEEE8] px-2 py-0.5 rounded">AWAY</span>}
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-1.5 mb-5 text-xs text-[#6F716B]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#B08D57]" />
                      <span className="font-semibold text-[#20221F]">{match.date} • {match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6F716B] flex-shrink-0" />
                      <span className="truncate">{match.stadium}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action -> Scroll to Tickets Tier */}
                <div className="pt-4 border-t border-[#E4E1D8] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#6F716B] block uppercase">PASSES FROM</span>
                    <span className="text-base font-bold text-[#7A8B5A]">{match.priceFrom}</span>
                  </div>

                  <button
                    onClick={scrollToTickets}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#7A8B5A] hover:bg-[#627146] transition-colors flex items-center gap-1 shadow-warm-sm"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View Passes</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
