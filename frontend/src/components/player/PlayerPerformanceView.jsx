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
  Cpu
} from 'lucide-react';

export default function PlayerPerformanceView() {
  const matchRatings = [
    { match: 'vs Chelsea', rating: 8.8, result: 'W 3-1', goals: 1, assists: 1 },
    { match: 'vs Liverpool', rating: 8.2, result: 'D 2-2', goals: 1, assists: 0 },
    { match: 'vs Tottenham', rating: 9.1, result: 'W 2-0', goals: 2, assists: 0 },
    { match: 'vs Aston Villa', rating: 7.9, result: 'W 1-0', goals: 0, assists: 1 },
    { match: 'vs Real Madrid', rating: 8.5, result: 'W 2-1', goals: 1, assists: 1 },
    { match: 'vs West Ham', rating: 8.4, result: 'W 4-1', goals: 1, assists: 2 },
  ];

  const aiScoutReport = {
    generatedDate: 'Today (Post-Training Scan)',
    overallScore: '92 / 100 (Elite Winger Category)',
    keyStrengths: [
      'Exceptional 1v1 dribble completion rate (76.4% successful take-ons).',
      'High-level expected assists (xA = 0.42 per 90 mins).',
      'Elite defensive tracking back & high-intensity sprints (11.4 km covered avg).'
    ],
    tacticalAdvice: 'In high-press setups, exploit space between opponent left-back and central defender during quick transitions.',
    fatigueRisk: 'Low (96% Recovery Score)',
    recommendedDrill: 'Cut-inside right-foot curling finish from edge of penalty box.'
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            My Performance Analytics & AI Report
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Track individual match statistics, rating trends, and AI tactical insights.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BEF264] text-[#20221F] text-xs font-black shadow-warm-sm">
          <Sparkles className="w-4 h-4 text-[#20221F]" />
          <span>ClubVerse AI Scout Sync</span>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Goals Scored</span>
            <Target className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">14</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">0.64 goals per 90 mins</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Assists Delivered</span>
            <Award className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">9</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">28 Key Passes created</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Pass Accuracy</span>
            <Zap className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">88.5%</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">814 successful passes</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B] flex items-center justify-between">
            <span>Avg Match Rating</span>
            <TrendingUp className="w-4 h-4 text-[#7A8B5A]" />
          </div>
          <div className="font-serif font-black text-3xl text-[#20221F]">8.6 <span className="text-xs text-[#6F716B] font-normal">/10</span></div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">Ranked #1 Squad Performer</div>
        </div>
      </div>

      {/* Row 2: Visual Match Rating Trend Bar Chart & AI Performance Report (Read Only) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Match Rating History Bar Chart */}
        <div className="lg:col-span-6 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#7A8B5A]" />
              <h3 className="font-serif font-black text-base text-[#20221F]">Recent Match Rating Trend</h3>
            </div>
            <span className="text-xs font-bold text-[#6F716B]">Last 6 Fixtures</span>
          </div>

          <div className="space-y-4 pt-2">
            {matchRatings.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#20221F]">{item.match} ({item.result})</span>
                  <span className="text-[#7A8B5A] font-mono">{item.rating} / 10 • {item.goals}G, {item.assists}A</span>
                </div>
                <div className="w-full h-3 bg-[#F7F5EF] rounded-full overflow-hidden border border-[#E4E1D8]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.rating / 10) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#20221F] via-[#7A8B5A] to-[#BEF264] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance Analysis (Read Only) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#1A1D19] text-white rounded-3xl p-6 shadow-warm-lg space-y-4 relative overflow-hidden border border-[#7A8B5A]/40">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#BEF264]" />
              <h3 className="font-serif font-black text-lg text-white">AI Tactical & Scout Analysis</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase">
              Read-Only Report
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-white/80">
              <span>Overall AI Capability Index</span>
              <span className="font-black text-[#BEF264] text-sm">{aiScoutReport.overallScore}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-[#BEF264] uppercase tracking-wider block">
                Identified Core Strengths
              </span>
              <ul className="space-y-1.5 text-white/90">
                {aiScoutReport.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#BEF264] shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#7A8B5A]/20 border border-[#7A8B5A]/40 space-y-1">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                Coach & AI Tactical Advice
              </span>
              <p className="text-white/90 leading-relaxed">
                {aiScoutReport.tacticalAdvice}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-1">
              <span>Physical Fatigue Risk: <strong className="text-emerald-400 font-bold">{aiScoutReport.fatigueRisk}</strong></span>
              <span>Updated: {aiScoutReport.generatedDate}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
