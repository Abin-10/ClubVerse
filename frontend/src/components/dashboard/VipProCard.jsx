import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, ShieldCheck, Star, Award, Zap } from 'lucide-react';

export default function VipProCard({ onLearnMore }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-[#FFFDF8] via-[#F7F5EF] to-[#EFECE1] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col justify-between overflow-hidden group min-h-[360px]"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-extrabold tracking-wide uppercase text-[#20221F] bg-[#FFFDF8]/90 px-3 py-1 rounded-full border border-[#E4E1D8] shadow-warm-sm">
            Pro Version
          </span>
          <button 
            onClick={() => setIsDismissed(true)}
            className="text-[#6F716B] hover:text-[#20221F] p-1 rounded-full hover:bg-black/5 transition-colors"
            title="Dismiss Card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated 3D Floating Crystal / Ethereum Gem Graphic */}
        <div className="relative my-4 flex items-center justify-center py-4">
          {/* Ambient Glow */}
          <div className="absolute w-36 h-36 bg-gradient-to-tr from-[#7A8B5A]/30 to-[#B08D57]/30 rounded-full blur-2xl animate-pulse" />

          {/* Floating Diamond/Crystal Graphic */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotateY: [0, 180, 360],
              rotateX: [0, 10, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-28 h-32 flex items-center justify-center drop-shadow-2xl cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-[#7A8B5A] via-[#9AB074] to-[#B08D57] transform rotate-45 rounded-2xl border-2 border-white/80 shadow-2xl flex items-center justify-center">
              <div className="transform -rotate-45 flex flex-col items-center">
                <Sparkles className="w-10 h-10 text-white drop-shadow" />
                <span className="text-[10px] font-black text-white tracking-widest uppercase mt-1">VIP</span>
              </div>
            </div>
            {/* Holographic Badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#20221F] text-white p-1.5 rounded-full border-2 border-white shadow-lg">
              <Zap className="w-3.5 h-3.5 text-[#B08D57]" />
            </div>
          </motion.div>
        </div>

        {/* Card Body & Advantages */}
        <div className="z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-black text-xl text-[#20221F]">
                Advantages
              </h3>
              <p className="text-xs text-[#6F716B]">
                Your earnings with the pro version
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7A8B5A]/20 text-[#627146] border border-[#7A8B5A]/30">
              15 Days Left
            </span>
          </div>

          {/* Learn More Action Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <motion.button 
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all shadow-warm-sm group"
            >
              <span>Learn more</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          </div>
          <p className="text-[10px] text-center text-[#6F716B] pt-1">
            Join the elite of the fan world with Pro Version
          </p>
        </div>
      </motion.div>

      {/* Pro Details Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-warm-lg space-y-6 relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#7A8B5A] text-white flex items-center justify-center shadow-warm-md">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#20221F]">Pro Version Unlocked</h3>
                  <p className="text-xs text-[#6F716B]">Exclusive ClubVerse Member Tier</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Priority Stadium Tunnel & Locker Room Access',
                  '2x Fan Reward Multipliers on Match Day Bets & Polls',
                  'Exclusive Digital Collectibles & NFT Player Cards',
                  'Direct AI Match Tactical Assistant Consultations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
                    <ShieldCheck className="w-5 h-5 text-[#7A8B5A] flex-shrink-0" />
                    <span className="text-xs font-bold text-[#20221F]">{item}</span>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-full bg-[#20221F] text-white font-bold text-sm shadow-warm-md"
              >
                Activate VIP Pass
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
