import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AIAssistantSection({ onOpenAIAssistant }) {
  const samplePrompts = [
    "Who is starting in midfield against Real Madrid?",
    "Analyze Lamine Yamal's dribbling metrics this season",
    "Where is the best view in Spotify Arena?",
    "Explain the La Masia tactical press structure"
  ];

  return (
    <section id="ai-assistant" className="py-24 bg-[#F7F5EF] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest shadow-warm-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>SPORTS TECH INTELLIGENCE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight leading-tight font-serif">
              Meet Your ClubVerse <br />
              <span className="text-[#7A8B5A] italic">AI Football Scout</span>
            </h2>

            <p className="text-[#6F716B] text-sm sm:text-base leading-relaxed font-medium">
              Get instant tactical answers, squad stats, head-to-head match predictor data, and seat recommendations powered by our deep sports intelligence engine.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Real-time tactical lineup & formation analysis',
                'Player performance ratings & historical records',
                'Spotify Arena seat finder & matchday guide',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#20221F]">
                  <div className="w-5 h-5 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenAIAssistant}
                className="px-7 py-4 bg-[#7A8B5A] hover:bg-[#627146] text-white font-bold rounded-2xl shadow-warm-md hover:scale-102 transition-all flex items-center gap-2 text-xs sm:text-sm"
              >
                <Bot className="w-5 h-5 text-white" />
                <span>Launch AI Scout Chat</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Right Column Interactive Chat Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E4E1D8] shadow-warm-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2E332B] flex items-center justify-center text-[#B08D57] font-bold text-xs">
                  AI
                </div>
                <div>
                  <span className="text-sm font-bold text-[#20221F] block">AI Scout Assistant</span>
                  <span className="text-[10px] font-semibold text-[#7A8B5A] block">● ONLINE • MATCH ENGINE</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#6F716B] uppercase tracking-wider block">
                SUGGESTED TACTICAL PROMPTS
              </span>

              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={onOpenAIAssistant}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#EFEEE8]/60 hover:bg-[#EFEEE8] border border-[#E4E1D8] text-xs font-semibold text-[#20221F] transition-all flex items-center justify-between group"
                >
                  <span>"{prompt}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7A8B5A] group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
