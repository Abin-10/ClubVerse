import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Zap,
} from 'lucide-react';

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLaunchDashboard = () => {
    const user = JSON.parse(localStorage.getItem('clubverse_user') || 'null');
    if (user && user.role === 'Fan') {
      navigate('/dashboard');
    } else if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { message: 'Please log in as a Fan to access your Fan Dashboard.' } });
    }
  };

  return (
    <section id="dashboard-preview" className="py-24 bg-[#F7F5EF] relative overflow-hidden">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#7A8B5A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B08D57]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Scroll Animations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-xs font-bold text-[#7A8B5A] shadow-warm-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fan Experience</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#20221F] font-serif tracking-tight leading-tight">
            Your Command Center as a <span className="bg-gradient-to-r from-[#7A8B5A] to-[#B08D57] bg-clip-text text-transparent">ClubVerse VIP</span>
          </h2>

          <p className="text-base text-[#6F716B] leading-relaxed">
            Experience an elegant, real-time fan dashboard crafted with fluid scroll animations, 3D visual cards, live match polling, and instant wallet management.
          </p>
        </motion.div>

        {/* Interactive Preview Container Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] shadow-warm-lg overflow-hidden"
        >
          {/* Top Preview Control Bar */}
          <div className="bg-[#EFEEE8] px-6 py-4 border-b border-[#E4E1D8] flex flex-wrap items-center justify-between gap-4">
            
            {/* Window Controls & Title */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <span className="text-xs font-bold text-[#20221F] ml-2 font-mono">
                clubverse.app/dashboard
              </span>
            </div>

            {/* Interactive Preview Tabs */}
            <div className="flex items-center bg-[#FFFDF8] p-1 rounded-full border border-[#E4E1D8] shadow-warm-sm">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'wallet', label: 'Fan Wallet', icon: CreditCard },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#20221F] text-white shadow-warm-sm' 
                        : 'text-[#6F716B] hover:text-[#20221F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Launch Button */}
            <button 
              onClick={handleLaunchDashboard}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white text-xs font-bold transition-all shadow-warm-sm group"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Interactive Preview Content Switcher */}
          <div className="p-6 sm:p-10 min-h-[420px] flex items-center justify-center bg-[#F4F6FB]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
                >
                  {/* Card 1: 3D Crystal Gem */}
                  <motion.div 
                    whileHover={{ y: -6 }}
                    className="bg-[#FFFDF8] border border-[#E4E1D8] p-6 rounded-3xl shadow-warm-md space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold bg-[#20221F] text-white px-2.5 py-1 rounded-full uppercase">Pro Version</span>
                      <span className="text-[10px] font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2 py-0.5 rounded-full">15 Days Left</span>
                    </div>

                    <div className="py-4 flex justify-center">
                      <motion.div 
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 bg-gradient-to-br from-[#7A8B5A] to-[#B08D57] transform rotate-45 rounded-xl shadow-xl flex items-center justify-center"
                      >
                        <Sparkles className="w-8 h-8 text-white transform -rotate-45" />
                      </motion.div>
                    </div>

                    <div>
                      <h4 className="font-serif font-black text-lg text-[#20221F]">Advantages</h4>
                      <p className="text-xs text-[#6F716B]">VIP Matchday Benefits & Tunnel Pass</p>
                    </div>
                  </motion.div>

                  {/* Card 2: Activity Hours 186h */}
                  <motion.div 
                    whileHover={{ y: -6 }}
                    className="bg-[#FFFDF8] border border-[#E4E1D8] p-6 rounded-3xl shadow-warm-md space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-black text-lg text-[#20221F]">Activity</h4>
                      <span className="text-[10px] font-black bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full">+14.2%</span>
                    </div>

                    <div>
                      <span className="text-xs text-[#6F716B]">Worked this week</span>
                      <div className="text-3xl font-black text-[#20221F] font-serif">186h</div>
                    </div>

                    <div className="flex items-end gap-2 h-20 pt-2">
                      {[30, 45, 40, 65, 95, 55, 48].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#EFEEE8] rounded-full h-full p-1 flex items-end">
                          <div 
                            style={{ height: `${h}%` }} 
                            className={`w-full rounded-full ${i === 4 ? 'bg-[#84CC16]' : 'bg-[#7A8B5A]'}`} 
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Card 3: Virtual VISA Card */}
                  <motion.div 
                    whileHover={{ y: -6, rotate: -1 }}
                    className="bg-gradient-to-br from-[#DCFCE7] via-[#D1FAE5] to-[#A7F3D0] border border-[#6EE7B7] p-6 rounded-3xl shadow-warm-md space-y-4 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-extrabold text-sm text-[#065F46]">ClubVerse VIP</span>
                      <span className="font-black text-lg text-[#065F46] italic">VISA</span>
                    </div>

                    <div className="py-2">
                      <span className="text-[10px] font-bold text-[#047857] uppercase">Total Balance</span>
                      <div className="text-2xl font-black text-[#064E3B] font-serif">₹6,010.29</div>
                    </div>

                    <div className="flex justify-between text-xs font-mono font-bold text-[#065F46]">
                      <span>•••• 5802</span>
                      <span>09/28</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'wallet' && (
                <motion.div 
                  key="wallet"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-2xl bg-[#FFFDF8] border border-[#E4E1D8] p-8 rounded-3xl shadow-warm-md space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-black text-2xl text-[#20221F]">Digital Fan Wallet</h4>
                      <p className="text-xs text-[#6F716B]">Instant matchday ticket payments & token conversion</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] font-bold text-xs">Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
                      <span className="text-xs text-[#6F716B]">Available INR</span>
                      <div className="text-2xl font-black text-[#20221F] font-serif">₹4,327.40</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
                      <span className="text-xs text-[#6F716B]">Fan Tokens (CLUB)</span>
                      <div className="text-2xl font-black text-[#7A8B5A] font-serif">1,682.89</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-2xl bg-[#FFFDF8] border border-[#E4E1D8] p-8 rounded-3xl shadow-warm-md space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-black text-2xl text-[#20221F]">Total Spent (₹820.65)</h4>
                      <p className="text-xs text-[#6F716B]">Weekly breakdown across match passes and official merch</p>
                    </div>
                    <span className="text-xs font-black text-[#7A8B5A] bg-lime-100 px-3 py-1 rounded-full">+26 Assets</span>
                  </div>

                  {/* Smooth curve SVG */}
                  <div className="w-full h-36 pt-2">
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      <path d="M 10 90 Q 80 110 150 70 T 280 30 T 390 80" fill="none" stroke="#20221F" strokeWidth="3" />
                      <circle cx="280" cy="30" r="6" fill="#BEF264" stroke="#20221F" strokeWidth="2" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Callout Bar */}
          <div className="bg-[#FFFDF8] px-8 py-6 border-t border-[#E4E1D8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#20221F] text-[#BEF264] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#20221F]">Ready to explore the full dashboard experience?</h4>
                <p className="text-xs text-[#6F716B]">Interactive animations for clicking, toggling, top-ups, and fan polling.</p>
              </div>
            </div>

            <button
              onClick={handleLaunchDashboard}
              className="px-6 py-3 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-extrabold transition-all shadow-warm-md flex items-center gap-2"
            >
              <span>Launch Fan Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#BEF264]" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
