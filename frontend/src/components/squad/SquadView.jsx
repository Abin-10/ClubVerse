import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Users, Trophy, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';
import PlayerCard from './PlayerCard';
import PlayerProfileModal from './PlayerProfileModal';

export default function SquadView() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [inspectingPlayer, setInspectingPlayer] = useState(null);

  // Fetch teams & players from DB
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, playersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/teams` ),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/players` )
      ]);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData || []);
      }

      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData || []);
      }
    } catch (err) {
      console.warn('Error fetching squad data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter players based on search & team selection
  const safePlayers = Array.isArray(players) ? players : [];
  const safeTeams = Array.isArray(teams) ? teams : [];

  const filteredPlayers = safePlayers.filter(p => {
    if (!p) return false;
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch = (p.full_name || '').toLowerCase().includes(searchLower) ||
                          (p.position || '').toLowerCase().includes(searchLower);
    
    if (selectedTeamFilter === 'All') return matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white p-6 sm:p-8 rounded-3xl shadow-warm-lg flex flex-wrap items-center justify-between gap-6 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#BEF264]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BEF264]/20 text-[#BEF264] text-xs font-black border border-[#BEF264]/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>ClubVerse Squad Roster 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Club Teams & Star Players
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A19A] max-w-xl">
            Explore official squad players, click <span className="text-[#BEF264] font-bold">Flip Card 🔄</span> to reveal player attributes, or inspect full match profiles.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-xl font-black text-[#BEF264] font-serif">{teams.length}</div>
            <div className="text-[10px] text-[#A1A19A] font-extrabold uppercase">Teams</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-xl font-black text-white font-serif">{players.length}</div>
            <div className="text-[10px] text-[#A1A19A] font-extrabold uppercase">Players</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FFFDF8] p-4 rounded-3xl border border-[#E4E1D8] shadow-warm-sm">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F716B]" />
          <input 
            type="text"
            placeholder="Search players by name, position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] placeholder-[#6F716B] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
          />
        </div>

        {/* Refresh & Team Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button 
            onClick={fetchData}
            className="p-2.5 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] transition-all"
            title="Refresh Squad Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {['All', 'ClubVerse FC', 'First Team'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedTeamFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedTeamFilter === filter 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'bg-[#F7F5EF] text-[#6F716B] border border-[#E4E1D8] hover:text-[#20221F]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Players Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-[#6F716B] font-bold text-sm">
          Loading club roster from MongoDB...
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="py-16 text-center bg-[#FFFDF8] rounded-3xl border border-[#E4E1D8] space-y-2">
          <Shield className="w-10 h-10 text-[#7A8B5A] mx-auto opacity-60" />
          <h4 className="font-bold text-[#20221F]">No Players Found</h4>
          <p className="text-xs text-[#6F716B]">Try adjusting your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard 
              key={player._id || player.id} 
              player={player} 
              onInspect={(p) => setInspectingPlayer(p)}
            />
          ))}
        </div>
      )}

      {/* Full Player Profile Modal */}
      {inspectingPlayer && (
        <PlayerProfileModal 
          player={inspectingPlayer} 
          onClose={() => setInspectingPlayer(null)} 
        />
      )}
    </div>
  );
}
