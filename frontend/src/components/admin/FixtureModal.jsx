import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Swords, Sparkles, Trophy } from 'lucide-react';

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
  const [form, setForm] = useState({
    home_team: '',
    away_team: '',
    match_date: '',
    match_time: '',
    venue: 'Campnow',
    status: 'Upcoming'
  });

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stadiums');
        if (res.ok) {
          const data = await res.json();
          if (data.stadiums && data.stadiums.length > 0) {
            setStadiums(data.stadiums);
            if (!fixtureToEdit) {
              setForm(f => ({ ...f, venue: data.stadiums[0].name }));
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch stadiums for fixture modal:', err);
      }
    };
    if (isOpen) fetchStadiums();
  }, [isOpen, fixtureToEdit]);

  useEffect(() => {
    if (fixtureToEdit) {
      setForm({
        home_team: fixtureToEdit.home_team?._id || fixtureToEdit.home_team || '',
        away_team: fixtureToEdit.away_team?._id || fixtureToEdit.away_team || '',
        match_date: fixtureToEdit.match_date ? new Date(fixtureToEdit.match_date).toISOString().split('T')[0] : '',
        match_time: fixtureToEdit.match_time || '',
        venue: fixtureToEdit.venue || (stadiums[0]?.name || 'Campnow'),
        status: fixtureToEdit.status || 'Upcoming'
      });
    } else {
      setForm({
        home_team: '',
        away_team: '',
        match_date: '',
        match_time: '',
        venue: stadiums[0]?.name || 'Campnow',
        status: 'Upcoming'
      });
    }
  }, [fixtureToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.home_team || !form.away_team || !form.match_date || !form.match_time) return;
    if (form.home_team === form.away_team) {
      alert('Home and away teams must be different.');
      return;
    }
    onSave({
      ...(fixtureToEdit ? { _id: fixtureToEdit._id } : {}),
      ...form
    });
  };

  const homeTeam = teams.find(t => t._id === form.home_team);
  const awayTeam = teams.find(t => t._id === form.away_team);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-warm-xl relative overflow-hidden my-8"
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
          <div className="flex items-center gap-3.5 mb-6 relative z-10 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#20221F] to-[#2E332B] text-[#BEF264] flex items-center justify-center shadow-warm-md border border-[#BEF264]/30">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Matchday Scheduler
                </span>
              </div>
              <h3 className="font-serif font-black text-2xl text-[#20221F] mt-0.5">
                {fixtureToEdit ? 'Edit Match Details' : 'Schedule New Match'}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Teams Selection Row */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Stadium Venue */}
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

            {/* Status Selector (Only when editing) */}
            {fixtureToEdit && (
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1.5">Match Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all text-[#20221F]"
                >
                  {['Upcoming', 'Live', 'Completed', 'Cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

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
                    <div className="text-[10px] text-[#7A8B5A] font-extrabold uppercase">Home</div>
                  </div>
                </div>

                <span className="text-[#BEF264] font-serif font-black text-base px-2">VS</span>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-white text-xs font-bold font-serif">{awayTeam.name}</div>
                    <div className="text-[10px] text-[#B08D57] font-extrabold uppercase">Away</div>
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
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white font-bold text-xs shadow-warm-md hover:shadow-warm-lg transition-all"
            >
              {fixtureToEdit ? 'Save Match Details' : 'Confirm Match Schedule'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
