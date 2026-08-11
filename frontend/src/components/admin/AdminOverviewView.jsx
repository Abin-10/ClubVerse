import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Calendar, Activity, ArrowUpRight, CheckCircle2, Shield, Sparkles, ChevronRight } from 'lucide-react';

export default function AdminOverviewView({ stats, onNavigateToPlayers, onNavigateToCoaches }) {
  const statCards = [
    {
      title: 'Total Players',
      count: `${stats.totalPlayers || 0} / 24`,
      subtext: `${stats.activePlayers || 0} active in squad (24 Max)`,
      icon: Users,
      color: 'from-[#20221F] to-[#2E332B]',
      accentColor: 'text-[#BEF264]',
      badge: 'Squad Active',
      action: onNavigateToPlayers
    },
    {
      title: 'Total Coaches',
      count: stats.totalCoaches || 0,
      subtext: `${stats.activeCoaches || 0} active coaching staff`,
      icon: Award,
      color: 'from-[#7A8B5A] to-[#627146]',
      accentColor: 'text-white',
      badge: 'Staff Ready',
      action: onNavigateToCoaches
    },
    {
      title: 'Upcoming Matches',
      count: stats.upcomingMatchesCount || 4,
      subtext: 'Next fixture in 3 days',
      icon: Calendar,
      color: 'from-[#B08D57] to-[#8C6D3B]',
      accentColor: 'text-[#FFFDF8]',
      badge: 'Matchday Ready'
    },
    {
      title: 'Recent Audit Activities',
      count: stats.recentActivitiesCount || 12,
      subtext: 'System synced with MongoDB',
      icon: Activity,
      color: 'from-[#20221F] to-[#3B3F38]',
      accentColor: 'text-[#BEF264]',
      badge: 'MongoDB Live'
    }
  ];

  const upcomingMatches = [
    { id: 1, opponent: 'Arsenal FC', date: 'Sat, Feb 02, 2026', time: '20:00 UTC', venue: 'Emirates Stadium (Away)', status: 'Confirmed' },
    { id: 2, opponent: 'Chelsea FC', date: 'Sun, Feb 10, 2026', time: '17:30 UTC', venue: 'ClubVerse Stadium (Home)', status: 'Upcoming' },
    { id: 3, opponent: 'Manchester City', date: 'Sat, Feb 16, 2026', time: '15:00 UTC', venue: 'Etihad Stadium (Away)', status: 'Scheduled' },
    { id: 4, opponent: 'Liverpool FC', date: 'Sat, Feb 23, 2026', time: '19:45 UTC', venue: 'ClubVerse Stadium (Home)', status: 'Scheduled' }
  ];

  const recentActivities = [
    { id: 1, title: 'Marcus Rashford profile details updated', type: 'Player Update', time: '10 mins ago', user: 'Admin' },
    { id: 2, title: 'Mikel Arteta appointed as Tactical Head Coach', type: 'Coach Appointed', time: '42 mins ago', user: 'Admin' },
    { id: 3, title: 'New player Bukayo Saka registered in MongoDB', type: 'Registration', time: '2 hours ago', user: 'System' },
    { id: 4, title: 'Fan matchday passes inventory synchronized', type: 'Database Sync', time: '5 hours ago', user: 'MongoDB' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white p-5 sm:p-6 rounded-[2rem] shadow-warm-md flex flex-wrap items-center justify-between gap-4 border border-white/10"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Shield className="w-6 h-6 text-[#BEF264]" />
          </div>
          <div>
            <h2 className="font-serif font-black text-xl text-[#FFFDF8]">
              ClubVerse Administrator Hub
            </h2>
            <p className="text-xs text-[#E4E1D8]/80 font-medium">
              Manage team squad players, coaching staff, and operational matches.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#BEF264]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            MongoDB Connected
          </span>
        </div>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={card.action}
              className={`p-6 rounded-[2rem] bg-gradient-to-br ${card.color} text-white shadow-warm-md relative overflow-hidden flex flex-col justify-between ${card.action ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/10">
                  {card.badge}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${card.accentColor}`} />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-black font-serif tracking-tight">{card.count}</h3>
                <p className="text-xs font-bold text-white/90">{card.title}</p>
                <p className="text-[11px] text-white/70">{card.subtext}</p>
              </div>

              {card.action && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Manage List</span>
                  <ArrowUpRight className="w-4 h-4 text-[#BEF264]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: Upcoming Matches & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Upcoming Matches Card */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E1D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#7A8B5A]/15 text-[#7A8B5A] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#20221F]">Upcoming Matches</h3>
                  <p className="text-xs text-[#6F716B]">Next official fixtures for ClubVerse</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFEEE8] text-[#20221F]">
                4 Fixtures
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {upcomingMatches.map((m) => (
                <div 
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex flex-wrap items-center justify-between gap-3 hover:border-[#7A8B5A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#20221F] text-white font-serif font-bold text-xs flex items-center justify-center">
                      VS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#20221F]">ClubVerse vs {m.opponent}</h4>
                      <p className="text-[11px] text-[#6F716B]">{m.venue}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#7A8B5A] block">{m.date}</span>
                    <span className="text-[10px] text-[#6F716B] font-semibold">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities Audit List */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E1D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#20221F] text-white flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#BEF264]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#20221F]">Recent Activity</h3>
                  <p className="text-xs text-[#6F716B]">System & administrative updates</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 mt-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F5EF]/80 border border-[#E4E1D8]">
                  <div className="w-2 h-2 rounded-full bg-[#7A8B5A] mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-[#20221F] truncate">{act.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#6F716B]">
                      <span>{act.type}</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
