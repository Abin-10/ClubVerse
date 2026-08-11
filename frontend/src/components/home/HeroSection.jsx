import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Ticket, 
  ShieldCheck, 
  ArrowUpRight, 
  Users,
  Camera
} from 'lucide-react';

export default function HeroSection({ onOpenAIAssistant }) {
  const containerRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // High-Resolution Football Related Matchday Images
  const matchdayImages = [
    {
      url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop&q=80",
      caption: "Official Matchday Ball on Pitch Turf",
      tag: "PITCH ACTION"
    },
    {
      url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80",
      caption: "Spotify Arena Under Floodlights",
      tag: "STADIUM ATMOSPHERE"
    },
    {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80",
      caption: "Packed Arena Stand & Fans Celebrating",
      tag: "MATCHDAY CROWD"
    }
  ];

  // 3-second automatic slideshow transition
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % matchdayImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [matchdayImages.length]);

  // Framer Motion Scroll-Driven Parallax Effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const scrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activePhoto = matchdayImages[activeImageIndex];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[92vh] pt-28 pb-20 bg-[#F7F5EF] overflow-hidden flex items-center justify-center font-sans border-b border-[#E4E1D8]"
    >
      
      {/* Soft Decorative Ambient Circles */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#EFEEE8] rounded-full blur-3xl pointer-events-none opacity-80"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#E4E1D8]/60 rounded-full blur-3xl pointer-events-none opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <motion.div 
            style={{ y: textY, opacity: opacityFade }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            
            {/* Club Pill Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] shadow-warm-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#7A8B5A]" />
              <span className="text-xs font-extrabold uppercase tracking-widest font-sans">
                MODERN FOOTBALL CLUB PLATFORM
              </span>
            </motion.div>

            {/* Main Headline with Serif Elegance */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#20221F] tracking-tight font-serif leading-[1.1]">
                The Art of Modern <br />
                <span className="italic font-serif text-[#7A8B5A] font-normal">Football</span> Management.
              </h1>
              <p className="text-base sm:text-lg text-[#6F716B] max-w-xl font-medium pt-2 leading-relaxed font-sans">
                Experience next-generation squad analytics, static matchday pass tiers, tactical AI insights, and fan community engagement tailored for professional football clubs.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const el = document.getElementById('matches');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-4 rounded-2xl font-bold text-xs text-white bg-[#7A8B5A] hover:bg-[#627146] shadow-warm-md flex items-center gap-2.5 transition-all"
              >
                <span>Explore Club</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToTickets}
                className="px-6 py-4 rounded-2xl font-bold text-xs text-[#20221F] bg-[#FFFDF8] border border-[#E4E1D8] hover:bg-[#EFEEE8] shadow-warm-sm flex items-center gap-2.5 transition-all"
              >
                <Ticket className="w-4 h-4 text-[#B08D57]" />
                <span>Matchday Passes</span>
              </motion.button>

              <button 
                onClick={onOpenAIAssistant}
                className="px-5 py-4 rounded-2xl font-bold text-xs text-[#6F716B] hover:text-[#20221F] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#7A8B5A]" />
                <span>Ask AI Scout</span>
              </button>
            </motion.div>

            {/* Key Club Metrics Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E4E1D8]/80 max-w-lg"
            >
              <div>
                <span className="text-2xl font-bold text-[#20221F] font-serif block">28+</span>
                <span className="text-[11px] font-semibold text-[#6F716B] uppercase tracking-wider block">League Titles</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#20221F] font-serif block">98k</span>
                <span className="text-[11px] font-semibold text-[#6F716B] uppercase tracking-wider block">Arena Capacity</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#7A8B5A] font-serif block">100%</span>
                <span className="text-[11px] font-semibold text-[#6F716B] uppercase tracking-wider block">Fan Trust</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Hero Visual with Scroll Parallax Effect & Football Related Matchday Images */}
          <div className="lg:col-span-5 relative">
            
            <motion.div 
              style={{ y: imageY, scale: imageScale }}
              className="relative rounded-3xl overflow-hidden bg-[#FFFDF8] border border-[#E4E1D8] shadow-warm-lg"
            >
              {/* Main Football Visual */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEEE8]">
                
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activePhoto.url}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    src={activePhoto.url} 
                    alt={activePhoto.caption} 
                    className="w-full h-full object-cover filter brightness-95 contrast-105"
                  />
                </AnimatePresence>
                
                {/* Subtle Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#20221F]/70 via-transparent to-transparent"></div>

                {/* Floating MATCHDAY MODE Badge & View Switcher */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <div className="bg-[#FFFDF8]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4E1D8] shadow-warm-sm">
                    <span className="text-[11px] font-bold text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7A8B5A] animate-pulse"></span>
                      MATCHDAY MODE
                    </span>
                  </div>

                  {/* Image View Selector Chips */}
                  <div className="flex items-center gap-1 bg-[#2E332B]/80 backdrop-blur-md p-1 rounded-full border border-white/20">
                    {matchdayImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeImageIndex === idx 
                            ? 'bg-[#B08D57] scale-125' 
                            : 'bg-white/40 hover:bg-white'
                        }`}
                        title={img.tag}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Photo Caption */}
                <div className="absolute bottom-5 left-6 right-6 text-white space-y-1 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D57] block">
                    {activePhoto.tag}
                  </span>
                  <h3 className="text-2xl font-semibold font-serif leading-tight">
                    {activePhoto.caption}
                  </h3>
                </div>
              </div>

              {/* Bottom Info Strip inside Card */}
              <div className="p-5 bg-[#FFFDF8] border-t border-[#E4E1D8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7A8B5A]/15 text-[#7A8B5A] flex items-center justify-center font-bold">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#20221F] block">Next Matchday</span>
                    <span className="text-[10px] font-medium text-[#6F716B] block">La Liga • May 12</span>
                  </div>
                </div>

                <button
                  onClick={scrollToTickets}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#20221F] bg-[#EFEEE8] hover:bg-[#E4E1D8] transition-colors flex items-center gap-1"
                >
                  <span>Passes</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7A8B5A]" />
                </button>
              </div>

            </motion.div>

            {/* Floating Card Accent */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#FFFDF8] p-4 rounded-2xl border border-[#E4E1D8] shadow-warm-md items-center gap-3.5 z-20 max-w-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2E332B] text-[#B08D57] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#20221F] block">Professional Roster</span>
                <span className="text-[10px] font-medium text-[#6F716B] block">First Team & Academy</span>
              </div>
            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}
