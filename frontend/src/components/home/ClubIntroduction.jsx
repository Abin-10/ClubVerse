import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Flame, Star, Sparkles, Heart, Award, CheckCircle2 } from 'lucide-react';

export default function ClubIntroduction() {
  const pillars = [
    {
      title: "La Masia Youth Excellence",
      description: "Our academy nurtures emerging talents with positional awareness, press-resistance, and teamwork values.",
      icon: Star,
      tag: "YOUTH ACADEMY"
    },
    {
      title: "Tactical Identity & Style",
      description: "High-pressing, possession-dominant football designed to entertain supporters and dominate tournament play.",
      icon: Flame,
      tag: "MATCH IDENTITY"
    },
    {
      title: "Sports Science & Analytics",
      description: "Integrating real-time biomechanics, workload tracking, and tactical AI scout recommendations.",
      icon: Shield,
      tag: "PERFORMANCE TECH"
    }
  ];

  return (
    <section id="introduction" className="py-24 bg-[#EFEEE8] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest shadow-warm-sm">
            <Shield className="w-4 h-4 text-[#7A8B5A]" />
            <span>CLUB ETHOS & PHILOSOPHY</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
            Built on Heritage. Powered by Innovation.
          </h2>
          
          <p className="text-base text-[#6F716B] font-medium leading-relaxed max-w-2xl mx-auto">
            ClubVerse combines over a century of traditional footballing values with modern sports technology to create a seamless environment for players, coaches, and supporters.
          </p>
        </div>

        {/* Pillars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-[#FFFDF8] rounded-3xl p-8 border border-[#E4E1D8] shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7A8B5A]/15 text-[#7A8B5A] flex items-center justify-center">
                  <pillar.icon className="w-6 h-6 text-[#7A8B5A]" />
                </div>

                <span className="text-[10px] font-extrabold text-[#B08D57] uppercase tracking-widest block">
                  {pillar.tag}
                </span>

                <h3 className="text-2xl font-semibold text-[#20221F] font-serif">
                  {pillar.title}
                </h3>

                <p className="text-xs text-[#6F716B] leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E4E1D8] flex items-center gap-2 text-xs font-bold text-[#7A8B5A]">
                <CheckCircle2 className="w-4 h-4 text-[#7A8B5A]" />
                <span>Official Club Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
