import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, MapPin, Swords, Sparkles, 
  Trophy, Star, Award, Search, Plus, Minus, UserCheck, Flame, AlertTriangle
} from 'lucide-react';
import { formatTimeTo12Hour } from '../../utils/teamUtils';

const DEFAULT_SQUAD = [
  { _id: 'p1', full_name: 'Marcus Sterling', position: 'Forward (ST)', jersey_number: 9 },
  { _id: 'p2', full_name: 'Bukayo Saka', position: 'Right Winger (RW)', jersey_number: 7 },
  { _id: 'p3', full_name: 'Declan Rice', position: 'Central Midfield (CM)', jersey_number: 4 },
  { _id: 'p4', full_name: 'Gabriel Martinelli', position: 'Left Winger (LW)', jersey_number: 11 },
  { _id: 'p5', full_name: 'Martin Ødegaard', position: 'Attacking Midfield (CAM)', jersey_number: 8 },
  { _id: 'p6', full_name: 'William Saliba', position: 'Center Back (CB)', jersey_number: 2 },
  { _id: 'p7', full_name: 'Gabriel Magalhães', position: 'Center Back (CB)', jersey_number: 6 },
  { _id: 'p8', full_name: 'David Raya', position: 'Goalkeeper (GK)', jersey_number: 1 }
];

const getTeamLogo = (team) => {
  if (team?.logo_url) return team.logo_url;
  const s = (team?.short_name || '').toUpperCase();
  if (s === 'CVFC') return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
  if (s === 'MCY' || s === 'MCFC' || s === 'MCI') return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80';
  if (s === 'RMA') return 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80';
  if (s === 'BAR' || s === 'FCB') return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80';
  if (s === 'ARS') return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80';
  return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
};

