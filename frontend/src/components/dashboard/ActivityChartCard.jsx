import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, TrendingUp, Calendar } from 'lucide-react';

export default function ActivityChartCard() {
  const [selectedDay, setSelectedDay] = useState('Fri');

  const daysData = [
    { day: 'Mon', hours: 18, height: '40%' },
    { day: 'Tue', hours: 24, height: '55%' },
    { day: 'Wed', hours: 20, height: '45%' },
    { day: 'Thu', hours: 32, height: '70%' },
    { day: 'Fri', hours: 42, height: '92%', highlight: true },
    { day: 'Sat', hours: 28, height: '60%' },
    { day: 'Sun', hours: 22, height: '50%' },
  ];

  const activeDayObj = daysData.find(d => d.day === selectedDay) || daysData[4];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md flex flex-col justify-between"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-black text-xl text-[#20221F]">
            Activity
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#6F716B]">Worked this week</span>
            <span className="font-extrabold text-2xl text-[#20221F]">186h</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D9F99D] text-[#365314] border border-[#BEF264]">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F]"
          title="Adjust Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-12 pb-2 px-2 flex items-end justify-between gap-2 h-52">
        {daysData.map((item) => {
          const isSelected = selectedDay === item.day;
          return (
            <div 
              key={item.day} 
              onClick={() => setSelectedDay(item.day)}
              className="flex-1 flex flex-col items-center gap-2 cursor-pointer group h-full justify-end"
            >
              {/* Floating Tooltip for Selected/Hovered Bar */}
              {isSelected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -top-2 bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-[10px] font-black px-2.5 py-1 rounded-full shadow-warm-sm flex items-center gap-1 pointer-events-none"
                >
                  <Calendar className="w-3 h-3" />
                  {item.hours}h Fan Time
                </motion.div>
              )}

              {/* Bar Outer Track */}
              <div className="w-full bg-[#EFEEE8] rounded-full h-full max-h-[140px] flex items-end p-1 relative overflow-hidden">
                {/* Bar Fill */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: item.height }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-t from-[#84CC16] to-[#BEF264] shadow-md' 
                      : 'bg-[#D4D0C5] group-hover:bg-[#7A8B5A]'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span className={`text-xs font-bold transition-colors ${
                isSelected ? 'text-[#20221F] font-black' : 'text-[#6F716B] group-hover:text-[#20221F]'
              }`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
