import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Trophy, Sparkles, Check, Flame } from 'lucide-react';

export default function FanPollWidget() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const options = [
    { id: 'opt1', label: 'ClubVerse Win (2-0)', votes: 68 },
    { id: 'opt2', label: 'Draw Match (1-1)', votes: 20 },
    { id: 'opt3', label: 'Rival Win (0-1)', votes: 12 },
  ];

  const handleVote = (id) => {
    setSelectedOption(id);
    setHasVoted(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-gradient-to-br from-[#20221F] via-[#2A2E26] to-[#1A1C18] text-[#FFFDF8] rounded-3xl p-6 shadow-warm-lg relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#7A8B5A]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-[#7A8B5A]/20 text-[#BEF264] border border-[#7A8B5A]/30">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-black text-lg text-white">Live Fan Match Vote</h3>
            <p className="text-[11px] text-[#A1A19A]">Who will score first in the Derby?</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F]">
          +50 Fan Points
        </span>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 z-10 my-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote(opt.id)}
              className={`w-full relative p-3 rounded-2xl border text-left flex items-center justify-between overflow-hidden transition-all ${
                isSelected 
                  ? 'border-[#BEF264] bg-[#7A8B5A]/30 shadow-warm-md' 
                  : 'border-[#3E423B] bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Animated Voting Bar Background */}
              {hasVoted && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${opt.votes}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute inset-0 opacity-20 ${isSelected ? 'bg-[#BEF264]' : 'bg-white'}`}
                />
              )}

              <span className="text-xs font-bold z-10 flex items-center gap-2">
                {isSelected && <Check className="w-3.5 h-3.5 text-[#BEF264]" />}
                {opt.label}
              </span>

              {hasVoted && (
                <span className="text-xs font-black text-[#BEF264] z-10">
                  {opt.votes}%
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-2.5 rounded-2xl bg-[#BEF264] text-[#20221F] text-xs font-black flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Sparkles className="w-4 h-4 fill-[#20221F]" />
            <span>Vote Recorded! +50 VIP Points Claimed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
