import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Plus, ArrowUpRight, CheckCircle2, Shield, CreditCard as CardIcon, X } from 'lucide-react';

export default function VirtualCardWidget() {
  const [balance, setBalance] = useState(6010.29);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(topUpAmount);
    if (!isNaN(val) && val > 0) {
      setBalance(prev => prev + val);
      setShowTopUpModal(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col lg:flex-row justify-between items-stretch gap-6"
      >
        {/* Left Side: Balance & Breakdown */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-xl text-[#20221F]">
              Virtual cards
            </h3>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Balance Stat */}
          <div>
            <span className="text-xs text-[#6F716B] font-medium">Total Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-[#20221F] font-serif">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-[#7A8B5A] font-bold">+$200.00</span>
            </div>
          </div>

          {/* Asset Split Breakdown Progress */}
          <div className="space-y-2 bg-[#F7F5EF] p-3.5 rounded-2xl border border-[#E4E1D8]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#20221F]">Dollar <span className="text-[#6F716B] font-normal">72%</span></span>
              <span className="text-[#20221F]">Tether <span className="text-[#6F716B] font-normal">28%</span></span>
            </div>
            <div className="w-full h-2.5 bg-[#EFEEE8] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#7A8B5A] rounded-l-full w-[72%]" />
              <div className="h-full bg-[#B08D57] rounded-r-full w-[28%]" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowTopUpModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7A8B5A] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top Up</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#EFEEE8] border border-[#E4E1D8] text-[#20221F] text-xs font-bold hover:bg-[#E4E1D8] transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </motion.button>
          </div>
        </div>

        {/* Right Side: Sleek Mint Green VISA Card */}
        <div className="w-full lg:w-72 flex flex-col justify-between">
          <motion.div 
            whileHover={{ scale: 1.02, rotate: -1 }}
            className="w-full bg-gradient-to-br from-[#DCFCE7] via-[#D1FAE5] to-[#A7F3D0] border border-[#6EE7B7] rounded-3xl p-5 shadow-warm-md flex flex-col justify-between h-48 relative overflow-hidden group cursor-pointer"
          >
            {/* Card Background Pattern Accent */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl" />

            {/* Top Row: VISA Logo */}
            <div className="flex items-center justify-between z-10">
              <span className="font-extrabold text-sm tracking-wider text-[#065F46] font-serif uppercase">
                ClubVerse VIP
              </span>
              <span className="font-black text-lg text-[#065F46] italic">
                VISA
              </span>
            </div>

            {/* Middle Row: Card Balance */}
            <div className="z-10 my-auto">
              <span className="text-[10px] text-[#047857] font-bold uppercase tracking-wider">Fan Card Balance</span>
              <div className="text-2xl font-black text-[#064E3B] font-serif">
                $390.00
              </div>
            </div>

            {/* Bottom Row: Card Details */}
            <div className="flex items-center justify-between z-10 text-[11px] font-mono font-bold text-[#065F46]">
              <span>•••• 5802</span>
              <span>09/28</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 max-w-sm w-full shadow-warm-lg space-y-5 relative"
            >
              <button 
                onClick={() => setShowTopUpModal(false)}
                className="absolute top-4 right-4 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7A8B5A] text-white flex items-center justify-center shadow-warm-sm">
                  <CardIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#20221F]">Top Up Fan Wallet</h3>
                  <p className="text-xs text-[#6F716B]">Add funds to purchase match passes</p>
                </div>
              </div>

              <form onSubmit={handleTopUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#20221F] mb-1">Enter Amount ($)</label>
                  <input 
                    type="number" 
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-[#20221F] font-bold focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  {['100', '250', '500', '1000'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                        topUpAmount === amt 
                          ? 'bg-[#20221F] text-white border-[#20221F]' 
                          : 'bg-[#F7F5EF] border-[#E4E1D8] text-[#20221F]'
                      }`}
                    >
                      +${amt}
                    </button>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#20221F] text-white font-bold text-xs shadow-warm-md"
                >
                  Confirm Top Up
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
