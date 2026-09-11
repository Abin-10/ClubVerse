import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle, 
  Search, 
  UserX,
  Users,
  Loader2,
  RefreshCw
} from 'lucide-react';
import CreateTrainingModal from './CreateTrainingModal';

export default function CoachTrainingView({ 
  players = [],
  searchQuery = '', 
  isCreateModalOpen, 
  setIsCreateModalOpen,
  triggerToast 
}) {
  const [dbPlayers, setDbPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'High-Press & Tactical Counter-Attack',
      date: 'Tomorrow, Aug 8',
      time: '09:30 AM - 11:30 AM',
      pitch: 'Pitch 1 (First Team Ground)',
      coach: 'Head Coach',
      type: 'Tactical',
      intensity: 'High Intensity',
      drills: 'Overload buildup, 4v3 transition, set-piece positioning.'
    },
    {
      id: 2,
      title: 'Recovery & Mobility Hydrotherapy',
      date: 'Friday, Aug 10',
      time: '10:00 AM - 11:15 AM',
      pitch: 'Gym & Hydrotherapy Pool',
      coach: 'Head Coach',
      type: 'Recovery',
      intensity: 'Low Intensity',
      drills: 'Cryotherapy, light core activation, mobility work.'
    }
  ]);

  const [playerAttendance, setPlayerAttendance] = useState({});

  // Fetch players directly from API if prop is empty
  const fetchPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const res = await fetch('http://localhost:5000/api/players');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbPlayers(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch DB players for training view:', err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(players) && players.length > 0) {
      setDbPlayers(players);
    } else {
      fetchPlayers();
    }
  }, [players]);

  // Combine DB players or fallback to initial defaults if DB is completely empty
  const squadPlayers = dbPlayers.length > 0 
    ? dbPlayers.map((p, idx) => ({
        id: p._id || `db-${idx}`,
        name: p.full_name || p.name || 'Squad Player',
        pos: p.position || 'First Team',
        jersey: p.jersey_number || idx + 1,
        status: p.status || 'Active'
      }))
    : [
        { id: 'p1', name: 'Bukayo Saka', pos: 'Forward', jersey: 7 },
        { id: 'p2', name: 'Declan Rice', pos: 'Midfielder', jersey: 41 },
        { id: 'p3', name: 'William Saliba', pos: 'Defender', jersey: 2 },
        { id: 'p4', name: 'David Raya', pos: 'Goalkeeper', jersey: 22 },
        { id: 'p5', name: 'Gabriel Martinelli', pos: 'Forward', jersey: 11 },
      ];

  // Filter players based on search query
  const filteredSquadPlayers = squadPlayers.filter(p => {
    const q = (searchQuery || '').toLowerCase();
    return p.name.toLowerCase().includes(q) || p.pos.toLowerCase().includes(q);
  });

  const handleTogglePlayerAttendance = (id, name) => {
    setPlayerAttendance(prev => {
      const current = prev[id] || 'Present';
      const next = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Excused - Physio' : 'Present';
      if (triggerToast) triggerToast(`Attendance for ${name}: ${next}`);
      return { ...prev, [id]: next };
    });
  };

  const handleAddSession = (newSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
              Training Management & Attendance Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider">
              {squadPlayers.length} DB Players Active
            </span>
          </div>
          <p className="text-xs text-[#6F716B] mt-1">
            Create training sessions, update drill schedules, and mark live attendance for players registered in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlayers}
            className="p-2.5 rounded-full bg-[#F7F5EF] hover:bg-[#E4E1D8] text-[#20221F] transition-colors border border-[#E4E1D8]"
            title="Refresh Squad Players from DB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingPlayers ? 'animate-spin' : ''}`} />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#BEF264]" />
            <span>Create Training Session</span>
          </motion.button>
        </div>
      </div>

      {/* Row 1: Active Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-3 flex flex-col justify-between hover:border-[#7A8B5A]/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-2">
                <span className="px-3 py-1 rounded-full bg-[#20221F] text-white text-[10px] font-black uppercase">
                  {session.type}
                </span>
                <span className="text-xs font-bold text-[#7A8B5A]">{session.intensity}</span>
              </div>
              <h3 className="font-serif font-black text-lg text-[#20221F]">{session.title}</h3>
              <p className="text-xs text-[#6F716B]">{session.drills}</p>
              <div className="text-xs text-[#6F716B] bg-[#F7F5EF] p-3 rounded-2xl border border-[#E4E1D8] space-y-1">
                <div>📅 <strong>{session.date}</strong> ({session.time})</div>
                <div>📍 {session.pitch}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Mark Player Attendance */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7A8B5A]" />
            <h3 className="font-serif font-black text-base text-[#20221F]">
              Live Squad Attendance Tracker ({squadPlayers.length} Registered DB Players)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#6F716B]">Click status to cycle</span>
        </div>

        {loadingPlayers ? (
          <div className="p-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#7A8B5A] mx-auto" />
            <p className="text-xs text-[#6F716B] font-bold">Loading live squad players from MongoDB...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredSquadPlayers.map((player) => {
              const status = playerAttendance[player.id] || 'Present';
              const isPresent = status === 'Present';

              return (
                <div 
                  key={player.id} 
                  className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#E4E1D8] space-y-2 flex flex-col justify-between hover:border-[#7A8B5A]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#20221F]">
                      <span className="truncate pr-1">{player.name}</span>
                      <span className="text-[10px] text-[#7A8B5A] shrink-0">#{player.jersey}</span>
                    </div>
                    <div className="text-[10px] text-[#6F716B] font-semibold truncate">{player.pos}</div>
                  </div>

                  <button
                    onClick={() => handleTogglePlayerAttendance(player.id, player.name)}
                    className={`w-full py-1.5 px-3 rounded-full text-[11px] font-bold transition-all ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : status === 'Absent'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {status}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Training Session Modal */}
      <CreateTrainingModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTraining={handleAddSession}
        triggerToast={triggerToast}
      />

    </div>
  );
}
