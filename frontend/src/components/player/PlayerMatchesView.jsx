import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Search, CheckCircle2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PlayerMatchesView({ searchQuery = '', fixtures = [] }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'

  const upcomingList = (fixtures || []).filter(f => f.status !== 'Completed');
  const resultsList = (fixtures || []).filter(f => f.status === 'Completed');

  const mappedUpcoming = upcomingList.map((f, idx) => {
    const homeTeam = f.home_team || { name: 'ClubVerse FC', short_name: 'CVFC' };
    const awayTeam = f.away_team || { name: 'Opponent', short_name: 'OPP' };
    const isHomeCV = (homeTeam.name || '').toLowerCase().includes('clubverse') || (homeTeam.name || '').toLowerCase().includes('cvfc');
    const oppName = isHomeCV ? (awayTeam.name || 'Opponent') : (homeTeam.name || 'Home Team');

    let dateStr = 'TBD';
    if (f.match_date) {
      const d = new Date(f.match_date);
      if (!isNaN(d.getTime())) dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return {
      id: f._id || idx,
      opponent: oppName,
      competition: f.competition || 'Premier League',
      date: dateStr,
      time: f.match_time || '20:00 BST',
      venue: f.venue || 'ClubVerse Arena',
      isHome: isHomeCV
    };
  });

  const mappedResults = resultsList.map((f, idx) => {
    const homeTeam = f.home_team || { name: 'ClubVerse FC', short_name: 'CVFC' };
    const awayTeam = f.away_team || { name: 'Opponent', short_name: 'OPP' };
    const isHomeCV = (homeTeam.name || '').toLowerCase().includes('clubverse') || (homeTeam.name || '').toLowerCase().includes('cvfc');
    const oppName = isHomeCV ? (awayTeam.name || 'Opponent') : (homeTeam.name || 'Home Team');
    const cvScore = isHomeCV ? (f.home_score ?? 0) : (f.away_score ?? 0);
    const oppScore = isHomeCV ? (f.away_score ?? 0) : (f.home_score ?? 0);

    let outcome = 'Draw';
    if (cvScore > oppScore) outcome = 'Win';
    else if (cvScore < oppScore) outcome = 'Loss';

    let dateStr = 'Completed';
    if (f.match_date) {
      const d = new Date(f.match_date);
      if (!isNaN(d.getTime())) dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return {
      id: f._id || idx,
      opponent: oppName,
      score: `${cvScore} - ${oppScore}`,
      outcome,
      date: dateStr,
      isHome: isHomeCV
    };
  });

  const filteredUpcoming = mappedUpcoming.filter(f => 
    f.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.competition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = mappedResults.filter(r => 
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
            Upcoming Fixtures ({mappedUpcoming.length})
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-[#20221F] text-white shadow-warm-sm'
                : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
            }`}
          >
            Previous Results ({mappedResults.length})
          </button>
        </div>
      </div>

      {/* Upcoming Fixtures Tab */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {filteredUpcoming.length > 0 ? (
            filteredUpcoming.map((fixture) => (
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
                    <span className="px-2 py-0.5 rounded-full bg-[#7A8B5A]/15 text-[#627146] text-[10px] font-extrabold">
                      {fixture.isHome ? 'Home' : 'Away'}
                    </span>
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
                    <div className="text-[10px] font-bold text-[#6F716B]">Status</div>
                    <div className="text-xs font-black text-[#7A8B5A]">Starting XI Selected</div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-[#6F716B] py-8 text-center bg-[#FFFDF8] rounded-3xl border border-[#E4E1D8]">
              No upcoming fixtures scheduled in database.
            </p>
          )}
        </div>
      )}

      {/* Previous Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((res) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7A8B5A]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      res.outcome === 'Win' ? 'bg-emerald-100 text-emerald-800' :
                      res.outcome === 'Loss' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {res.outcome}
                    </span>
                    <span className="text-xs text-[#6F716B] font-semibold">{res.date}</span>
                  </div>

                  <h3 className="font-serif font-black text-2xl text-[#20221F]">
                    ClubVerse FC <span className="px-3 py-1 rounded-xl bg-[#20221F] text-[#BEF264] text-xl font-mono mx-1">{res.score}</span> {res.opponent}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-xs font-bold text-[#627146] space-y-1 md:text-right">
                  <div className="text-[10px] uppercase text-[#7A8B5A] tracking-wider">Official Matchday Status</div>
                  <div className="text-xs font-black text-[#20221F]">Official Final Score</div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-[#6F716B] py-8 text-center bg-[#FFFDF8] rounded-3xl border border-[#E4E1D8]">
              No past completed matches found in database.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
