import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Search, CheckCircle2, Clock } from 'lucide-react';

export default function CoachMatchesView({ searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'

  const upcomingFixtures = [
    {
      id: 1,
      opponent: 'Manchester City',
      competition: 'Premier League',
      date: 'Aug 12, 2026',
      time: '16:30 BST',
      venue: 'Spotify Arena (Home)',
      tacticalFormation: '4-3-3 High Press',
      squadReadiness: 'Roster Finalized'
    },
    {
      id: 2,
      opponent: 'Liverpool FC',
      competition: 'Premier League',
      date: 'Aug 18, 2026',
      time: '20:00 BST',
      venue: 'Anfield (Away)',
      tacticalFormation: '4-2-3-1 Mid-Block',
      squadReadiness: 'Tactical Briefing Scheduled'
    }
  ];

  const matchResults = [
    {
      id: 101,
      opponent: 'Chelsea FC',
      score: '3 - 1',
      outcome: 'Win',
      date: 'Aug 5, 2026',
      coachNotes: 'Excellent execution of wing overloads and defensive transitions.'
    },
    {
      id: 102,
      opponent: 'Tottenham Hotspur',
      score: '2 - 0',
      outcome: 'Win',
      date: 'Jul 29, 2026',
      coachNotes: 'Clean sheet achieved. High pressing trapped opponent in build-up phase.'
    }
  ];

  const filteredUpcoming = upcomingFixtures.filter(f => 
    f.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.competition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = matchResults.filter(r => 
    r.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.score.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Matches & Fixture Manager
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Manage upcoming matchday tactics, rosters, and analyze past fixture results.
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
            Match Results ({matchResults.length})
          </button>
        </div>
      </div>

      {/* Upcoming Fixtures */}
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

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-right">
                  <div className="text-[10px] font-bold text-[#6F716B]">Tactical Formation</div>
                  <div className="text-xs font-black text-[#20221F]">{fixture.tacticalFormation}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Match Results */}
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
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs space-y-1 md:max-w-md">
                <div className="font-bold text-[#20221F]">Head Coach Evaluation</div>
                <p className="text-[#6F716B] leading-relaxed">{res.coachNotes}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