export default function FixtureModal({ isOpen, onClose, onSave, fixtureToEdit, teams = [] }) {
  const [stadiums, setStadiums] = useState([]);
  const [playersList, setPlayersList] = useState(DEFAULT_SQUAD);
  const [playerSearch, setPlayerSearch] = useState('');

  const [form, setForm] = useState({
    home_team: '',
    away_team: '',
    match_date: '',
    match_time: '',
    venue: 'Campnow',
    status: 'Upcoming',
    home_score: 0,
    away_score: 0
  });

  const [playerPerformances, setPlayerPerformances] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stadiumRes, playerRes] = await Promise.all([
          fetch(`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')}/api/stadiums` ),
          fetch(`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')}/api/players` )
        ]);

        if (stadiumRes.ok) {
          const sData = await stadiumRes.json();
          if (sData.stadiums && sData.stadiums.length > 0) {
            setStadiums(sData.stadiums);
            if (!fixtureToEdit) {
              setForm(f => ({ ...f, venue: sData.stadiums[0].name }));
            }
          }
        }

        if (playerRes.ok) {
          const pData = await playerRes.json();
          if (Array.isArray(pData) && pData.length > 0) {
            setPlayersList(pData);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch modal context data:', err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen, fixtureToEdit]);

  useEffect(() => {
    if (fixtureToEdit) {
      setForm({
        home_team: fixtureToEdit.home_team?._id || fixtureToEdit.home_team || '',
        away_team: fixtureToEdit.away_team?._id || fixtureToEdit.away_team || '',
        match_date: fixtureToEdit.match_date ? new Date(fixtureToEdit.match_date).toISOString().split('T')[0] : '',
        match_time: fixtureToEdit.match_time || '',
        venue: fixtureToEdit.venue || (stadiums[0]?.name || 'Campnow'),
        status: fixtureToEdit.status || 'Upcoming',
        home_score: fixtureToEdit.home_score ?? 0,
        away_score: fixtureToEdit.away_score ?? 0
      });

      // Build performances map from existing fixture data merged with current player list
      const perfMap = {};
      const savedPerfs = fixtureToEdit.player_performances || [];

      playersList.forEach(player => {
        const pid = player._id || player.id;
        const saved = savedPerfs.find(p => p.player_id === pid || p.player_name === player.full_name);
        perfMap[pid] = {
          player_id: pid,
          player_name: player.full_name,
          jersey_number: player.jersey_number,
          position: player.position,
          rating: saved?.rating !== undefined && saved?.rating !== null ? saved.rating : 7.5,
          goals: saved?.goals || 0,
          assists: saved?.assists || 0
        };
      });

      setPlayerPerformances(perfMap);
    } else {
      setForm({
        home_team: '',
        away_team: '',
        match_date: '',
        match_time: '',
        venue: stadiums[0]?.name || 'Campnow',
        status: 'Upcoming',
        home_score: 0,
        away_score: 0
      });

      const perfMap = {};
      playersList.forEach(player => {
        const pid = player._id || player.id;
        perfMap[pid] = {
          player_id: pid,
          player_name: player.full_name,
          jersey_number: player.jersey_number,
          position: player.position,
          rating: 7.5,
          goals: 0,
          assists: 0
        };
      });
      setPlayerPerformances(perfMap);
    }
  }, [fixtureToEdit, isOpen, playersList]);

  const handleRatingChange = (playerId, value) => {
    let num = parseFloat(value);
    if (isNaN(num)) num = 7.0;
    num = Math.min(10, Math.max(0, num));
    setPlayerPerformances(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], rating: parseFloat(num.toFixed(1)) }
    }));
  };

  const handleGoalsChange = (playerId, delta) => {
    setPlayerPerformances(prev => {
      const current = prev[playerId]?.goals || 0;
      const nextGoals = Math.max(0, current + delta);
      return {
        ...prev,
        [playerId]: { ...prev[playerId], goals: nextGoals }
      };
    });
  };

  const handleAssistsChange = (playerId, delta) => {
    setPlayerPerformances(prev => {
      const current = prev[playerId]?.assists || 0;
      const nextAssists = Math.max(0, current + delta);
      return {
        ...prev,
        [playerId]: { ...prev[playerId], assists: nextAssists }
      };
    });
  };

  const homeTeam = teams.find(t => t._id === form.home_team);
  const awayTeam = teams.find(t => t._id === form.away_team);

  const isClubVerseMatch = Boolean(
    (homeTeam?.short_name?.toUpperCase() === 'CVFC' || (homeTeam?.name || '').toLowerCase().includes('clubverse')) ||
    (awayTeam?.short_name?.toUpperCase() === 'CVFC' || (awayTeam?.name || '').toLowerCase().includes('clubverse'))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.home_team || !form.away_team || !form.match_date || !form.match_time) return;
    if (form.home_team === form.away_team) {
      alert('Home and away teams must be different.');
      return;
    }

    const perfsArray = isClubVerseMatch ? Object.values(playerPerformances).map(p => ({
      player_id: p.player_id,
      player_name: p.player_name,
      jersey_number: p.jersey_number,
      position: p.position,
      rating: p.rating,
      goals: p.goals,
      assists: p.assists
    })) : [];

    onSave({
      ...(fixtureToEdit ? { _id: fixtureToEdit._id } : {}),
      ...form,
      home_score: Number(form.home_score || 0),
      away_score: Number(form.away_score || 0),
      player_performances: perfsArray,
      match_time: formatTimeTo12Hour(form.match_time)
    });
  };

  const filteredPlayers = playersList.filter(p => 
    (p.full_name || '').toLowerCase().includes(playerSearch.toLowerCase()) ||
    (p.position || '').toLowerCase().includes(playerSearch.toLowerCase())
  );

  const goalScorersList = Object.values(playerPerformances).filter(p => p.goals > 0);
  const assistProvidersList = Object.values(playerPerformances).filter(p => p.assists > 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md font-sans overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-warm-xl relative overflow-hidden my-6 max-h-[90vh] flex flex-col"
        >
          {/* Decorative Top Banner */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#20221F] to-[#2E332B] opacity-10 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] bg-white/80 backdrop-blur-md rounded-full border border-[#E4E1D8] shadow-warm-xs transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6 relative z-10 pt-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#20221F] to-[#2E332B] text-[#BEF264] flex items-center justify-center shadow-warm-md border border-[#BEF264]/30">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Matchday Management
                </span>
              </div>
              <h3 className="font-serif font-black text-2xl text-[#20221F] mt-0.5">
                {fixtureToEdit ? 'Edit Match & Player Ratings' : 'Schedule New Match'}
              </h3>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10 overflow-y-auto pr-1 flex-1">
            
            {/* Teams Selection Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7A8B5A]" />
                  <span>Home Team *</span>
                </label>
                <select
                  value={form.home_team}
                  onChange={(e) => setForm(f => ({ ...f, home_team: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all text-[#20221F]"
                >
                  <option value="">Select Home Club</option>
                  {teams.map(t => (
                    <option key={t._id} value={t._id} disabled={t._id === form.away_team}>
                      {t.name} ({t.short_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#B08D57]" />
                  <span>Away Team *</span>
                </label>
                <select
                  value={form.away_team}
                  onChange={(e) => setForm(f => ({ ...f, away_team: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all text-[#20221F]"
                >
                  <option value="">Select Away Club</option>
                  {teams.map(t => (
                    <option key={t._id} value={t._id} disabled={t._id === form.home_team}>
                      {t.name} ({t.short_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Time & Venue Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5">
                  <Calendar className="inline w-3.5 h-3.5 mr-1 text-[#7A8B5A]" /> Match Date *
                </label>
                <input
                  type="date"
                  value={form.match_date}
                  onChange={(e) => setForm(f => ({ ...f, match_date: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5">
                  <Clock className="inline w-3.5 h-3.5 mr-1 text-[#3B82F6]" /> Kick-off Time *
                </label>
                <input
                  type="time"
                  value={form.match_time}
                  onChange={(e) => setForm(f => ({ ...f, match_time: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1 text-[#B08D57]" /> Stadium Venue *
                </label>
                <select
                  value={form.venue}
                  onChange={(e) => setForm(f => ({ ...f, venue: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all text-[#20221F]"
                >
                  {stadiums.length > 0 ? (
                    stadiums.map(s => (
                      <option key={s._id || s.name} value={s.name}>
                        {s.name} ({s.location || 'Stadium'})
                      </option>
                    ))
                  ) : (
                    <option value="Campnow Arena">Campnow Arena (Hybrid Grass)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Score & Match Status (When editing) */}
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#20221F] tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#7A8B5A]" />
                  Match Scoreboard & Status
                </span>
                {fixtureToEdit && (
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E4E1D8] text-xs font-bold text-[#20221F] focus:outline-none"
                  >
                    {['Upcoming', 'Live', 'Completed', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="bg-white p-3 rounded-xl border border-[#E4E1D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20221F]">Home Goals ({homeTeam?.short_name || 'HOME'})</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={form.home_score}
                    onChange={(e) => setForm(f => ({ ...f, home_score: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-16 px-2 py-1 text-center font-black font-mono text-lg rounded-lg bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] focus:outline-none"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E4E1D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20221F]">Away Goals ({awayTeam?.short_name || 'AWAY'})</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={form.away_score}
                    onChange={(e) => setForm(f => ({ ...f, away_score: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-16 px-2 py-1 text-center font-black font-mono text-lg rounded-lg bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] focus:outline-none"
                  />
                </div>
              </div>
            </div>            {/* ClubVerse Player Ratings & Key Contributions Section */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E1D8] pb-3">
                <div>
                  <h4 className="font-serif font-black text-lg text-[#20221F] flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    ClubVerse Player Ratings & Match Stats
                  </h4>
                  <p className="text-xs text-[#6F716B] font-medium">
                    {isClubVerseMatch 
                      ? 'Rate squad players out of 10 and record goal scorers & assist providers'
                      : 'Player rating system is disabled for non-ClubVerse matches'}
                  </p>
                </div>

                {isClubVerseMatch && (
                  /* Player Search Input */
                  <div className="relative sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
                    <input
                      type="text"
                      placeholder="Filter players..."
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#7A8B5A]"
                    />
                  </div>
                )}
              </div>

              {!isClubVerseMatch ? (
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-start sm:items-center gap-3.5 text-xs text-[#6F716B] font-medium shadow-warm-xs">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-warm-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#20221F] text-sm">Rating System Disabled for Third-Party Fixture</div>
                    <div className="mt-0.5 text-[#6F716B] leading-relaxed">
                      This match is between two external clubs (<strong>{homeTeam?.name || 'Home'}</strong> vs <strong>{awayTeam?.name || 'Away'}</strong>). 
                      ClubVerse player ratings out of 10, goal scorers, and assist providers can only be recorded for fixtures featuring <strong>ClubVerse (CVFC)</strong>.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Dynamic Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚽</span>
                        <div>
                          <div className="text-[10px] uppercase font-black tracking-wider text-emerald-800">Goal Scorers</div>
                          <div className="text-xs font-bold text-emerald-950">
                            {goalScorersList.length > 0 
                              ? goalScorersList.map(g => `${g.player_name} (${g.goals})`).join(', ')
                              : 'No goal scorers recorded yet'}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                        {goalScorersList.reduce((acc, curr) => acc + curr.goals, 0)} Goals
                      </span>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🅰️</span>
                        <div>
                          <div className="text-[10px] uppercase font-black tracking-wider text-amber-800">Assist Providers</div>
                          <div className="text-xs font-bold text-amber-950">
                            {assistProvidersList.length > 0 
                              ? assistProvidersList.map(a => `${a.player_name} (${a.assists})`).join(', ')
                              : 'No assist providers recorded yet'}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black">
                        {assistProvidersList.reduce((acc, curr) => acc + curr.assists, 0)} Assists
                      </span>
                    </div>
                  </div>

                  {/* Players Table / List */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {filteredPlayers.map(player => {
                      const pid = player._id || player.id;
                      const perf = playerPerformances[pid] || { rating: 7.5, goals: 0, assists: 0 };

                      const getRatingColor = (r) => {
                        if (r >= 8.5) return 'bg-emerald-600 text-white border-emerald-500';
                        if (r >= 7.0) return 'bg-[#7A8B5A] text-white border-[#7A8B5A]';
                        if (r >= 5.5) return 'bg-amber-500 text-white border-amber-500';
                        return 'bg-rose-500 text-white border-rose-500';
                      };

                      return (
                        <div 
                          key={pid}
                          className="bg-white border border-[#E4E1D8] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-warm-xs hover:border-[#7A8B5A]/40 transition-all"
                        >
                          {/* Player Name & Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#20221F] text-[#BEF264] flex items-center justify-center font-mono font-bold text-xs">
                              #{player.jersey_number || '10'}
                            </div>
                            <div>
                              <div className="text-xs font-black text-[#20221F] font-serif">{player.full_name}</div>
                              <div className="text-[10px] font-semibold text-[#6F716B]">{player.position || 'Player'}</div>
                            </div>
                          </div>

                          {/* Controls Row */}
                          <div className="flex flex-wrap items-center gap-4 justify-between sm:justify-end">
                            
                            {/* Rating Out of 10 Input */}
                            <div className="flex items-center gap-2 bg-[#F7F5EF] px-2.5 py-1.5 rounded-xl border border-[#E4E1D8]">
                              <span className="text-[10px] font-bold text-[#6F716B] uppercase">Rating</span>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={perf.rating ?? 7.5}
                                onChange={(e) => handleRatingChange(pid, e.target.value)}
                                className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-xs rounded-lg bg-white border border-[#E4E1D8] text-[#20221F] focus:outline-none"
                              />
                              <span className="text-[10px] font-bold text-[#6F716B]">/ 10</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getRatingColor(perf.rating)}`}>
                                {perf.rating ?? 7.5}
                              </span>
                            </div>

                            {/* Goal Scorer Counter */}
                            <div className="flex items-center gap-1 bg-[#F7F5EF] px-2 py-1 rounded-xl border border-[#E4E1D8]">
                              <span className="text-[10px] font-bold text-[#20221F] mr-1">⚽ Goal</span>
                              <button
                                type="button"
                                onClick={() => handleGoalsChange(pid, -1)}
                                className="w-5 h-5 rounded-md bg-white border border-[#E4E1D8] text-[#20221F] font-bold text-xs flex items-center justify-center hover:bg-[#E4E1D8]"
                              >
                                -
                              </button>
                              <span className={`w-6 text-center font-mono font-black text-xs ${perf.goals > 0 ? 'text-emerald-700 font-extrabold' : 'text-[#20221F]'}`}>
                                {perf.goals}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleGoalsChange(pid, 1)}
                                className="w-5 h-5 rounded-md bg-[#20221F] text-white font-bold text-xs flex items-center justify-center hover:bg-[#7A8B5A]"
                              >
                                +
                              </button>
                            </div>

                            {/* Assist Provider Counter */}
                            <div className="flex items-center gap-1 bg-[#F7F5EF] px-2 py-1 rounded-xl border border-[#E4E1D8]">
                              <span className="text-[10px] font-bold text-[#20221F] mr-1">🅰️ Assist</span>
                              <button
                                type="button"
                                onClick={() => handleAssistsChange(pid, -1)}
                                className="w-5 h-5 rounded-md bg-white border border-[#E4E1D8] text-[#20221F] font-bold text-xs flex items-center justify-center hover:bg-[#E4E1D8]"
                              >
                                -
                              </button>
                              <span className={`w-6 text-center font-mono font-black text-xs ${perf.assists > 0 ? 'text-amber-700 font-extrabold' : 'text-[#20221F]'}`}>
                                {perf.assists}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAssistsChange(pid, 1)}
                                className="w-5 h-5 rounded-md bg-[#20221F] text-white font-bold text-xs flex items-center justify-center hover:bg-[#B08D57]"
                              >
                                +
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Live Matchup Preview Card */}
            {homeTeam && awayTeam && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white flex items-center justify-between border border-[#E4E1D8]/20 shadow-warm-sm">
                <div className="flex items-center gap-3">
                  <img 
                    src={getTeamLogo(homeTeam)} 
                    alt={homeTeam.name} 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md" 
                  />
                  <div>
                    <div className="text-white text-xs font-bold font-serif">{homeTeam.name}</div>
                    <div className="text-[10px] text-[#7A8B5A] font-extrabold uppercase">Home ({form.home_score})</div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[#BEF264] font-serif font-black text-lg px-2">
                    {form.home_score} - {form.away_score}
                  </span>
                  <div className="text-[9px] text-[#BEF264]/80 font-bold uppercase tracking-wider">{form.status}</div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-white text-xs font-bold font-serif">{awayTeam.name}</div>
                    <div className="text-[10px] text-[#B08D57] font-extrabold uppercase">Away ({form.away_score})</div>
                  </div>
                  <img 
                    src={getTeamLogo(awayTeam)} 
                    alt={awayTeam.name} 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md" 
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white font-bold text-xs shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#BEF264]" />
              <span>{fixtureToEdit ? 'Save Match Details & Player Ratings' : 'Confirm Match Schedule'}</span>
            </motion.button>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
