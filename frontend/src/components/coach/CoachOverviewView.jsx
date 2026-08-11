import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Calendar, 
  Activity, 
  Award, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Zap,
  UserCheck
} from 'lucide-react';

export default function CoachOverviewView({ 
  onNavigateToTab,
  onCreateTrainingClick,
  players = [],
  stats = {
    upcomingMatches: 4,
    todaysTraining: 2,
    squadFitness: '96%'
  }
}) {
  const registeredCount = players.length;
  const activeCount = players.filter((p) => p.status === 'Active').length;
  const maxCapacity = 24;
  const availableSlots = Math.max(0, maxCapacity - registeredCount);

  const recentActivities = [
    { id: 1, title: 'Starting XI Tactical Shape Confirmed', time: '10 mins ago', type: 'Match Tactics', desc: '4-3-3 High Pressing formation set for Sunday game vs Manchester City.' },
    { id: 2, title: 'Player Performance Evaluated', time: '1 hour ago', type: 'Performance', desc: 'Bukayo Saka & Declan Rice match ratings updated after high-intensity drills.' },
    { id: 3, title: 'New Recovery Session Created', time: '3 hours ago', type: 'Training', desc: 'Hydrotherapy & foam rolling scheduled for Friday 10:00 AM.' },
    { id: 4, title: 'Medical Clearance Approved', time: 'Yesterday', timeLabel: 'Physio', desc: `Physio team cleared ${activeCount}/${registeredCount} registered DB players for full matchday intensity.` }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white p-5 rounded-3xl shadow-warm-md flex flex-wrap items-center justify-between gap-4 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black shadow-warm-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-lg sm:text-xl">
              Head Coach Command Center
            </h2>
            <p className="text-xs text-white/80">
              Squad preparation on track. Next derby match vs Manchester City in 4 days!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onCreateTrainingClick}
            className="px-4 py-2 rounded-full bg-[#BEF264] text-[#20221F] hover:bg-white text-xs font-black transition-all shadow-warm-sm flex items-center gap-1.5"
          >
            <span>+ Create Session</span>
          </button>
          <button 
            onClick={() => onNavigateToTab && onNavigateToTab('players')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
          >
            Manage Squad
          </button>
        </div>
      </motion.div>

      {/* Row 1: 4 Main Dashboard Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Players */}
        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => onNavigateToTab && onNavigateToTab('players')}
          className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 cursor-pointer hover:border-[#7A8B5A]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F716B]">Total Squad Players</span>
            <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F] flex items-baseline gap-1.5">
            <span>{registeredCount}</span>
            <span className="text-sm font-sans font-extrabold text-[#6F716B]">/ {maxCapacity} Max</span>
          </div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">
            {activeCount} Active in DB • {availableSlots} Slots Free
          </div>
        </motion.div>

        {/* Card 2: Upcoming Matches */}
        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => onNavigateToTab && onNavigateToTab('matches')}
          className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 cursor-pointer hover:border-[#7A8B5A]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F716B]">Upcoming Matches</span>
            <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{stats.upcomingMatches}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Next: vs Man City (H)</div>
        </motion.div>

        {/* Card 3: Today's Training */}
        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => onNavigateToTab && onNavigateToTab('training')}
          className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 cursor-pointer hover:border-[#7A8B5A]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F716B]">Today's Training</span>
            <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{stats.todaysTraining}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">1 Morning • 1 Tactical</div>
        </motion.div>

        {/* Card 4: Squad Fitness */}
        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => onNavigateToTab && onNavigateToTab('performance')}
          className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 cursor-pointer hover:border-[#7A8B5A]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F716B]">Squad Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{stats.squadFitness}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">High Intensity Ready</div>
        </motion.div>

      </div>

      {/* Row 2: Today's Training Schedule & Recent Activities Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Schedule Overview */}
        <div className="lg:col-span-6 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7A8B5A]" />
              <h3 className="font-serif font-black text-base text-[#20221F]">Today's Training Schedule</h3>
            </div>
            <span className="text-xs font-bold text-[#7A8B5A]">Aug 7, 2026</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#20221F]">Session 1: High-Press & Tactical Counter</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#20221F] text-white">09:30 AM</span>
              </div>
              <p className="text-[11px] text-[#6F716B]">Pitch 1 • Overload buildup, 4v3 transition, set-piece positioning.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#20221F]">Session 2: Video Analysis & Recovery</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7A8B5A] text-white">03:00 PM</span>
              </div>
              <p className="text-[11px] text-[#6F716B]">Tactical Room B • Opponent press triggers & cryotherapy session.</p>
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab && onNavigateToTab('training')}
            className="w-full py-2.5 rounded-2xl bg-[#F7F5EF] hover:bg-[#EFEEE8] border border-[#E4E1D8] text-xs font-bold text-[#20221F] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Go to Training Manager</span>
            <ChevronRight className="w-4 h-4 text-[#7A8B5A]" />
          </button>
        </div>

        {/* Recent Activities Feed */}
        <div className="lg:col-span-6 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7A8B5A]" />
              <h3 className="font-serif font-black text-base text-[#20221F]">Recent Coaching Activities</h3>
            </div>
            <span className="text-xs font-bold text-[#6F716B]">Live Feed</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#20221F]">{act.title}</span>
                  <span className="text-[10px] text-[#6F716B]">{act.time}</span>
                </div>
                <p className="text-[11px] text-[#6F716B] leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
