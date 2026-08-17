import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Pencil, Trash2, Search, 
  RefreshCw, MapPin, Clock, Swords, Trophy, 
  Sparkles, CheckCircle2, Shield, AlertTriangle, X
} from 'lucide-react';
import FixtureModal from './FixtureModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { formatTimeTo12Hour } from '../../utils/teamUtils';

const API = 'http://localhost:5000/api';

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

export default function FixtureManagementView({ triggerToast }) {
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Upcoming' | 'Live' | 'Completed'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fixtureToEdit, setFixtureToEdit] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, itemType: 'Fixture', itemName: '', itemToDelete: null });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, tRes] = await Promise.all([
        fetch(`${API}/fixtures`),
        fetch(`${API}/teams`)
      ]);
      if (fRes.ok) setFixtures(await fRes.json());
      if (tRes.ok) setTeams(await tRes.json());
    } catch (err) {
      console.warn('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data) => {
    try {
      const isEdit = Boolean(data._id);
      const url = isEdit ? `${API}/fixtures/${data._id}` : `${API}/fixtures`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setIsModalOpen(false);
      triggerToast(result.message || 'Fixture saved successfully!');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to save fixture.');
    }
  };

  const handleDelete = async () => {
    const { itemToDelete } = deleteConfig;
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API}/fixtures/${itemToDelete._id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setDeleteConfig({ isOpen: false, itemType: 'Fixture', itemName: '', itemToDelete: null });
      triggerToast('Fixture deleted permanently.');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete fixture.');
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (s) => {
    if (s === 'Live') {
      return (
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          Live Now
        </span>
      );
    }
    if (s === 'Completed') {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Full Time
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
        <Clock className="w-3 h-3 text-blue-600" />
        Upcoming
      </span>
    );
  };

  const filtered = fixtures.filter(f => {
    const q = searchQuery.toLowerCase();
    const homeName = f.home_team?.name?.toLowerCase() || '';
    const awayName = f.away_team?.name?.toLowerCase() || '';
    const matchesQuery = homeName.includes(q) || awayName.includes(q) || (f.venue || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const upcomingCount = fixtures.filter(f => f.status === 'Upcoming').length;
  const liveCount = fixtures.filter(f => f.status === 'Live').length;

  return (
    <div className="space-y-8 font-sans text-[#20221F]">
      
      {/* ── TOP KPI & MATCH SCHEDULER BANNER ── */}
      <div className="bg-gradient-to-br from-[#FFFDF8] via-[#F7F5EF] to-[#EFECE1] border border-[#E4E1D8] rounded-[2.5rem] p-6 lg:p-8 shadow-warm-md relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#3B82F6]/10 via-[#7A8B5A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-warm-xs">
                <Sparkles className="w-3 h-3 text-[#BEF264]" />
                Official Matchday Hub
              </span>
              <span className="text-xs text-[#7A8B5A] font-extrabold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[#B08D57]" />
                Premier Division
              </span>
            </div>
            
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#20221F] tracking-tight">
              Fixture & Match Scheduler
            </h1>
            <p className="text-xs sm:text-sm text-[#6F716B] leading-relaxed">
              Schedule marquee clashes, manage kickoff times, assign stadium venues, and broadcast live matchday statistics.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Scheduled</span>
                <Calendar className="w-4 h-4 text-[#7A8B5A]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-serif text-[#20221F]">{fixtures.length} <span className="text-xs font-normal text-[#6F716B]">Matches</span></div>
                <span className="text-[10px] text-[#7A8B5A] font-bold">2026 Season</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Upcoming</span>
                <Clock className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-serif text-[#20221F]">{upcomingCount} <span className="text-xs font-normal text-[#6F716B]">Pending</span></div>
                <span className="text-[10px] text-[#3B82F6] font-bold">Ticket Sales Active</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Arena Venue</span>
                <MapPin className="w-4 h-4 text-[#B08D57]" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-black font-serif text-[#20221F]">Campnow Arena</div>
                <span className="text-[10px] text-[#6F716B] font-medium">Hybrid Grass</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MINIMUM TEAM REQUIREMENT NOTICE ── */}
      {teams.length < 2 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-amber-50 border-amber-200 text-amber-800 text-xs font-bold shadow-warm-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>You need at least 2 registered teams in the database before creating match fixtures. Please go to the Teams tab to add clubs first.</span>
        </div>
      )}

      {/* ── TOOLBAR CONTROLS BAR ── */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl p-4 shadow-warm-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Fixtures', count: fixtures.length },
            { id: 'Upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'Live', label: 'Live Now', count: liveCount },
            { id: 'Completed', label: 'Full Time', count: fixtures.filter(f => f.status === 'Completed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-[#20221F] text-white shadow-warm-xs'
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] border border-[#E4E1D8]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-[#E4E1D8] text-[#20221F]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F716B]" />
            <input
              type="text"
              placeholder="Search teams or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] transition-all"
            title="Refresh Fixtures"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#7A8B5A]' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: teams.length < 2 ? 1 : 1.03 }}
            whileTap={{ scale: teams.length < 2 ? 1 : 0.97 }}
            onClick={() => { setFixtureToEdit(null); setIsModalOpen(true); }}
            disabled={teams.length < 2}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-warm-sm transition-all whitespace-nowrap ${
              teams.length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400/50'
                : 'bg-gradient-to-r from-[#20221F] to-[#2E332B] text-[#FFFDF8] hover:shadow-warm-md hover:border-[#7A8B5A]/50 border border-transparent'
            }`}
          >
            <Plus className="w-4 h-4 text-[#BEF264]" />
            <span>Add Fixture</span>
          </motion.button>
        </div>

      </div>

      {/* ── FIXTURES MATCHES CARDS SECTION ── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-6 rounded-[2.5rem] bg-[#FFFDF8] border border-[#E4E1D8] animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-warm-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-center text-[#6F716B]">
            <Swords className="w-8 h-8 opacity-50" />
          </div>
          <div>
            <h3 className="font-serif font-black text-xl text-[#20221F]">No Match Fixtures Found</h3>
            <p className="text-xs text-[#6F716B] mt-1 max-w-sm">
              {searchQuery ? `No scheduled fixtures match "${searchQuery}".` : 'No upcoming fixtures created yet. Click "Add Fixture" to schedule a match!'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold text-[#20221F] hover:bg-[#EFEEE8]"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filtered.map((fix, i) => {
              const homeLogo = getTeamLogo(fix.home_team);
              const awayLogo = getTeamLogo(fix.away_team);

              return (
                <motion.div
                  key={fix._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 lg:p-7 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 relative overflow-hidden group space-y-5"
                >
                  {/* Subtle Background Match Banner Gradient */}
                  <div 
                    className="absolute inset-0 opacity-[0.04] pointer-events-none transition-opacity group-hover:opacity-[0.08]"
                    style={{
                      background: `linear-gradient(90deg, ${fix.home_team?.logo_color || '#3B82F6'} 0%, transparent 50%, ${fix.away_team?.logo_color || '#EF4444'} 100%)`
                    }}
                  />

                  {/* Top Match Bar Header */}
                  <div className="flex items-center justify-between z-10 relative border-b border-[#E4E1D8]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#20221F] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-[#BEF264]" />
                        Matchday {i + 1}
                      </span>
                      <span className="text-xs text-[#6F716B] font-bold hidden sm:inline">
                        Premier League Derby
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(fix.status)}
                    </div>
                  </div>

                  {/* Scoreboard Arena Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6 z-10 relative py-2">
                    
                    {/* Home Team (Left Side) */}
                    <div className="md:col-span-4 flex items-center gap-4 justify-start group-hover:translate-x-1 transition-transform">
                      <div className="relative">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 border-white shadow-warm-md flex items-center justify-center bg-white flex-shrink-0 relative z-10"
                          style={{ boxShadow: `0 8px 24px ${fix.home_team?.logo_color || '#3B82F6'}25` }}
                        >
                          <img 
                            src={homeLogo} 
                            alt={fix.home_team?.name || 'Home Team'} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <span 
                          className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm border border-white z-20"
                          style={{ backgroundColor: fix.home_team?.logo_color || '#3B82F6' }}
                        >
                          {fix.home_team?.short_name || 'HOME'}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-[#7A8B5A] uppercase tracking-wider block">Home Team</span>
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-[#20221F] truncate mt-0.5">
                          {fix.home_team?.name || 'Home Team'}
                        </h3>
                        <span className="text-xs text-[#6F716B] font-mono font-bold">
                          Code: {fix.home_team?.short_name || 'HOME'}
                        </span>
                      </div>
                    </div>

                    {/* VS Central Score Pillar */}
                    <div className="md:col-span-3 flex flex-col items-center justify-center text-center space-y-1">
                      {fix.status === 'Completed' || fix.status === 'Live' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl sm:text-4xl font-serif font-black text-[#20221F]">
                            {fix.home_score ?? 0}
                          </span>
                          <span className="text-lg font-black text-[#6F716B] font-mono">:</span>
                          <span className="text-3xl sm:text-4xl font-serif font-black text-[#20221F]">
                            {fix.away_score ?? 0}
                          </span>
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#20221F] to-[#2E332B] text-[#BEF264] flex items-center justify-center font-serif font-black text-base shadow-warm-md border-2 border-white">
                            VS
                          </div>
                          <span className="text-[10px] font-extrabold text-[#6F716B] mt-1.5 uppercase tracking-wider">
                            Kickoff
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team (Right Side) */}
                    <div className="md:col-span-4 flex items-center gap-4 justify-end text-right group-hover:-translate-x-1 transition-transform">
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-[#B08D57] uppercase tracking-wider block">Away Team</span>
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-[#20221F] truncate mt-0.5">
                          {fix.away_team?.name || 'Away Team'}
                        </h3>
                        <span className="text-xs text-[#6F716B] font-mono font-bold">
                          Code: {fix.away_team?.short_name || 'AWAY'}
                        </span>
                      </div>

                      <div className="relative">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 border-white shadow-warm-md flex items-center justify-center bg-white flex-shrink-0 relative z-10"
                          style={{ boxShadow: `0 8px 24px ${fix.away_team?.logo_color || '#EF4444'}25` }}
                        >
                          <img 
                            src={awayLogo} 
                            alt={fix.away_team?.name || 'Away Team'} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <span 
                          className="absolute -bottom-1 -left-1 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm border border-white z-20"
                          style={{ backgroundColor: fix.away_team?.logo_color || '#EF4444' }}
                        >
                          {fix.away_team?.short_name || 'AWAY'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Match Details Footer Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E4E1D8]/60 text-xs font-medium z-10 relative">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#E4E1D8] font-bold text-[#20221F]">
                        <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
                        <span>{formatDate(fix.match_date)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#E4E1D8] font-bold text-[#20221F]">
                        <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{formatTimeTo12Hour(fix.match_time)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#E4E1D8] font-bold text-[#20221F]">
                        <MapPin className="w-3.5 h-3.5 text-[#B08D57]" />
                        <span>{fix.venue || 'Campnow Arena'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setFixtureToEdit(fix); setIsModalOpen(true); }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all flex items-center gap-1.5 shadow-warm-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Fixture</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const label = `${fix.home_team?.name || '?'} vs ${fix.away_team?.name || '?'}`;
                          setDeleteConfig({ isOpen: true, itemType: 'Fixture', itemName: label, itemToDelete: fix });
                        }}
                        className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete Fixture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <FixtureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        fixtureToEdit={fixtureToEdit}
        teams={teams}
      />
      <DeleteConfirmModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ isOpen: false, itemType: 'Fixture', itemName: '', itemToDelete: null })}
        onConfirm={handleDelete}
        itemType={deleteConfig.itemType}
        itemName={deleteConfig.itemName}
      />
    </div>
  );
}
