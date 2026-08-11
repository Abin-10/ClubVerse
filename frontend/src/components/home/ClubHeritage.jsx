import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Flame, Star, Sparkles, Heart, Award, CheckCircle } from 'lucide-react';

export default function ClubHeritage() {
  const trophies = [
    { title: "Champions League", count: "5", subtitle: "European Cups", icon: "🏆", color: "from-[#FFC72C] to-[#D49B00]" },
    { title: "La Liga Titles", count: "27", subtitle: "Spanish Champions", icon: "👑", color: "from-[#004D98] to-[#002D62]" },
    { title: "Copa del Rey", count: "31", subtitle: "King's Cup Kings", icon: "🥇", color: "from-[#8A002C] to-[#500019]" },
    { title: "Club World Cup", count: "3", subtitle: "World Champions", icon: "🌍", color: "from-[#FFC72C] to-[#FFE082]" }
  ];

  const pillars = [
    {
      title: "La Masia Philosophy",
      description: "Our world-renowned youth academy instills positional play, quick pass-and-move football, and humble values.",
      icon: Star,
      tag: "ACADEMY ETHOS"
    },
    {
      title: "Cruyffism & Tiki-Taka",
      description: "A footballing identity built on possession control, high pressing, creative freedom, and joyful attacking style.",
      icon: Flame,
      tag: "TACTICAL IDENTITY"
    },
    {
      title: "Barça Foundation",
      description: "Supporting vulnerable children worldwide through sports education, inclusion programs, and social impact.",
      icon: Heart,
      tag: "SOCIAL COMMITMENT"
    }
  ];

  return (
    <section id="heritage" className="py-24 bg-[#070e24] border-t border-white/10 relative overflow-hidden font-sans">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8A002C]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c152d] border border-[#FFC72C]/40 text-[#FFC72C] text-xs font-black uppercase tracking-widest">
            <Shield className="w-4 h-4 text-[#FFC72C]" />
            <span>MÉS QUE UN CLUB • OUR HERITAGE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display uppercase">
            TROPHY CABINET & LEGACY
          </h2>
          <p className="text-base text-slate-300 font-medium">
            Over a century of glory, unmatched football philosophy, and iconic moments defining global sports history.
          </p>
        </div>

        {/* Trophy Showcase Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trophies.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="bg-[#0c152d] rounded-3xl p-6 border border-white/10 hover:border-[#FFC72C]/50 shadow-2xl text-center relative overflow-hidden group"
            >
              {/* Top Emoji/Icon */}
              <div className="text-4xl mb-2">{item.icon}</div>
              
              {/* Number Count */}
              <span className="text-4xl sm:text-5xl font-black text-gradient-gold font-display block">
                {item.count}x
              </span>

              {/* Title */}
              <h3 className="text-base font-black text-white mt-1 font-display">
                {item.title}
              </h3>
              
              <span className="text-xs font-bold text-slate-400 block mt-0.5">
                {item.subtitle}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Club Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-gradient-to-b from-[#0c152d] to-[#050b18] rounded-3xl p-8 border border-white/10 hover:border-[#004D98]/80 shadow-2xl flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8A002C] to-[#004D98] flex items-center justify-center text-[#FFC72C] shadow-lg">
                  <pillar.icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-black text-[#FFC72C] uppercase tracking-widest block">
                  {pillar.tag}
                </span>

                <h3 className="text-2xl font-black text-white font-display">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-black text-[#FFC72C]">
                <CheckCircle className="w-4 h-4" />
                <span>Barça Official Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
