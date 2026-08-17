import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpRight, ShoppingBag, Wallet } from 'lucide-react';

export default function SpendingChartCard() {
  const [activePoint, setActivePoint] = useState(4); // Friday

  const graphPoints = [
    { day: 'Mon', x: 20, y: 110, val: 320 },
    { day: 'Tue', x: 90, y: 130, val: 280 },
    { day: 'Wed', x: 160, y: 90, val: 510 },
    { day: 'Thu', x: 230, y: 120, val: 410 },
    { day: 'Fri', x: 300, y: 40, val: 820.65, label: 'LMCO' },
    { day: 'Sat', x: 370, y: 80, val: 640 },
    { day: 'Sun', x: 440, y: 100, val: 520 },
  ];

  const activeObj = graphPoints[activePoint];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col justify-between"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-black text-xl text-[#20221F]">
            Total Spent
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs text-[#6F716B]">Spent this week</span>
            <span className="font-extrabold text-2xl text-[#20221F] font-serif">
              ₹{activeObj.val.toFixed(2)}
            </span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F]"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Sub Stats Row */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EFEEE8] flex items-center justify-center text-xs font-black text-[#20221F]">
            10
          </div>
          <span className="text-xs text-[#6F716B] font-bold">Passes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EFEEE8] flex items-center justify-center text-xs font-black text-[#20221F]">
            26
          </div>
          <span className="text-xs text-[#6F716B] font-bold">Assets</span>
        </div>
      </div>

      {/* SVG Smooth Curve Line Chart */}
      <div className="relative w-full h-44 pt-4">
        <svg viewBox="0 0 460 150" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7A8B5A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7A8B5A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill under curve */}
          <path 
            d="M 20 110 Q 90 130 160 90 T 300 40 T 440 100 L 440 150 L 20 150 Z" 
            fill="url(#chartGradient)" 
          />

          {/* Smooth Line */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M 20 110 Q 90 130 160 90 T 300 40 T 440 100" 
            fill="none" 
            stroke="#20221F" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Data Nodes */}
          {graphPoints.map((pt, idx) => (
            <g key={pt.day} className="cursor-pointer" onClick={() => setActivePoint(idx)}>
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r={activePoint === idx ? "7" : "4"} 
                fill={activePoint === idx ? "#BEF264" : "#20221F"} 
                stroke={activePoint === idx ? "#20221F" : "none"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip Pill for Active Point */}
        <motion.div 
          animate={{ 
            left: `${(activeObj.x / 460) * 100}%`,
            top: `${(activeObj.y / 150) * 100 - 35}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute -translate-x-1/2 bg-[#BEF264] text-[#365314] text-[10px] font-black px-2.5 py-1 rounded-full shadow-warm-sm border border-[#A3E635] flex items-center gap-1 pointer-events-none"
        >
          <span>{activeObj.label || 'SPENT'}</span>
          <span>₹{activeObj.val}</span>
        </motion.div>

        {/* Days X Axis */}
        <div className="flex justify-between px-2 text-[10px] font-bold text-[#6F716B] mt-2">
          {graphPoints.map((pt, idx) => (
            <span 
              key={pt.day} 
              onClick={() => setActivePoint(idx)}
              className={`cursor-pointer transition-colors ${activePoint === idx ? 'text-[#20221F] font-black' : ''}`}
            >
              {pt.day}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
