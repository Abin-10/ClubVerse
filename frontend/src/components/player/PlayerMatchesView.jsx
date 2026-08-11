import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Search, CheckCircle2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PlayerMatchesView({ searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'

  const upcomingFixtures = [
    {
      id: 1,
      opponent: 'Manchester City',
      competition: 'Premier League',
      date: 'Aug 12, 2026',
      time: '16:30 BST',
      venue: 'Spotify Arena (Home)',
      ticketStatus: 'Sold Out',
      squadStatus: 'Starting XI Selected'
    },
    {
      id: 2,
      opponent: 'Liverpool FC',
      competition: 'Premier League',
      date: 'Aug 18, 2026',
      time: '20:00 BST',
      venue: 'Anfield (Away)',
      ticketStatus: 'Away Allocation Full',
      squadStatus: 'Roster Pending'
    },
    {
      id: 3,
      opponent: 'Bayern Munich',
      competition: 'UEFA Champions League Group Stage',
      date: 'Aug 25, 2026',
      time: '20:00 CEST',
      venue: 'Spotify Arena (Home)',
      ticketStatus: 'VIP Pass Active',
      squadStatus: 'Roster Pending'
    }
  ];

  const previousResults = [
    {
      id: 101,
      opponent: 'Chelsea FC',
      score: '3 - 1',
      outcome: 'Win',
      date: 'Aug 5, 2026',
      goals: 'Saka 22\', Martinelli 45\', Rice 78\'',
      myPerformance: '1 Goal, 1 Assist (Rating: 8.8)'
    },
    {
      id: 102,
      opponent: 'Tottenham Hotspur',
      score: '2 - 0',
      outcome: 'Win',
      date: 'Jul 29, 2026',
      goals: 'Saka 14\', Saka 62\' (P)',
      myPerformance: '2 Goals (Rating: 9.1 - Man of the Match)'
    },
    {
      id: 103,
      opponent: 'Real Madrid',
      score: '2 - 1',
      outcome: 'Win',
      date: 'Jul 22, 2026 (Pre-Season Tour)',
      goals: 'Havertz 35\', Saka 58\'',
      myPerformance: '1 Goal, 1 Assist (Rating: 8.5)'
    }
  ];

  const filteredUpcoming = upcomingFixtures.filter(f => 
    f.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.competition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = previousResults.filter(r => 
    r.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.score.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            ClubVerse Match Hub
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            View upcoming matchday schedules and past fixture scorelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#20221F] text-white shadow-warm-sm'
                : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
            }`}
          >
            Upcoming Fixtures ({upcomingFixtures.length})
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-[#20221F] text-white shadow-warm-sm'
                : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
            }`}
          >
            Previous Results ({previousResults.length})
          </button>
        </div>
      </div>

      {/* Upcoming Fixtures Tab */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {filteredUpcoming.map((fixture) => (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7A8B5A]/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7A8B5A]">
                  <Trophy className="w-4 h-4 text-[#7A8B5A]" />
                  <span className="uppercase tracking-wider">{fixture.competition}</span>
                </div>

                <h3 className="font-serif font-black text-2xl text-[#20221F]">
                  ClubVerse FC <span className="text-[#6F716B] font-light">vs</span> {fixture.opponent}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6F716B]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    {fixture.date} • {fixture.time}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    {fixture.venue}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center">
                <div className="px-4 py-2 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-right">
                  <div className="text-[10px] font-bold text-[#6F716B]">Squad Status</div>
                  <div className="text-xs font-black text-[#7A8B5A]">{fixture.squadStatus}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Previous Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {filteredResults.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7A8B5A]/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    {res.outcome}
                  </span>
                  <span className="text-xs text-[#6F716B] font-semibold">{res.date}</span>
                </div>

                <h3 className="font-serif font-black text-2xl text-[#20221F]">
                  ClubVerse FC <span className="px-3 py-1 rounded-xl bg-[#20221F] text-[#BEF264] text-xl font-mono mx-1">{res.score}</span> {res.opponent}
                </h3>

                <p className="text-xs text-[#6F716B]">
                  <strong>Scorers:</strong> {res.goals}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-xs font-bold text-[#627146] space-y-1 md:text-right">
                <div className="text-[10px] uppercase text-[#7A8B5A] tracking-wider">My Performance</div>
                <div className="text-xs font-black text-[#20221F]">{res.myPerformance}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
