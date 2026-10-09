import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Shield, 
  Search, 
  RefreshCw, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Building,
  Flame,
  ChevronRight,
  X
} from 'lucide-react';
import { getTeamLogo } from '../../utils/teamUtils';

const API = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api` ;

export default function PointsTableComponent({ triggerToast }) {
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStandingsData = async () => {
    try {
      setLoading(true);
      let tRes, fRes;
      try {
        [tRes, fRes] = await Promise.all([
          fetch(`${API}/teams`),
          fetch(`${API}/fixtures`)
        ]);
      } catch (err) {
        [tRes, fRes] = await Promise.all([
          fetch(`http://127.0.0.1:5000/api/teams`),
          fetch(`http://127.0.0.1:5000/api/fixtures`)
        ]);
      }

      if (tRes.ok) setTeams(await tRes.json());
      if (fRes.ok) setFixtures(await fRes.json());
    } catch (err) {
      console.warn('Points Table fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandingsData();
  }, []);

  // Compute points table for all teams registered in DB
  const standings = useMemo(() => {
    if (!Array.isArray(teams) || teams.length === 0) return [];

    const completedFixtures = (Array.isArray(fixtures) ? fixtures : []).filter(
      f => f.status === 'Completed'
    );

    const statsMap = {};

    // Initialize every registered team in MongoDB with 0 stats
    teams.forEach(t => {
      const id = String(t._id || t.id);
      statsMap[id] = {
        team: t,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
        form: [] // recent match outcomes e.g. ['W', 'D', 'W']
      };
    });

    // Process completed fixtures
    completedFixtures.forEach(f => {
      const homeId = String(f.home_team?._id || f.home_team);
      const awayId = String(f.away_team?._id || f.away_team);
      const hScore = Number(f.home_score || 0);
      const aScore = Number(f.away_score || 0);

      // Home Team
      if (statsMap[homeId]) {
        const s = statsMap[homeId];
        s.played += 1;
        s.gf += hScore;
        s.ga += aScore;
        if (hScore > aScore) {
          s.won += 1;
          s.pts += 3;
          s.form.push('W');
        } else if (hScore === aScore) {
          s.drawn += 1;
          s.pts += 1;
          s.form.push('D');
        } else {
          s.lost += 1;
          s.form.push('L');
        }
      }

      // Away Team
      if (statsMap[awayId]) {
        const s = statsMap[awayId];
        s.played += 1;
        s.gf += aScore;
        s.ga += hScore;
        if (aScore > hScore) {
          s.won += 1;
          s.pts += 3;
          s.form.push('W');
        } else if (aScore === hScore) {
          s.drawn += 1;
          s.pts += 1;
          s.form.push('D');
        } else {
          s.lost += 1;
          s.form.push('L');
        }
      }
    });

    // Calculate GD & sort standings: PTS desc -> GD desc -> GF desc -> Name asc
    const table = Object.values(statsMap).map(item => ({
      ...item,
      gd: item.gf - item.ga,
      form: item.form.slice(-5) // Take last 5 matches
    }));

    table.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return (a.team.name || '').localeCompare(b.team.name || '');
    });

    return table;
  }, [teams, fixtures]);

  const filteredStandings = useMemo(() => {
    if (!searchQuery.trim()) return standings;
    const q = searchQuery.toLowerCase();
    return standings.filter(item => 
      (item.team.name || '').toLowerCase().includes(q) ||
      (item.team.short_name || '').toLowerCase().includes(q)
    );
  }, [standings, searchQuery]);

  const leader = standings[0]?.team;
  const runnerUp = standings[1]?.team;
  const thirdPlace = standings[2]?.team;

  return (
    <div className="space-y-6 font-sans text-[#20221F]">
      
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-br from-[#FFFDF8] via-[#F7F5EF] to-[#EFECE1] border border-[#E4E1D8] rounded-[2.5rem] p-6 lg:p-8 shadow-warm-md relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7A8B5A]/15 via-[#B08D57]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-warm-xs">
                <Trophy className="w-3.5 h-3.5 text-[#BEF264]" />
                Official League Standings
              </span>
              <span className="text-xs text-[#7A8B5A] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A]" />
                MongoDB Auto Calculated
              </span>
            </div>
            
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#20221F] tracking-tight">
              Points Table & Standings
            </h2>
            <p className="text-xs sm:text-sm text-[#6F716B] leading-relaxed">
              Real-time standings computed dynamically from all registered teams and completed match results in MongoDB.
            </p>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {leader && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#20221F] to-[#2E332B] text-white border border-[#7A8B5A]/40 shadow-warm-xs flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-white border border-white/20 overflow-hidden shadow-sm mb-1 p-0.5">
                  <img src={getTeamLogo(leader)} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-black uppercase text-[#BEF264]">🥇 1st Place</span>
                <span className="text-xs font-bold truncate max-w-[100px] mt-0.5">{leader.name}</span>
                <span className="text-xs font-serif font-black text-[#BEF264] mt-0.5">{standings[0]?.pts} PTS</span>
              </div>
            )}

            {runnerUp && (
              <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E1D8] overflow-hidden shadow-sm mb-1 p-0.5">
                  <img src={getTeamLogo(runnerUp)} alt={runnerUp.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-black uppercase text-[#6F716B]">🥈 2nd Place</span>
                <span className="text-xs font-bold text-[#20221F] truncate max-w-[100px] mt-0.5">{runnerUp.name}</span>
                <span className="text-xs font-serif font-black text-[#7A8B5A] mt-0.5">{standings[1]?.pts} PTS</span>
              </div>
            )}

            {thirdPlace && (
              <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E1D8] overflow-hidden shadow-sm mb-1 p-0.5">
                  <img src={getTeamLogo(thirdPlace)} alt={thirdPlace.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-black uppercase text-[#B08D57]">🥉 3rd Place</span>
                <span className="text-xs font-bold text-[#20221F] truncate max-w-[100px] mt-0.5">{thirdPlace.name}</span>
                <span className="text-xs font-serif font-black text-[#B08D57] mt-0.5">{standings[2]?.pts} PTS</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TOOLBAR CONTROLS ── */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl p-4 shadow-warm-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#20221F] flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#7A8B5A]" />
            Registered Clubs: <span className="font-extrabold text-[#7A8B5A]">{teams.length} Teams</span>
          </span>
          <span className="text-[#E4E1D8]">•</span>
          <span className="text-xs font-medium text-[#6F716B]">
            Matches Evaluated: <span className="font-bold text-[#20221F]">{fixtures.filter(f => f.status === 'Completed').length} Completed</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Field */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F716B]" />
            <input
              type="text"
              placeholder="Search registered team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Refresh Standings Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStandingsData}
            className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] transition-all shrink-0"
            title="Refresh Points Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#7A8B5A]' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* ── LEAGUE POINTS TABLE ── */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] shadow-warm-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6F716B] flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#7A8B5A]" />
            <span className="text-xs font-bold">Computing League Standings from MongoDB...</span>
          </div>
        ) : filteredStandings.length === 0 ? (
          <div className="p-12 text-center text-[#6F716B] space-y-3">
            <Shield className="w-10 h-10 mx-auto opacity-30 text-[#20221F]" />
            <h4 className="font-serif font-bold text-lg text-[#20221F]">No Registered Teams Found</h4>
            <p className="text-xs max-w-sm mx-auto">
              {searchQuery ? `No teams match "${searchQuery}".` : 'Register teams in the Teams tab to generate the live points table!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#F7F5EF] border-b border-[#E4E1D8] text-[11px] font-black uppercase text-[#6F716B] tracking-wider">
                  <th className="py-4 px-4 text-center w-14">POS</th>
                  <th className="py-4 px-6">CLUB / TEAM</th>
                  <th className="py-4 px-3 text-center">MP</th>
                  <th className="py-4 px-3 text-center">W</th>
                  <th className="py-4 px-3 text-center">D</th>
                  <th className="py-4 px-3 text-center">L</th>
                  <th className="py-4 px-3 text-center hidden sm:table-cell">GF</th>
                  <th className="py-4 px-3 text-center hidden sm:table-cell">GA</th>
                  <th className="py-4 px-3 text-center">GD</th>
                  <th className="py-4 px-4 text-center bg-[#7A8B5A]/10 text-[#7A8B5A]">PTS</th>
                  <th className="py-4 px-6 text-center hidden md:table-cell">FORM (LAST 5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1D8]/70 text-xs">
                {filteredStandings.map((item, idx) => {
                  const pos = idx + 1;
                  const isLeader = pos === 1;
                  const isTopFour = pos <= 4;
                  const team = item.team;

                  return (
                    <motion.tr 
                      key={team._id || team.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`hover:bg-[#F7F5EF]/80 transition-colors ${
                        isLeader ? 'bg-[#7A8B5A]/5' : ''
                      }`}
                    >
                      {/* Position # */}
                      <td className="py-4 px-4 text-center font-bold">
                        <div className="flex items-center justify-center">
                          {pos === 1 && (
                            <span className="w-7 h-7 rounded-full bg-[#BEF264] text-[#20221F] font-serif font-black flex items-center justify-center text-xs shadow-warm-xs border border-[#7A8B5A]/30">
                              1
                            </span>
                          )}
                          {pos === 2 && (
                            <span className="w-7 h-7 rounded-full bg-[#E4E1D8] text-[#20221F] font-serif font-black flex items-center justify-center text-xs shadow-warm-xs">
                              2
                            </span>
                          )}
                          {pos === 3 && (
                            <span className="w-7 h-7 rounded-full bg-[#B08D57]/20 text-[#B08D57] font-serif font-black flex items-center justify-center text-xs border border-[#B08D57]/30">
                              3
                            </span>
                          )}
                          {pos > 3 && (
                            <span className="text-[#6F716B] font-bold text-xs">
                              {pos}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Team Name & Crest */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-warm-xs flex-shrink-0 bg-white relative"
                            style={{ backgroundColor: team.logo_color || '#3B82F6' }}
                          >
                            <img 
                              src={getTeamLogo(team)} 
                              alt={team.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-black text-sm text-[#20221F] truncate">
                                {team.name}
                              </h4>
                              {isLeader && (
                                <span className="px-2 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[9px] font-black uppercase">
                                  Leader
                                </span>
                              )}
                              {(team.short_name === 'CVFC' || team.name.toLowerCase().includes('clubverse')) && (
                                <span className="px-2 py-0.5 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[9px] font-extrabold uppercase border border-[#7A8B5A]/30">
                                  Home Club
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#6F716B] font-mono font-bold">
                              Code: {team.short_name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Matches Played */}
                      <td className="py-4 px-3 text-center font-bold text-[#20221F]">
                        {item.played}
                      </td>

                      {/* Wins */}
                      <td className="py-4 px-3 text-center font-bold text-emerald-700">
                        {item.won}
                      </td>

                      {/* Draws */}
                      <td className="py-4 px-3 text-center font-bold text-amber-700">
                        {item.drawn}
                      </td>

                      {/* Losses */}
                      <td className="py-4 px-3 text-center font-bold text-red-600">
                        {item.lost}
                      </td>

                      {/* Goals For */}
                      <td className="py-4 px-3 text-center text-[#6F716B] font-medium hidden sm:table-cell">
                        {item.gf}
                      </td>

                      {/* Goals Against */}
                      <td className="py-4 px-3 text-center text-[#6F716B] font-medium hidden sm:table-cell">
                        {item.ga}
                      </td>

                      {/* Goal Difference */}
                      <td className="py-4 px-3 text-center font-extrabold">
                        <span className={item.gd > 0 ? 'text-emerald-600' : item.gd < 0 ? 'text-red-500' : 'text-[#6F716B]'}>
                          {item.gd > 0 ? `+${item.gd}` : item.gd}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-4 px-4 text-center bg-[#7A8B5A]/10 font-serif font-black text-sm text-[#20221F]">
                        {item.pts}
                      </td>

                      {/* Form (Last 5) */}
                      <td className="py-4 px-6 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {item.form.length === 0 ? (
                            <span className="text-[10px] text-[#9CA3AF] italic">No matches</span>
                          ) : (
                            item.form.map((res, i) => (
                              <span 
                                key={i} 
                                className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                                  res === 'W' ? 'bg-[#22C55E]' : res === 'D' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                                }`}
                                title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}
                              >
                                {res}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
