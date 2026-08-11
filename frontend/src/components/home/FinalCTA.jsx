import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ChevronRight, Ticket } from 'lucide-react';

export default function FinalCTA({ onOpenAIAssistant }) {
  const scrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#EFEEE8] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-[#FFFDF8] rounded-[2.5rem] p-8 sm:p-14 border border-[#E4E1D8] shadow-warm-md text-center relative overflow-hidden">
          
          {/* Subtle Ambient Light Decoration */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#7A8B5A]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEEE8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest">
              <Shield className="w-4 h-4 text-[#7A8B5A]" />
              <span>JOIN THE CLUBVERSE COMMUNITY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif leading-tight">
              Ready to Experience Next-Gen <br />
              <span className="italic text-[#7A8B5A]">Football Management?</span>
            </h2>

            <p className="text-base text-[#6F716B] font-medium leading-relaxed max-w-2xl mx-auto">
              Join thousands of supporters, players, and analysts connected to Spotify Arena. Explore static match passes or chat with our AI Scout today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToTickets}
                className="px-8 py-4 rounded-2xl font-bold text-xs text-white bg-[#7A8B5A] hover:bg-[#627146] shadow-warm-md flex items-center gap-2 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>View Match Passes</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAIAssistant}
                className="px-7 py-4 rounded-2xl font-bold text-xs text-[#20221F] bg-[#EFEEE8] hover:bg-[#E4E1D8] border border-[#E4E1D8] flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#7A8B5A]" />
                <span>Launch AI Scout</span>
              </motion.button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
