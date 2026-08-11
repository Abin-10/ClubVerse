import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Cpu, Sparkles, CheckCircle2, TrendingUp, ShieldAlert, Award, Zap } from 'lucide-react';

export default function CoachPerformanceView() {
  const teamMetrics = {
    winRate: '78.5%',
    goalsScored: 54,
    goalsConceded: 18,
    cleanSheets: 14,
    possessionAvg: '64.2%',
    passAccuracyAvg: '89.1%'
  };

  const topFormPlayers = [
    { name: 'Bukayo Saka', pos: 'RW', rating: 8.8, goals: 14, assists: 9 },
    { name: 'Declan Rice', pos: 'CM', rating: 8.5, goals: 5, assists: 8 },
    { name: 'William Saliba', pos: 'CB', rating: 8.5, cleanSheets: 14 },
    { name: 'David Raya', pos: 'GK', rating: 8.2, saves: 68 }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Performance Analysis & AI Squad Insights
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Analyze squad metrics, win rates, goals conceded, and AI tactical recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BEF264] text-[#20221F] text-xs font-black shadow-warm-sm">
          <Sparkles className="w-4 h-4 text-[#20221F]" />
          <span>ClubVerse AI Tactical Engine</span>
        </div>
      </div>

      {/* Team Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B]">Season Win Rate</div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{teamMetrics.winRate}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">22 Wins • 4 Draws • 2 Losses</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B]">Goals Scored / Conceded</div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{teamMetrics.goalsScored} <span className="text-sm font-normal text-[#6F716B]">/ {teamMetrics.goalsConceded}</span></div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">+36 Goal Difference</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B]">Clean Sheets</div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{teamMetrics.cleanSheets}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">50% Match Shutouts</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] p-5 rounded-3xl shadow-warm-sm space-y-2">
          <div className="text-xs font-bold text-[#6F716B]">Avg Possession & Pass Acc.</div>
          <div className="font-serif font-black text-3xl text-[#20221F]">{teamMetrics.possessionAvg}</div>
          <div className="text-[11px] text-[#7A8B5A] font-bold">{teamMetrics.passAccuracyAvg} Pass Completion</div>
        </div>
      </div>

      {/* Row 2: AI Player Performance Analysis & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Tactical Squad Engine */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#1A1D19] text-white rounded-3xl p-6 shadow-warm-lg space-y-4 border border-[#7A8B5A]/40">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#BEF264]" />
              <h3 className="font-serif font-black text-lg text-white">AI Squad Performance & Fatigue Report</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase">
              Live AI Scan
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-[#BEF264] uppercase tracking-wider block">
                Recommended Derby Tactical Setup
              </span>
              <p className="text-white/90 leading-relaxed">
                Execute 4-3-3 high-intensity press. Target opponent left-back in transition. Bukayo Saka & Declan Rice exhibit 95%+ pressing efficiency when paired together.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Fatigue & Injury Risk Warning
              </span>
              <p className="text-amber-100 leading-relaxed">
                Gabriel Martinelli logged high sprint distance (12.2 km). Recommend rotation at 60th minute mark to maintain muscle readiness.
              </p>
            </div>
          </div>
        </div>

        {/* Top Squad Performers */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#7A8B5A]" />
              <h3 className="font-serif font-black text-base text-[#20221F]">Top Squad Form Leaders</h3>
            </div>
            <span className="text-xs font-bold text-[#6F716B]">Ratings</span>
          </div>

          <div className="space-y-3">
            {topFormPlayers.map((player, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#20221F]">{player.name} ({player.pos})</div>
                  <div className="text-[10px] text-[#6F716B]">
                    {player.goals ? `${player.goals} Goals • ${player.assists} Assists` : player.cleanSheets ? `${player.cleanSheets} Clean Sheets` : `${player.saves} Saves`}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F] font-black text-xs">
                  ★ {player.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
