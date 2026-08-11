import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  UserCheck, 
  Activity, 
  Filter,
  Zap
} from 'lucide-react';

export default function PlayerTrainingView({ searchQuery = '', triggerToast }) {
  const [filterType, setFilterType] = useState('all');
  const [attendanceState, setAttendanceState] = useState({
    1: 'Confirmed Present',
    2: 'Confirmed Present',
    3: 'Confirmed Present',
    4: 'Pending Briefing'
  });

  const trainingSessions = [
    {
      id: 1,
      title: 'High-Press & Tactical Counter-Attack',
      date: 'Tomorrow, Aug 8',
      time: '09:30 AM - 11:30 AM',
      pitch: 'Pitch 1 (First Team Ground)',
      coach: 'Mikel Arteta',
      type: 'Tactical',
      intensity: 'High (85% HR max)',
      drills: 'Overload buildup, 4v3 transition, set-piece positioning.'
    },
    {
      id: 2,
      title: 'Recovery & Mobility Session',
      date: 'Friday, Aug 10',
      time: '10:00 AM - 11:15 AM',
      pitch: 'Gym & Hydrotherapy Pool',
      coach: 'Dr. Sam Wilson (Head Physio)',
      type: 'Recovery',
      intensity: 'Low (Regeneration)',
      drills: 'Foam rolling, cryotherapy session, light core activation.'
    },
    {
      id: 3,
      title: 'Matchday -2 Final Shape & Set Pieces',
      date: 'Saturday, Aug 11',
      time: '11:00 AM - 12:30 PM',
      pitch: 'Spotify Arena Main Pitch',
      coach: 'Mikel Arteta',
      type: 'Pre-Match',
      intensity: 'Medium (Precision & Sharpness)',
      drills: 'Corner routines, penalty practice, final XI shape walk-through.'
    },
    {
      id: 4,
      title: 'Post-Match Regeneration & Video Review',
      date: 'Monday, Aug 13',
      time: '10:30 AM - 12:00 PM',
      pitch: 'Tactical Theater Room B',
      coach: 'Albert Stuivenberg',
      type: 'Analysis',
      intensity: 'Low',
      drills: 'Video breakdown of City game press triggers & GPS recovery.'
    }
  ];

  const toggleAttendance = (id) => {
    setAttendanceState(prev => {
      const current = prev[id] || 'Confirmed Present';
      const nextStatus = current === 'Confirmed Present' ? 'Excused - Physio' : 'Confirmed Present';
      if (triggerToast) triggerToast(`Session #${id} attendance updated: ${nextStatus}`);
      return { ...prev, [id]: nextStatus };
    });
  };

  const filteredSessions = trainingSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.coach.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || session.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Training Schedule & Attendance
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            View upcoming tactical sessions, logging status, and drill details.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'tactical', 'recovery', 'pre-match'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                filterType === type 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Summary Banner */}
      <div className="p-4 rounded-3xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-xs font-bold text-[#627146] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#7A8B5A]" />
          <span>Attendance Rate: 98.4% Season Attendance • 100% On-Time Arrival</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-mono">
          Physio Clearance: OK
        </span>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSessions.map((session) => {
          const status = attendanceState[session.id] || 'Confirmed Present';
          const isPresent = status === 'Confirmed Present';

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4 flex flex-col justify-between hover:border-[#7A8B5A]/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                  <span className="px-3 py-1 rounded-full bg-[#20221F] text-white text-[10px] font-black uppercase tracking-wider">
                    {session.type}
                  </span>
                  <span className="text-xs font-bold text-[#7A8B5A]">
                    {session.intensity}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-black text-lg text-[#20221F]">{session.title}</h3>
                  <p className="text-xs text-[#6F716B] mt-1 leading-relaxed">{session.drills}</p>
                </div>

                <div className="space-y-1.5 text-xs text-[#6F716B] bg-[#F7F5EF] p-3 rounded-2xl border border-[#E4E1D8]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    <span className="font-bold text-[#20221F]">{session.date} • {session.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    <span>{session.pitch}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#7A8B5A]" />
                    <span>Coach: {session.coach}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Status Action */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E4E1D8]">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {isPresent ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {status}
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      {status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleAttendance(session.id)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F7F5EF] hover:bg-[#EFEEE8] border border-[#E4E1D8] text-[11px] font-bold text-[#20221F] transition-colors"
                >
                  Toggle Status
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
