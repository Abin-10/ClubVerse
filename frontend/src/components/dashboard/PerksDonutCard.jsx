import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Award, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function PerksDonutCard() {
  const [selectedSegment, setSelectedSegment] = useState('Matchday VIP');

  const segments = [
    { name: 'Matchday VIP', percentage: 86, color: '#22D3EE', label: '86%' },
    { name: 'Merch Perks', percentage: 10, color: '#38BDF8', label: '10%' },
    { name: 'Hospitality', percentage: 4, color: '#FACC15', label: '4%' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif font-black text-xl text-[#20221F]">
          Contract Type
        </h3>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F]"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative flex items-center justify-center my-4 py-2">
        <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
          {/* Main 86% Segment */}
          <motion.circle 
            initial={{ strokeDasharray: "0 314" }}
            animate={{ strokeDasharray: "270 314" }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx="80" 
            cy="80" 
            r="50" 
            fill="none" 
            stroke="#A5F3FC" 
            strokeWidth="24" 
            strokeDashoffset="0"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedSegment('Matchday VIP')}
          />
          {/* 10% Segment */}
          <motion.circle 
            initial={{ strokeDasharray: "0 314" }}
            animate={{ strokeDasharray: "31 314" }}
            transition={{ duration: 1, delay: 0.3 }}
            cx="80" 
            cy="80" 
            r="50" 
            fill="none" 
            stroke="#7DD3FC" 
            strokeWidth="24" 
            strokeDashoffset="-272"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedSegment('Merch Perks')}
          />
          {/* 4% Segment */}
          <motion.circle 
            initial={{ strokeDasharray: "0 314" }}
            animate={{ strokeDasharray: "13 314" }}
            transition={{ duration: 1, delay: 0.5 }}
            cx="80" 
            cy="80" 
            r="50" 
            fill="none" 
            stroke="#FEF08A" 
            strokeWidth="24" 
            strokeDashoffset="-304"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedSegment('Hospitality')}
          />
        </svg>

        {/* Center Donut Label */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-[#20221F] font-serif">86%</span>
          <span className="text-[10px] text-[#6F716B] font-extrabold uppercase">VIP Tier</span>
        </div>
      </div>

      {/* Legend & Sub-Metrics */}
      <div className="pt-2 border-t border-[#E4E1D8] grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <div className="text-sm font-black text-[#20221F]">140</div>
          <div className="text-[10px] text-[#6F716B] font-bold">Milestone</div>
        </div>

        <div className="p-2 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <div className="text-sm font-black text-[#20221F]">48</div>
          <div className="text-[10px] text-[#6F716B] font-bold">Bonuses</div>
        </div>

        <div className="p-2 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
          <div className="text-sm font-black text-[#20221F]">16</div>
          <div className="text-[10px] text-[#6F716B] font-bold">Hourly</div>
        </div>
      </div>
    </motion.div>
  );
}
