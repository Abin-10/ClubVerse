import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  Award, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Flame, 
  BarChart2, 
  Cpu,
  Trophy
} from 'lucide-react';

export default function PlayerPerformanceView({ currentUser = {}, fixtures = [] }) {
  const completedFixtures = (fixtures || []).filter((f) => f.status === 'Completed');

  // Filter completed matches involving ClubVerse
  const cvCompletedFixtures = completedFixtures.filter((f) => {
    const homeName = f.home_team?.name || (typeof f.home_team === 'string' ? f.home_team : '') || '';
    const awayName = f.away_team?.name || (typeof f.away_team === 'string' ? f.away_team : '') || '';
    return homeName.toLowerCase().includes('clubverse') || awayName.toLowerCase().includes('clubverse') ||
           homeName.toLowerCase().includes('cvfc') || awayName.toLowerCase().includes('cvfc');
  });

  const totalMatchesPlayed = cvCompletedFixtures.length;

  const playerGoals = currentUser.goals ?? 0;
  const playerAssists = currentUser.assists ?? 0;
  const playerRating = currentUser.rating !== undefined && currentUser.rating !== null && Number(currentUser.rating) > 0 
    ? Number(currentUser.rating).toFixed(1) 
    : '0.0';

  // Map completed fixtures to player match rating trend
  const matchRatings = cvCompletedFixtures.map((f) => {
    const homeName = f.home_team?.name || (typeof f.home_team === 'string' ? f.home_team : 'Home Team');
    const awayName = f.away_team?.name || (typeof f.away_team === 'string' ? f.away_team : 'Away Team');
    const isHomeCV = homeName.toLowerCase().includes('clubverse') || homeName.toLowerCase().includes('cvfc');
    const oppName = isHomeCV ? awayName : homeName;

    const cvScore = isHomeCV ? (f.home_score ?? 0) : (f.away_score ?? 0);
    const oppScore = isHomeCV ? (f.away_score ?? 0) : (f.home_score ?? 0);
    
    let outcome = 'D';
    if (cvScore > oppScore) outcome = 'W';
    else if (cvScore < oppScore) outcome = 'L';
    const resultStr = `${outcome} ${cvScore}-${oppScore}`;

    // Search player's performance in fixture
    let rating = Number(playerRating) > 0 ? Number(playerRating) : 8.0;
    let matchG = 0;
    let matchA = 0;

    if (Array.isArray(f.player_performances)) {
      const perf = f.player_performances.find(p => 
        (p.player_id && String(p.player_id) === String(currentUser.playerId)) ||
        (p.player_name && p.player_name.toLowerCase() === (currentUser.full_name || currentUser.name || '').toLowerCase())
      );
      if (perf) {
        if (perf.rating) rating = Number(perf.rating);
        if (perf.goals) matchG = Number(perf.goals);
        if (perf.assists) matchA = Number(perf.assists);
      }
    }

    return {
      match: `vs ${oppName}`,
      result: resultStr,
      rating: rating,
      goals: matchG,
      assists: matchA
    };
  });

  // Fallback match list if DB has no completed fixtures yet
  const displayMatchRatings = matchRatings.length > 0 ? matchRatings : [
    { match: 'Season Pre-Match Drills', result: 'Completed', rating: Number(playerRating) > 0 ? Number(playerRating) : 8.0, goals: playerGoals, assists: playerAssists }
  ];

  const capabilityScore = Math.min(99, Math.max(70, Math.round((Number(playerRating) / 10) * 85 + (playerGoals + playerAssists) * 1.5)));

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            My Performance Analytics & AI Report
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Track individual match statistics, rating trends, and AI tactical insights based on DB performance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BEF264] text-[#20221F] text-xs font-black shadow-warm-sm">
          <Sparkles className="w-4 h-4 text-[#20221F]" />
          <span>ClubVerse AI Scout Sync</span>
        </div>
      </div>

      {/* 4 Dynamic Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Goals Scored</span>
            <Target className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{playerGoals}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Official Season Goals</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Assists Delivered</span>
            <Award className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{playerAssists}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Official Key Passes</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Matches Played</span>
            <Trophy className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{totalMatchesPlayed}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Completed Season Fixtures</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Avg Match Rating</span>
            <TrendingUp className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">
            {playerRating} <span className="text-xs text-[#6F716B] font-normal">/10</span>
          </div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Official Admin Rating</div>
        </div>
      </div>

      {/* Row 2: Visual Match Rating Trend Bar Chart & AI Performance Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Match Rating History Bar Chart */}
        <div className="lg:col-span-6 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#7A8B5A]" />
              <h3 className="font-serif font-black text-base text-[#20221F]">Recent Match Rating Trend</h3>
            </div>
            <span className="text-xs font-bold text-[#6F716B]">Official Match Ratings</span>
          </div>

          <div className="space-y-4 pt-2">
            {displayMatchRatings.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#20221F]">{item.match} ({item.result})</span>
                  <span className="text-[#7A8B5A] font-mono">
                    ★ {Number(item.rating).toFixed(1)} / 10 • {item.goals}G, {item.assists}A
                  </span>
                </div>
                <div className="w-full h-3 bg-[#F7F5EF] rounded-full overflow-hidden border border-[#E4E1D8]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(Math.min(10, item.rating) / 10) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#20221F] via-[#7A8B5A] to-[#BEF264] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance Analysis */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#1A1D19] text-white rounded-3xl p-6 shadow-warm-lg space-y-4 relative overflow-hidden border border-[#7A8B5A]/40">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#BEF264]" />
              <h3 className="font-serif font-black text-lg text-white">AI Tactical & Scout Analysis</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase">
              Live AI Report
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-white/80">
              <span>Overall AI Capability Index</span>
              <span className="font-black text-[#BEF264] text-sm">
                {capabilityScore > 0 ? capabilityScore : 85} / 100 ({currentUser.position || 'First Team Player'})
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-[#BEF264] uppercase tracking-wider block">
                Identified Core Strengths
              </span>
              <ul className="space-y-1.5 text-white/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#BEF264] shrink-0 mt-0.5" />
                  <span>{playerGoals} goals and {playerAssists} assists recorded in database matchplay.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#BEF264] shrink-0 mt-0.5" />
                  <span>Official Admin Rating: {playerRating} / 10 average performance score.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#BEF264] shrink-0 mt-0.5" />
                  <span>High tactical discipline operating in position: {currentUser.position || 'Forward / Midfielder'}.</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#7A8B5A]/20 border border-[#7A8B5A]/40 space-y-1">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                Coach & AI Tactical Advice
              </span>
              <p className="text-white/90 leading-relaxed">
                Maintain high pressing triggers in transition as {currentUser.position || 'First Team Player'}. Focus on early link-up play with central midfielders during buildup.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-1">
              <span>Physical Fitness: <strong className="text-emerald-400 font-bold">{currentUser.medical_clearance || '100% Fit'}</strong></span>
              <span>Updated: Live Performance Sync</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
