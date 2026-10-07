import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Newspaper,
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function PlayerOverviewView({ 
  currentUser = {},
  fixtures = [],
  onNavigateToTab
}) {
  const completedFixtures = (fixtures || []).filter((f) => f.status === 'Completed');
  const upcomingFixturesList = (fixtures || []).filter((f) => f.status !== 'Completed');

  const totalMatchesPlayed = completedFixtures.length;
  const playerGoals = currentUser.goals ?? 0;
  const playerAssists = currentUser.assists ?? 0;
  const playerRating = currentUser.rating !== undefined && currentUser.rating !== null && Number(currentUser.rating) > 0 
    ? Number(currentUser.rating).toFixed(1) 
    : '0.0';

  const nextFixture = upcomingFixturesList[0];
  let nextOpponentName = 'Opponent';
  let isHomeMatch = true;
  let competitionName = 'Premier League';
  let matchDateStr = 'TBD';
  let matchTimeStr = '20:00 BST';
  let stadiumStr = 'ClubVerse Arena';

  if (nextFixture) {
    const homeName = nextFixture.home_team?.name || (typeof nextFixture.home_team === 'string' ? nextFixture.home_team : 'ClubVerse FC');
    const awayName = nextFixture.away_team?.name || (typeof nextFixture.away_team === 'string' ? nextFixture.away_team : 'Opponent');
    const isHomeCV = homeName.toLowerCase().includes('clubverse') || homeName.toLowerCase().includes('cvfc');

    if (isHomeCV) {
      nextOpponentName = awayName;
      isHomeMatch = true;
    } else {
      nextOpponentName = homeName;
      isHomeMatch = false;
    }

    if (nextFixture.competition) competitionName = nextFixture.competition;
    if (nextFixture.match_date) {
      const d = new Date(nextFixture.match_date);
      if (!isNaN(d.getTime())) matchDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (nextFixture.match_time) matchTimeStr = nextFixture.match_time;
    if (nextFixture.venue) stadiumStr = nextFixture.venue;
  }

  const clubNews = [
    {
      id: 1,
      title: `Squad Selection Announced for ${nextOpponentName} Clash`,
      date: 'Today',
      category: 'Match Briefing',
      summary: `Tactical lineup confirmed for fixture vs ${nextOpponentName}. High press intensity drills set for squad.`
    },
    {
      id: 2,
      title: `Medical Clearance: ${currentUser.full_name || currentUser.name || 'Player'} Fully Fit`,
      date: 'Yesterday',
      category: 'Fitness Report',
      summary: `Medical status logged at ${currentUser.medical_clearance || '100% Match Fit'}. Ready for upcoming matchday selection.`
    },
    {
      id: 3,
      title: 'Official Match Performance Ratings Updated',
      date: 'Recent',
      category: 'Analytics',
      summary: 'Admin match ratings and goal/assist statistics updated following completed fixtures in database.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white p-5 rounded-3xl shadow-warm-md flex flex-wrap items-center justify-between gap-4 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black shadow-warm-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-lg sm:text-xl">
              Matchday Focus: {currentUser.full_name || currentUser.name || 'Player'}
            </h2>
            <p className="text-xs text-white/80">
              {nextFixture ? `Next fixture vs ${nextOpponentName} (${isHomeMatch ? 'Home' : 'Away'}) at ${stadiumStr}.` : 'Squad preparation on track. Ready for upcoming matchday selection.'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigateToTab && onNavigateToTab('matches')}
          className="px-4 py-2 rounded-full bg-white text-[#20221F] hover:bg-[#BEF264] text-xs font-bold transition-all shadow-warm-sm flex items-center gap-1.5"
        >
          <span>View Match Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Row 1: Upcoming Match & Next Training */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Match Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#7A8B5A]" />
              <span className="font-serif font-black text-sm text-[#20221F]">Upcoming Match</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#627146] text-[10px] font-extrabold uppercase tracking-wider">
              {isHomeMatch ? 'Home Fixture' : 'Away Fixture'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F5EF] p-5 rounded-2xl border border-[#E4E1D8]">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-[11px] font-extrabold text-[#7A8B5A] uppercase tracking-wider">
                {competitionName}
              </div>
              <h3 className="font-serif font-black text-2xl text-[#20221F]">
                ClubVerse FC <span className="text-[#6F716B] font-light">vs</span> {nextOpponentName}
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6F716B] pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  {matchDateStr}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  {matchTimeStr}
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#20221F] text-white text-center shadow-warm-sm flex-shrink-0">
              <div className="text-[10px] font-bold text-[#BEF264] uppercase">Status</div>
              <div className="text-xs font-black">Starting XI Ready</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6F716B] pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#7A8B5A]" />
              {stadiumStr}
            </span>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('matches')}
              className="font-bold text-[#7A8B5A] hover:underline"
            >
              Match Details & Tactics →
            </button>
          </div>
        </motion.div>

        {/* Next Training Session Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7A8B5A]" />
              <span className="font-serif font-black text-sm text-[#20221F]">Next Training Session</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Attendance Logged
            </span>
          </div>

          <div className="space-y-2 bg-[#F7F5EF] p-4 rounded-2xl border border-[#E4E1D8]">
            <h4 className="font-bold text-sm text-[#20221F]">High-Press & Tactical Transition</h4>
            <div className="space-y-1 text-xs text-[#6F716B]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7A8B5A]" />
                <span>Tomorrow, 09:30 AM (120 mins)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7A8B5A]" />
                <span>Pitch 1 (First Team Training Ground)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#7A8B5A]" />
                <span>Head Coach Command</span>
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Confirmed Present
            </span>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('training')}
              className="font-bold text-[#7A8B5A] hover:underline"
            >
              Full Schedule →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Personal Performance Summary (4 Dynamic Metric Cards) */}
      <div className="space-y-3">
        <h3 className="font-serif font-black text-lg text-[#20221F] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#7A8B5A]" />
          <span>Personal Season Performance Summary</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Stat 1: Goals */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F716B]">Goals Scored</span>
              <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif font-black text-3xl text-[#20221F]">{playerGoals}</div>
            <div className="text-[11px] text-[#7A8B5A] font-bold">Official Season Goals</div>
          </motion.div>

          {/* Stat 2: Assists */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F716B]">Assists</span>
              <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif font-black text-3xl text-[#20221F]">{playerAssists}</div>
            <div className="text-[11px] text-[#7A8B5A] font-bold">Official Key Passes</div>
          </motion.div>

          {/* Stat 3: Matches Played */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F716B]">Matches Played</span>
              <div className="w-8 h-8 rounded-xl bg-[#7A8B5A]/10 text-[#7A8B5A] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif font-black text-3xl text-[#20221F]">{totalMatchesPlayed}</div>
            <div className="text-[11px] text-[#7A8B5A] font-bold">Completed Season Fixtures</div>
          </motion.div>

          {/* Stat 4: Match Rating */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6F716B]">Avg Match Rating</span>
              <div className="w-8 h-8 rounded-xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black">
                ★
              </div>
            </div>
            <div className="font-serif font-black text-3xl text-[#20221F]">{playerRating}<span className="text-xs font-normal text-[#6F716B]">/10</span></div>
            <div className="text-[11px] text-[#7A8B5A] font-bold">Official Admin Rating</div>
          </motion.div>

        </div>
      </div>

      {/* Row 3: Recent Club News Feed */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#7A8B5A]" />
            <h3 className="font-serif font-black text-sm text-[#20221F]">Recent Club News & Announcements</h3>
          </div>
          <span className="text-xs text-[#6F716B] font-bold">First Team Desk</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clubNews.map((news) => (
            <div 
              key={news.id} 
              className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#E4E1D8] space-y-2 flex flex-col justify-between hover:border-[#7A8B5A]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-[#7A8B5A]">
                  <span className="uppercase tracking-wider">{news.category}</span>
                  <span className="text-[#6F716B]">{news.date}</span>
                </div>
                <h4 className="font-bold text-xs text-[#20221F] mt-1 leading-snug">{news.title}</h4>
                <p className="text-[11px] text-[#6F716B] mt-1 line-clamp-2">{news.summary}</p>
              </div>
              <button className="text-[11px] font-bold text-[#7A8B5A] hover:underline pt-2 text-left">
                Read Bulletin →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
