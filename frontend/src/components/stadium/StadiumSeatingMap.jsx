import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Lock, 
  Sparkles,
  Building
} from 'lucide-react';
import { STADIUM_STANDS, PRE_BOOKED_SEATS } from '../../data/stadiumData';

export default function StadiumSeatingMap({ 
  stadium, 
  selectedSeats = [], 
  onSeatToggle, 
  onClearSeats 
}) {
  const [activeStandId, setActiveStandId] = useState('block-a');
  const activeStand = STADIUM_STANDS.find(s => s.id === activeStandId) || STADIUM_STANDS[1];

  const totalSubtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  // Helper to generate seat key
  const getSeatKey = (standId, row, seat) => `${standId}-R${row}-S${seat}`;

  return (
    <div className="space-y-6 font-sans text-[#20221F]">
      
      {/* Stand Block Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STADIUM_STANDS.map((stand) => (
          <button
            key={stand.id}
            type="button"
            onClick={() => setActiveStandId(stand.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              activeStandId === stand.id 
                ? 'bg-[#20221F] text-[#FFFDF8] border-[#20221F] shadow-warm-md' 
                : 'bg-[#F7F5EF] text-[#20221F] border-[#E4E1D8] hover:border-[#7A8B5A]'
            }`}
          >
            {stand.name} (₹{stand.price.toLocaleString('en-IN')})
          </button>
        ))}
      </div>

      {/* DETAILED SEAT SELECTION CARD FOR ACTIVE STAND (Clean UI matching Screenshot 1) */}
      <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#E4E1D8] shadow-warm-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
          <div>
            <h4 className="font-serif font-black text-xl text-[#20221F]">{activeStand.name}</h4>
            <p className="text-xs text-[#6F716B]">Ticket Price: ₹{activeStand.price.toLocaleString('en-IN')} per seat</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black text-[#7A8B5A] uppercase">Active Sector</span>
            <div className="text-xs font-bold text-[#20221F]">Row 1 to Row {activeStand.rowCount}</div>
          </div>
        </div>

        {/* Seat Buttons Grid (Blue = Available, Red = Booked, Green = Selected) */}
        <div className="space-y-3 py-2 max-w-lg mx-auto">
          {Array.from({ length: activeStand.rowCount }).map((_, rIdx) => {
            const rowNum = rIdx + 1;
            return (
              <div key={rowNum} className="flex items-center justify-center gap-2">
                <span className="w-12 text-[11px] font-black text-[#6F716B] text-right mr-2">
                  Row {rowNum}
                </span>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {Array.from({ length: activeStand.seatPerRow }).map((_, sIdx) => {
                    const seatNum = sIdx + 1;
                    const seatKey = getSeatKey(activeStand.id, rowNum, seatNum);
                    
                    const isPreBooked = PRE_BOOKED_SEATS.includes(seatKey);
                    const isSelected = selectedSeats.some(s => s.key === seatKey);

                    return (
                      <button
                        key={seatKey}
                        type="button"
                        disabled={isPreBooked}
                        onClick={() => {
                          onSeatToggle({
                            key: seatKey,
                            standId: activeStand.id,
                            standName: activeStand.name,
                            row: rowNum,
                            seat: seatNum,
                            label: `${activeStand.name} R${rowNum}-S${seatNum}`,
                            price: activeStand.price
                          });
                        }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                          isPreBooked
                            ? 'bg-[#EF4444] text-white cursor-not-allowed border border-red-600 shadow-sm'
                            : isSelected
                            ? 'bg-[#22C55E] text-white font-black border border-green-600 scale-110 shadow-md ring-2 ring-green-300'
                            : 'bg-[#3B82F6] text-white hover:bg-blue-600 border border-blue-600 shadow-sm hover:scale-105'
                        }`}
                        title={isPreBooked ? `Row ${rowNum} Seat ${seatNum} - Booked (Red)` : isSelected ? `Selected (Green)` : `Row ${rowNum} Seat ${seatNum} - Available (Blue)`}
                      >
                        {isPreBooked ? '×' : seatNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* SELECTED SEATS SUMMARY BAR (Clean black banner matching Screenshot 1) */}
      <div className="p-4 rounded-2xl bg-[#20221F] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-md">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase text-[#BEF264]">Selected Seats Summary</span>
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {selectedSeats.length === 0 ? (
              <span className="text-xs text-white/50 italic">No seats selected yet. Click blue seats above.</span>
            ) : (
              selectedSeats.map(s => (
                <span key={s.key} className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/20">
                  {s.label} (₹{s.price.toLocaleString('en-IN')})
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {selectedSeats.length > 0 && (
            <button 
              type="button" 
              onClick={onClearSeats}
              className="text-xs font-bold text-red-400 hover:text-red-200 underline"
            >
              Clear All
            </button>
          )}
          <div className="text-right">
            <span className="text-[10px] text-white/70 block">Total Seats Subtotal</span>
            <div className="text-2xl font-serif font-black text-[#BEF264]">₹{totalSubtotal.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
