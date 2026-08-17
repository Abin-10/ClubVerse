import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Plus, Pencil, Trash2, AlertTriangle, 
  Search, RefreshCw, Users, Trophy, Flag, 
  Sparkles, CheckCircle2, Building, Eye, ChevronRight, X, Image as ImageIcon
} from 'lucide-react';
import TeamModal from './TeamModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const API = 'http://localhost:5000/api';

export default function TeamManagementView({ triggerToast }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'home' | 'rivals'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, itemType: 'Team', itemName: '', itemToDelete: null });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/teams`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (err) {
      console.warn('Failed to fetch teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleSave = async (data) => {
    try {
      const isEdit = Boolean(data._id);
      const url = isEdit ? `${API}/teams/${data._id}` : `${API}/teams`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setIsModalOpen(false);
      triggerToast(result.message || (isEdit ? 'Team updated successfully!' : 'Team created successfully!'));
      fetchTeams();
    } catch (err) {
      alert(err.message || 'Failed to save team.');
    }
  };

  const handleDelete = async () => {
    const { itemToDelete } = deleteConfig;
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API}/teams/${itemToDelete._id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setDeleteConfig({ isOpen: false, itemType: 'Team', itemName: '', itemToDelete: null });
      triggerToast(`${itemToDelete.name} removed permanently.`);
      fetchTeams();
    } catch (err) {
      alert(err.message || 'Failed to delete team.');
    }
  };

  const filtered = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.short_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'home') {
      return matchesSearch && (t.short_name === 'CVFC' || t.name.toLowerCase().includes('clubverse'));
    }
    if (filterCategory === 'rivals') {
      return matchesSearch && (t.short_name !== 'CVFC' && !t.name.toLowerCase().includes('clubverse'));
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans text-[#20221F]">
      
      {/* ── TOP KPI & REGISTRY BANNER ── */}
      <div className="bg-gradient-to-br from-[#FFFDF8] via-[#F7F5EF] to-[#EFECE1] border border-[#E4E1D8] rounded-[2.5rem] p-6 lg:p-8 shadow-warm-md relative overflow-hidden">
        {/* Subtle decorative glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7A8B5A]/15 via-[#B08D57]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-warm-xs">
                <Sparkles className="w-3 h-3 text-[#BEF264]" />
                Official Club Registry
              </span>
              <span className="text-xs text-[#7A8B5A] font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8B5A]" />
                UEFA Certified
              </span>
            </div>
            
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#20221F] tracking-tight">
              Team Management
            </h1>
            <p className="text-xs sm:text-sm text-[#6F716B] leading-relaxed">
              Configure registered clubs, official team logos, kit color identities, and squad size limits (24 Players Max per club) for the ClubVerse League.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Clubs</span>
                <Shield className="w-4 h-4 text-[#7A8B5A]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-serif text-[#20221F]">{teams.length} <span className="text-xs font-normal text-[#6F716B]">/ 10</span></div>
                <div className="w-full bg-[#EFEEE8] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#7A8B5A] h-full rounded-full transition-all duration-500" style={{ width: `${(teams.length / 10) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Squad Limit</span>
                <Users className="w-4 h-4 text-[#B08D57]" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-serif text-[#20221F]">24 Players</div>
                <span className="text-[10px] text-[#7A8B5A] font-bold">Per Team Roster</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-xs flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#6F716B] uppercase tracking-wider">Home Pitch</span>
                <Building className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-black font-serif text-[#20221F]">Campnow Arena</div>
                <span className="text-[10px] text-[#6F716B] font-medium">250 Seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 10-TEAM LIMIT WARNING BANNER ── */}
      {teams.length >= 8 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold shadow-warm-xs ${
            teams.length >= 10
              ? 'bg-red-50/90 border-red-200 text-red-800'
              : 'bg-amber-50/90 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              {teams.length >= 10
                ? 'Maximum limit of 10 registered teams reached. Delete a club to register a new team.'
                : `League Registration Limit Notice: Only ${10 - teams.length} team slot(s) remaining.`
              }
            </span>
          </div>
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-white border border-current">
            {teams.length} / 10 Slots
          </span>
        </motion.div>
      )}

      {/* ── TOOLBAR CONTROLS BAR ── */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl p-4 shadow-warm-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left Side: Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Teams', count: teams.length },
            { id: 'home', label: 'Home Club', count: teams.filter(t => t.short_name === 'CVFC' || t.name.toLowerCase().includes('clubverse')).length },
            { id: 'rivals', label: 'Opponents', count: teams.filter(t => t.short_name !== 'CVFC' && !t.name.toLowerCase().includes('clubverse')).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                filterCategory === tab.id
                  ? 'bg-[#20221F] text-white shadow-warm-xs'
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] border border-[#E4E1D8]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                filterCategory === tab.id ? 'bg-white/20 text-white' : 'bg-[#E4E1D8] text-[#20221F]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Side: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F716B]" />
            <input
              type="text"
              placeholder="Search team name or code..."
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

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchTeams}
            className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] transition-all"
            title="Refresh Teams"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#7A8B5A]' : ''}`} />
          </motion.button>

          {/* Add Team CTA Button */}
          <motion.button
            whileHover={{ scale: teams.length >= 10 ? 1 : 1.03 }}
            whileTap={{ scale: teams.length >= 10 ? 1 : 0.97 }}
            onClick={() => { setTeamToEdit(null); setIsModalOpen(true); }}
            disabled={teams.length >= 10}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-warm-sm transition-all whitespace-nowrap ${
              teams.length >= 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400/50'
                : 'bg-gradient-to-r from-[#20221F] to-[#2E332B] text-[#FFFDF8] hover:shadow-warm-md hover:border-[#7A8B5A]/50 border border-transparent'
            }`}
          >
            <Plus className="w-4 h-4 text-[#BEF264]" />
            <span>Add Team</span>
          </motion.button>
        </div>

      </div>

      {/* ── TEAMS GRID SECTION ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] bg-[#FFFDF8] border border-[#E4E1D8] animate-pulse space-y-4">
              <div className="h-20 bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-warm-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-center text-[#6F716B]">
            <Shield className="w-8 h-8 opacity-50" />
          </div>
          <div>
            <h3 className="font-serif font-black text-xl text-[#20221F]">No Teams Found</h3>
            <p className="text-xs text-[#6F716B] mt-1 max-w-sm">
              {searchQuery ? `No registered teams match "${searchQuery}". Try clearing your search filter.` : 'No clubs registered yet in the database. Click "Add Team" to register your first club!'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold text-[#20221F] hover:bg-[#EFEEE8]"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((team, i) => {
              const isHomeClub = team.short_name === 'CVFC' || team.name.toLowerCase().includes('clubverse');
              return (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.25rem] shadow-warm-sm hover:shadow-warm-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                >
                  {/* Decorative Color Banner Header */}
                  <div 
                    className="h-20 w-full relative overflow-hidden flex items-center justify-between px-5 pt-3"
                    style={{
                      background: `linear-gradient(135deg, ${team.logo_color || '#3B82F6'} 0%, #20221F 120%)`
                    }}
                  >
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
                    
                    {/* Badge Pill */}
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/20 z-10">
                      {isHomeClub ? '⭐ Main Club' : 'Opponent'}
                    </span>

                    {/* Color Swatch Pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-mono font-bold text-white z-10">
                      <div className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: team.logo_color }} />
                      <span>{team.logo_color}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 pt-0 space-y-4 relative flex-1 flex flex-col justify-between">
                    
                    {/* Crest Badge Floating Over Banner */}
                    <div className="-mt-9 flex items-end justify-between">
                      <motion.div 
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-warm-md border-4 border-[#FFFDF8] bg-white relative z-10"
                      >
                        <img 
                          src={
                            team.logo_url || (
                              team.short_name === 'CVFC' ? 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' :
                              team.short_name === 'MCY' ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80' :
                              team.short_name === 'RMA' ? 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80' :
                              team.short_name === 'BAR' ? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80' :
                              'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80'
                            )
                          } 
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      <span className="px-3 py-1 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-black font-mono text-[#20221F]">
                        {team.short_name}
                      </span>
                    </div>

                    {/* Team Title */}
                    <div>
                      <h3 className="font-serif font-black text-xl text-[#20221F] truncate group-hover:text-[#7A8B5A] transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-[11px] text-[#6F716B] font-medium flex items-center gap-1 mt-0.5">
                        <span>UEFA League Member</span>
                      </p>
                    </div>

                    {/* Squad Details Card - Total Squad 24 */}
                    <div className="bg-[#F7F5EF] p-3 rounded-2xl border border-[#E4E1D8] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6F716B] font-medium flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#7A8B5A]" />
                          Total Squad
                        </span>
                        <span className="font-extrabold text-[#20221F] px-2 py-0.5 rounded-md bg-white border border-[#E4E1D8]">
                          24 Players
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E4E1D8]/60 pt-1.5">
                        <span className="text-[#6F716B] font-medium flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#B08D57]" />
                          Home Arena
                        </span>
                        <span className="font-bold text-[#20221F]">Campnow</span>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#E4E1D8]/60">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setTeamToEdit(team); setIsModalOpen(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all shadow-warm-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfig({ isOpen: true, itemType: 'Team', itemName: team.name, itemToDelete: team })}
                        className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── MODALS ── */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        teamToEdit={teamToEdit}
      />
      <DeleteConfirmModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ isOpen: false, itemType: 'Team', itemName: '', itemToDelete: null })}
        onConfirm={handleDelete}
        itemType={deleteConfig.itemType}
        itemName={deleteConfig.itemName}
      />
    </div>
  );
}
