import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, Play, X } from 'lucide-react';

export default function MatchResults() {
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const results = [
    {
      id: 1,
      competition: 'La Liga • Bernabéu Stadium',
      homeTeam: 'Real Madrid',
      awayTeam: 'ClubVerse FC',
      homeCrest: 'RMA',
      awayCrest: 'CV',
      homeScore: 0,
      awayScore: 4,
      result: 'VICTORY',
      date: 'April 28, 2026',
      scorers: ['Yamal 22\'', 'Lewandowski 38\', 54\'', 'Raphinha 77\''],
      possession: '64%',
      shots: '18 (11 on target)',
      videoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 2,
      competition: 'Champions Cup • Spotify Arena',
      homeTeam: 'ClubVerse FC',
      awayTeam: 'Paris SG',
      homeCrest: 'CV',
      awayCrest: 'PSG',
      homeScore: 3,
      awayScore: 1,
      result: 'VICTORY',
      date: 'April 16, 2026',
      scorers: ['Pedri 14\'', 'Lewandowski 61\'', 'Gavi 89\''],
      possession: '58%',
      shots: '15 (9 on target)',
      videoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 3,
      competition: 'La Liga • Spotify Arena',
      homeTeam: 'ClubVerse FC',
      awayTeam: 'Atlético Madrid',
      homeCrest: 'CV',
      awayCrest: 'ATM',
      homeScore: 2,
      awayScore: 0,
      result: 'VICTORY',
      date: 'April 04, 2026',
      scorers: ['Olmo 31\'', 'López 79\''],
      possession: '68%',
      shots: '21 (14 on target)',
      videoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  return (
    <section className="py-24 bg-[#EFEEE8] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm">
              <Trophy className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>MATCH RECAPS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
              Latest Results
            </h2>
            <p className="text-sm text-[#6F716B] mt-2 font-medium max-w-xl">
              Verified scorelines, goal scorer logs, and tactical performance analytics from recent clashes.
            </p>
          </div>
        </div>

        {/* Results Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {results.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 relative overflow-hidden bg-[#FFFDF8] rounded-3xl border border-[#E4E1D8] shadow-warm-sm hover:shadow-warm-md flex flex-col justify-between group transition-all"
            >
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D8]">
                  <span className="text-[11px] font-bold text-[#6F716B] uppercase tracking-wider">{item.competition}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#7A8B5A]/15 text-[#7A8B5A]">
                    {item.result}
                  </span>
                </div>

                {/* Scoreboard */}
                <div className="py-6 flex items-center justify-between text-center bg-[#EFEEE8]/50 my-4 p-4 rounded-2xl border border-[#E4E1D8]">
                  
                  {/* Home Team */}
                  <div className="flex-1">
                    <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-xs mb-1 ${
                      item.homeCrest === 'CV' 
                        ? 'bg-[#2E332B] text-[#B08D57]' 
                        : 'bg-[#FFFDF8] text-[#20221F] border border-[#E4E1D8]'
                    }`}>
                      {item.homeCrest}
                    </div>
                    <span className="text-xs font-bold text-[#20221F] block truncate">
                      {item.homeTeam}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="px-4">
                    <span className="text-2xl sm:text-3xl font-bold text-[#20221F] font-serif">
                      {item.homeScore} - {item.awayScore}
                    </span>
                    <span className="text-[9px] font-bold text-[#6F716B] block uppercase mt-0.5">FULL TIME</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1">
                    <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-xs mb-1 ${
                      item.awayCrest === 'CV' 
                        ? 'bg-[#2E332B] text-[#B08D57]' 
                        : 'bg-[#FFFDF8] text-[#20221F] border border-[#E4E1D8]'
                    }`}>
                      {item.awayCrest}
                    </div>
                    <span className="text-xs font-bold text-[#20221F] block truncate">
                      {item.awayTeam}
                    </span>
                  </div>

                </div>

                {/* Goals Log */}
                <div className="space-y-1 mb-4 text-xs text-[#6F716B] bg-[#EFEEE8]/70 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-[#7A8B5A] uppercase block mb-1">GOALS LOG</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.scorers.map((scorer, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#FFFDF8] text-[#20221F] text-[11px] font-medium border border-[#E4E1D8]">
                        ⚽ {scorer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-[#E4E1D8] flex items-center justify-between">
                <div className="text-xs text-[#6F716B]">
                  <span className="font-semibold">Possession: </span>
                  <span className="text-[#7A8B5A] font-bold">{item.possession}</span>
                </div>

                <button
                  onClick={() => setSelectedHighlight(item)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#20221F] bg-[#EFEEE8] hover:bg-[#E4E1D8] transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  <span>Recap</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Video Modal Preview */}
      <AnimatePresence>
        {selectedHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedHighlight(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 max-w-2xl w-full text-[#20221F] shadow-warm-lg relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedHighlight(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EFEEE8] hover:bg-[#E4E1D8] text-[#20221F]"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-[#7A8B5A] uppercase tracking-wider block mb-1">
                {selectedHighlight.competition}
              </span>
              <h3 className="text-2xl font-semibold font-serif mb-4">
                {selectedHighlight.homeTeam} {selectedHighlight.homeScore} - {selectedHighlight.awayScore} {selectedHighlight.awayTeam} Highlights
              </h3>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-[#EFEEE8]">
                <img 
                  src={selectedHighlight.videoUrl} 
                  alt="Match Highlights" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#7A8B5A] text-white flex items-center justify-center font-bold shadow-warm-md hover:scale-105 transition-transform cursor-pointer">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#EFEEE8] p-3 rounded-xl border border-[#E4E1D8]">
                  <span className="text-[#6F716B] block font-semibold">POSSESSION</span>
                  <span className="text-lg font-bold text-[#7A8B5A]">{selectedHighlight.possession}</span>
                </div>
                <div className="bg-[#EFEEE8] p-3 rounded-xl border border-[#E4E1D8]">
                  <span className="text-[#6F716B] block font-semibold">TOTAL SHOTS</span>
                  <span className="text-lg font-bold text-[#20221F]">{selectedHighlight.shots}</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
