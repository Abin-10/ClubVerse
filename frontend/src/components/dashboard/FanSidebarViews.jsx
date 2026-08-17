import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  BarChart3, 
  Ticket, 
  Award, 
  Users, 
  HelpCircle, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  CheckCircle,
  Calendar,
  Zap,
  MessageSquare
} from 'lucide-react';

export function WalletView({ onOpenTopUp }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-6">
        <div>
          <h2 className="font-serif font-black text-2xl text-[#20221F]">Fan Wallet & Digital Pass</h2>
          <p className="text-xs text-[#6F716B] mt-1">Manage matchday funds, tokens, and contactless passes</p>
        </div>
        <button 
          onClick={onOpenTopUp}
          className="px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#BEF264]" />
          <span>Top Up Funds</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <span className="text-xs font-bold text-[#6F716B]">Wallet Balance</span>
          <div className="text-3xl font-black text-[#20221F] font-serif mt-1">₹6,260.29</div>
          <span className="text-[10px] text-[#7A8B5A] font-bold">+₹250.00 recent deposit</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <span className="text-xs font-bold text-[#6F716B]">ClubVerse Fan Coins</span>
          <div className="text-3xl font-black text-[#7A8B5A] font-serif mt-1">1,850 CLUB</div>
          <span className="text-[10px] text-[#6F716B] font-bold">2x Match Multiplier Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <span className="text-xs font-bold text-[#6F716B]">Saved Virtual Cards</span>
          <div className="text-3xl font-black text-[#20221F] font-serif mt-1">2 Cards</div>
          <span className="text-[10px] text-[#7A8B5A] font-bold">VIP Contactless Enabled</span>
        </div>
      </div>
    </motion.div>
  );
}

export function AnalyticsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="border-b border-[#E4E1D8] pb-6">
        <h2 className="font-serif font-black text-2xl text-[#20221F]">Fan Engagement Analytics</h2>
        <p className="text-xs text-[#6F716B] mt-1">Detailed statistics of match viewing, stadium attendance, and fan votes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#20221F]">Total Hours Engaged</h4>
            <span className="text-xs font-extrabold text-[#7A8B5A] bg-lime-100 px-2.5 py-0.5 rounded-full">Top 5% Fan</span>
          </div>
          <div className="text-4xl font-black text-[#20221F] font-serif">186 Hours</div>
          <p className="text-xs text-[#6F716B]">Tracked across match streams, stadium visits, and AI match analyses.</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#20221F]">Match Prediction Accuracy</h4>
            <span className="text-xs font-extrabold text-[#B08D57] bg-amber-100 px-2.5 py-0.5 rounded-full">Master Predictor</span>
          </div>
          <div className="text-4xl font-black text-[#20221F] font-serif">86% Success</div>
          <p className="text-xs text-[#6F716B]">Correct outcome prediction rate for season matches.</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TicketsView({ onOpenBooking }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-6">
        <div>
          <h2 className="font-serif font-black text-2xl text-[#20221F]">Match Passes & Tickets</h2>
          <p className="text-xs text-[#6F716B] mt-1">Your upcoming match fixtures, QR passes, and seat allocations</p>
        </div>
        <button 
          onClick={onOpenBooking}
          className="px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all"
        >
          + Buy New Pass
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-[#BEF264]">Next Match fixture</span>
          <h3 className="font-serif font-black text-xl">ClubVerse FC vs Northern Derby</h3>
          <p className="text-xs text-white/70">Saturday, Aug 15 • 19:45 PM • Main Arena Section A3</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold">
          VIP QR Pass Active
        </div>
      </div>
    </motion.div>
  );
}

export function PerksView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="border-b border-[#E4E1D8] pb-6">
        <h2 className="font-serif font-black text-2xl text-[#20221F]">VIP Perks & Benefits</h2>
        <p className="text-xs text-[#6F716B] mt-1">Exclusive privileges unlocked with your Pro Gold Tier</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: 'Locker Room & Tunnel Tour Access', desc: 'Pre-match walk with team players.' },
          { title: 'Official Merch 20% Discount Code', desc: 'Valid at club store & web checkout.' },
          { title: 'VIP Hospitality Lounge Passes', desc: 'Complimentary food & drinks on matchday.' },
          { title: 'Exclusive AI Match Analysis Report', desc: 'Deep dive tactical breakdown per fixture.' },
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#7A8B5A]" />
              <h4 className="font-bold text-xs text-[#20221F]">{item.title}</h4>
            </div>
            <p className="text-[11px] text-[#6F716B]">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function CommunityView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="border-b border-[#E4E1D8] pb-6">
        <h2 className="font-serif font-black text-2xl text-[#20221F]">Fan Club Community</h2>
        <p className="text-xs text-[#6F716B] mt-1">Connect with fellow supporters, share predictions, and join discussions</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-center space-y-3">
        <Users className="w-8 h-8 text-[#7A8B5A] mx-auto" />
        <h4 className="font-bold text-sm text-[#20221F]">Join the Official Supporters Discussion</h4>
        <p className="text-xs text-[#6F716B] max-w-md mx-auto">
          Engage in post-match debates, vote on Player of the Month, and share fan art.
        </p>
      </div>
    </motion.div>
  );
}

export function HelpView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      <div className="border-b border-[#E4E1D8] pb-6">
        <h2 className="font-serif font-black text-2xl text-[#20221F]">Help & Support Center</h2>
        <p className="text-xs text-[#6F716B] mt-1">Need assistance with match passes, tickets, or your fan account?</p>
      </div>

      <div className="space-y-4 max-w-xl">
        {[
          'How do I transfer my match pass to another fan?',
          'What happens if a match date is rescheduled?',
          'How do I redeem my VIP Fan Coin rewards?'
        ].map((faq, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold text-[#20221F]">
            {faq}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
