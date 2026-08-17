import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Ticket,
  Info
} from 'lucide-react';

/*
 * 250-SEAT STADIUM CONFIGURATION MATCHING REFERENCE IMAGE (LIGHT GLASSMORPHISM THEME)
 * ──────────────────────────────────────────────────────────────────────────────────
 * 🔴 VIP Seats: 50 seats total (25 North Stand, 25 South Stand @ ₹5,000 each)
 * 🔵 4 Side Prime: 120 seats total (30 seats on North, South, East, West @ ₹3,000 each)
 * 🟢 4 Side Regular: 80 seats total (20 seats on North, South, East, West @ ₹1,000 each)
 * TOTAL = 250 SEATS
 */

const SEAT_PRICES = {
  VIP: 5000,
  PRIME: 3000,
  REGULAR: 1000
};

function generateStadiumSeats(prices = { VIP: 5000, PRIME: 3000, REGULAR: 1000 }) {
  const seats = [];

  const addSeats = (stand, category, code, startRow, rowCount, seatPerRow, price) => {
    for (let r = 0; r < rowCount; r++) {
      const rowNum = startRow + r;
      for (let s = 0; s < seatPerRow; s++) {
        const seatNum = s + 1;
        const id = `${code}-${stand.slice(0, 1).toUpperCase()}-R${rowNum}-S${seatNum}`;
        seats.push({
          id,
          stand,
          category,
          code,
          row: rowNum,
          seat: seatNum,
          price
        });
      }
    }
  };

  // 🔴 VIP SEATS (50 Seats Total) — Split 25 in North Stand, 25 in South Stand
  addSeats('NORTH', 'VIP', 'VIP', 1, 1, 25, prices.VIP);
  addSeats('SOUTH', 'VIP', 'VIP', 1, 1, 25, prices.VIP);

  // 🔵 4 SIDE PRIME (120 Seats) — 30 seats on each side
  addSeats('SOUTH', 'PRIME', 'PRIME-S', 3, 2, 15, prices.PRIME);
  addSeats('NORTH', 'PRIME', 'PRIME-N', 1, 2, 15, prices.PRIME);
  addSeats('EAST', 'PRIME', 'PRIME-E', 1, 2, 15, prices.PRIME);
  addSeats('WEST', 'PRIME', 'PRIME-W', 1, 2, 15, prices.PRIME);

  // 🟢 4 SIDE REGULAR (80 Seats) — 20 seats on each side
  addSeats('SOUTH', 'REGULAR', 'REGULAR-S', 5, 2, 10, prices.REGULAR);
  addSeats('NORTH', 'REGULAR', 'REGULAR-N', 3, 2, 10, prices.REGULAR);
  addSeats('EAST', 'REGULAR', 'REGULAR-E', 3, 2, 10, prices.REGULAR);
  addSeats('WEST', 'REGULAR', 'REGULAR-W', 3, 2, 10, prices.REGULAR);

  return seats;
}

const DEMO_BOOKED_SEATS = ['VIP-S-R1-S4', 'VIP-S-R1-S5', 'PRIME-N-R1-S8', 'REGULAR-E-R1-S2'];

export default function Stadium3DView({
  selectedSeats = [],
  onSeatToggle,
  onClearSeats,
  onProceed,
  onBack,
  bookedSeatIds = DEMO_BOOKED_SEATS,
  stadiumName = 'Campnow',
  stadium,
  seatingTiers
}) {
  const [viewMode, setViewMode] = useState('3d');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Dynamically extract seating tiers from database props
  const tierConfig = useMemo(() => {
    const tiers = seatingTiers || stadium?.seating_tiers || stadium?.seatingTiers || [];

    const vipTier = tiers.find(t => t.name?.toLowerCase().includes('vip')) || tiers[0] || {};
    const primeTier = tiers.find(t => t.name?.toLowerCase().includes('prime')) || tiers[1] || {};
    const regularTier = tiers.find(t => t.name?.toLowerCase().includes('regular')) || tiers[2] || {};

    const vipPrice = vipTier.price !== undefined && vipTier.price !== null ? Number(vipTier.price) : 5000;
    const primePrice = primeTier.price !== undefined && primeTier.price !== null ? Number(primeTier.price) : 3000;
    const regularPrice = regularTier.price !== undefined && regularTier.price !== null ? Number(regularTier.price) : 1000;

    return {
      prices: {
        VIP: vipPrice,
        PRIME: primePrice,
        REGULAR: regularPrice
      },
      vipName: vipTier.name || 'VIP Seats',
      primeName: primeTier.name || '4 Side Prime',
      regularName: regularTier.name || '4 Side Regular',
      vipInfo: vipTier.seats_info || '50 Seats (25 North / 25 South)',
      primeInfo: primeTier.seats_info || '30 Seats Each Side (Total 120 Seats)',
      regularInfo: regularTier.seats_info || '20 Seats Each Side (Total 80 Seats)'
    };
  }, [seatingTiers, stadium]);

  const allSeats = useMemo(() => {
    return generateStadiumSeats(tierConfig.prices);
  }, [tierConfig.prices]);

  const totalSubtotal = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const seatsByStandAndCategory = useMemo(() => {
    const map = {
      NORTH: { VIP: [], PRIME: [], REGULAR: [] },
      SOUTH: { VIP: [], PRIME: [], REGULAR: [] },
      EAST: { PRIME: [], REGULAR: [] },
      WEST: { PRIME: [], REGULAR: [] }
    };
    allSeats.forEach(seat => {
      if (map[seat.stand] && map[seat.stand][seat.category]) {
        map[seat.stand][seat.category].push(seat);
      }
    });
    return map;
  }, [allSeats]);

  const getSeatColors = (seat) => {
    const isBooked = bookedSeatIds.includes(seat.id);
    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isBooked) {
      return {
        bg: '#D1D5DB',
        border: '#9CA3AF',
        shadow: 'none',
        cursor: 'not-allowed',
        opacity: 0.45
      };
    }

    if (isSelected) {
      return {
        bg: '#22C55E',
        border: '#15803D',
        shadow: '0 0 12px rgba(34,197,94,0.8)',
        cursor: 'pointer',
        opacity: 1
      };
    }

    if (seat.category === 'VIP') {
      return { bg: '#EF4444', border: '#DC2626', shadow: '0 2px 6px rgba(239,68,68,0.3)', cursor: 'pointer', opacity: 0.95 };
    } else if (seat.category === 'PRIME') {
      return { bg: '#3B82F6', border: '#1D4ED8', shadow: '0 2px 6px rgba(59,130,246,0.3)', cursor: 'pointer', opacity: 0.95 };
    } else {
      return { bg: '#84CC16', border: '#4D7C0F', shadow: '0 2px 6px rgba(132,204,22,0.3)', cursor: 'pointer', opacity: 0.95 };
    }
  };

  const renderSeat = (seat) => {
    const isBooked = bookedSeatIds.includes(seat.id);
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    const style = getSeatColors(seat);

    return (
      <motion.button
        key={seat.id}
        type="button"
        disabled={isBooked}
        whileHover={{ scale: isBooked ? 1 : 1.3, zIndex: 30 }}
        whileTap={{ scale: isBooked ? 1 : 0.9 }}
        onClick={() => !isBooked && onSeatToggle(seat)}
        onMouseEnter={() => setHoveredSeat(seat)}
        onMouseLeave={() => setHoveredSeat(null)}
        style={{
          backgroundColor: style.bg,
          borderColor: style.border,
          boxShadow: style.shadow,
          opacity: style.opacity,
          cursor: style.cursor
        }}
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border transition-all duration-150 relative flex items-center justify-center ${
          isSelected ? 'ring-2 ring-[#20221F] z-20 scale-110' : ''
        }`}
        title={`${seat.id} • ${seat.category} • ₹${seat.price.toLocaleString('en-IN')}`}
      >
        {isSelected && (
          <span className="text-white text-[8px] font-black leading-none">✓</span>
        )}
      </motion.button>
    );
  };

  return (
    <div className={`w-full bg-[#FFFDF8]/90 backdrop-blur-xl text-[#20221F] font-sans flex flex-col justify-between overflow-hidden relative selection:bg-[#7A8B5A] selection:text-white ${
      isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#F7F5EF]' : 'p-3 sm:p-6 rounded-3xl border border-[#E4E1D8] shadow-warm-lg'
    }`}>
      
      {/* ── TOP NAVIGATION HEADER (LIGHT GLASSMORPHISM) ── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E1D8] z-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-md border border-[#E4E1D8] text-[#20221F] hover:bg-[#F7F5EF] transition-colors shadow-warm-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-lg sm:text-xl text-[#20221F] tracking-tight">
                Stadium Booking
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264]">
                Total Seats: 250
              </span>
            </div>
            <p className="text-xs text-[#6F716B] hidden sm:block">
              {stadiumName} • 3D Interactive Seating Map
            </p>
          </div>
        </div>

        {/* View Mode & Fullscreen Switchers */}
        <div className="flex items-center gap-2">
          {/* 3D vs Top View Pill Switcher */}
          <div className="bg-[#F0EEE6] p-1 rounded-2xl border border-[#E4E1D8] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-[#20221F] text-white shadow-warm-xs'
                  : 'text-[#6F716B] hover:text-[#20221F]'
              }`}
            >
              3D View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('top')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'top'
                  ? 'bg-[#20221F] text-white shadow-warm-xs'
                  : 'text-[#6F716B] hover:text-[#20221F]'
              }`}
            >
              Top View
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E4E1D8] text-[#20221F] hover:bg-[#F7F5EF] transition-colors hidden sm:block shadow-warm-xs"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 relative items-start">
        
        {/* LEFT SIDEBAR PANELS (LIGHT GLASSMORPHISM - STICKY STATIC) */}
        <div className="lg:col-span-3 space-y-4 z-20 lg:sticky lg:top-4 h-fit self-start">
          
          {/* Seat Categories Card */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E4E1D8] shadow-warm-md space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#20221F] border-b border-[#E4E1D8] pb-2">
              Seat Categories
            </h3>

            <div className="space-y-3.5">
              {/* VIP Category */}
              <div className="flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-[3px] bg-[#EF4444] border border-[#DC2626] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-[#20221F] flex items-center gap-1.5">
                    {tierConfig.vipName}
                    <span className="text-[10px] text-[#EF4444] font-bold">
                      ₹{tierConfig.prices.VIP.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6F716B] font-medium">{tierConfig.vipInfo}</div>
                </div>
              </div>

              {/* 4 Side Prime Category */}
              <div className="flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-[3px] bg-[#3B82F6] border border-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-[#20221F] flex items-center gap-1.5">
                    {tierConfig.primeName}
                    <span className="text-[10px] text-[#3B82F6] font-bold">
                      ₹{tierConfig.prices.PRIME.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6F716B] font-medium">
                    {tierConfig.primeInfo}
                  </div>
                </div>
              </div>

              {/* 4 Side Regular Category */}
              <div className="flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-[3px] bg-[#84CC16] border border-[#4D7C0F] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-[#20221F] flex items-center gap-1.5">
                    {tierConfig.regularName}
                    <span className="text-[10px] text-[#65A30D] font-bold">
                      ₹{tierConfig.prices.REGULAR.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6F716B] font-medium">
                    {tierConfig.regularInfo}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4E1D8] flex items-center justify-between text-xs">
              <span className="text-[#6F716B] font-semibold">Total Seats</span>
              <span className="font-serif font-black text-[#20221F] text-sm">250 Seats</span>
            </div>
          </div>

          {/* Your Selection Summary Card */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E4E1D8] shadow-warm-md space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#20221F] border-b border-[#E4E1D8] pb-2">
              Your Selection
            </h3>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#6F716B]">
                {selectedSeats.length} Seats Selected
              </div>
              <div className="text-2xl font-serif font-black text-[#20221F]">
                ₹{totalSubtotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Selected seats badge list */}
            {selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-1 custom-scrollbar">
                {selectedSeats.map(s => (
                  <span key={s.id} className="px-2 py-0.5 rounded-md bg-[#20221F] text-[#BEF264] text-[10px] font-bold">
                    {s.id}
                  </span>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: selectedSeats.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: selectedSeats.length === 0 ? 1 : 0.98 }}
              disabled={selectedSeats.length === 0}
              onClick={onProceed}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-warm-md ${
                selectedSeats.length > 0
                  ? 'bg-[#20221F] hover:bg-[#7A8B5A] text-white cursor-pointer'
                  : 'bg-[#E4E1D8] text-[#9CA3AF] cursor-not-allowed border border-[#D1D5DB]'
              }`}
            >
              <Ticket className="w-4 h-4" />
              {selectedSeats.length > 0 ? `Proceed (${selectedSeats.length} Seats)` : 'Select Seats'}
            </motion.button>
          </div>

        </div>

        {/* ── ISOMETRIC 3D / 2D CANVAS ARENA (LIGHT THEME) ── */}
        <div className="lg:col-span-9 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#F7F5EF] to-[#EBE8DE] border border-[#E4E1D8] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 min-h-[540px] shadow-inner">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e1d830_1px,transparent_1px),linear-gradient(to_bottom,#e4e1d830_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Interactive Transform View Wrapper */}
          <div
            className="transition-all duration-700 ease-out flex items-center justify-center w-full"
            style={{
              transform: `scale(${zoom}) ${
                viewMode === '3d' 
                  ? 'rotateX(52deg) rotateZ(-28deg) translateY(-20px)' 
                  : 'rotateX(0deg) rotateZ(0deg)'
              }`,
              transformStyle: 'preserve-3d',
              perspective: '1200px'
            }}
          >
            
            {/* STADIUM BOWL CONTAINER (LIGHT GLASSMORPHISM) */}
            <div className="relative p-8 rounded-[48px] bg-white/95 backdrop-blur-lg border-4 border-[#E4E1D8] shadow-warm-xl flex flex-col items-center justify-center space-y-6">
              
              {/* NORTH STAND (Top) */}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <span className="text-[10px] font-black tracking-widest text-[#20221F] uppercase">NORTH STAND</span>
                
                {/* Regular Tier (20 seats) */}
                <div className="bg-[#F7F5EF] p-2 rounded-xl border border-[#E4E1D8] space-y-1.5 text-center shadow-warm-xs">
                  <span className="text-[9px] font-extrabold text-[#65A30D] block uppercase tracking-wider">20 SEATS (Regular)</span>
                  <div className="flex flex-col gap-1.5 items-center">
                    {Array.from({ length: 2 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-1 justify-center">
                        {seatsByStandAndCategory.NORTH.REGULAR.slice(rIdx * 10, (rIdx + 1) * 10).map(renderSeat)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prime Tier (30 seats) */}
                <div className="bg-[#F7F5EF] p-2 rounded-xl border border-[#E4E1D8] space-y-1.5 text-center shadow-warm-xs">
                  <span className="text-[9px] font-extrabold text-[#2563EB] block uppercase tracking-wider">30 SEATS (Prime)</span>
                  <div className="flex flex-col gap-1.5 items-center">
                    {Array.from({ length: 2 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-1 justify-center">
                        {seatsByStandAndCategory.NORTH.PRIME.slice(rIdx * 15, (rIdx + 1) * 15).map(renderSeat)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🔴 25 VIP SEATS TIER (North Executive Tier) */}
                <div className="bg-[#FEF2F2] p-2.5 rounded-2xl border-2 border-[#EF4444]/40 space-y-1.5 text-center shadow-warm-sm ring-2 ring-[#EF4444]/10">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#DC2626]" />
                    <span className="text-[10px] font-black text-[#DC2626] uppercase tracking-wider">
                      VIP - 25 SEATS (₹{tierConfig.prices.VIP.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="flex gap-1 justify-center">
                      {seatsByStandAndCategory.NORTH.VIP.map(renderSeat)}
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: WEST STAND (Vertical) | PITCH | EAST STAND (Vertical) */}
              <div className="flex items-center justify-between gap-6 w-full">
                
                {/* WEST STAND (Left - Vertical Columns parallel to pitch) */}
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-widest text-[#20221F] uppercase [writing-mode:vertical-lr] rotate-180">
                      WEST STAND
                    </span>
                  </div>

                  {/* Outer Regular Tier (20 Seats Vertical) */}
                  <div className="bg-[#F7F5EF] p-1.5 sm:p-2 rounded-xl border border-[#E4E1D8] space-y-1 text-center shadow-warm-xs">
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-[#65A30D] block uppercase">20 SEATS</span>
                    <div className="flex flex-col gap-1 items-center">
                      {Array.from({ length: 10 }).map((_, rIdx) => (
                        <div key={rIdx} className="flex gap-1">
                          {seatsByStandAndCategory.WEST.REGULAR.slice(rIdx * 2, (rIdx + 1) * 2).map(renderSeat)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inner Prime Tier (30 Seats Vertical) */}
                  <div className="bg-[#F7F5EF] p-1.5 sm:p-2 rounded-xl border border-[#E4E1D8] space-y-1 text-center shadow-warm-xs">
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-[#2563EB] block uppercase">30 SEATS</span>
                    <div className="flex flex-col gap-1 items-center">
                      {Array.from({ length: 15 }).map((_, rIdx) => (
                        <div key={rIdx} className="flex gap-1">
                          {seatsByStandAndCategory.WEST.PRIME.slice(rIdx * 2, (rIdx + 1) * 2).map(renderSeat)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CENTRAL FOOTBALL PITCH (Lush Green with White Line Markings & Goals) */}
                <div className="w-[300px] sm:w-[380px] h-[220px] sm:h-[260px] bg-gradient-to-br from-[#15803D] via-[#16A34A] to-[#15803D] rounded-2xl border-4 border-white/90 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center flex-shrink-0">
                  
                  {/* Grass Stripes Pattern */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(255,255,255,0.06)_30px,rgba(255,255,255,0.06)_60px)] pointer-events-none" />

                  {/* Center Line & Circle */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/90 -translate-x-1/2" />
                  <div className="w-20 h-20 rounded-full border-2 border-white/90 absolute" />
                  <div className="w-2 h-2 rounded-full bg-white absolute" />

                  {/* Penalty Boxes & Goals Left/Right */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-24 border-2 border-l-0 border-white/90 flex items-center">
                    <div className="w-6 h-12 border-2 border-l-0 border-white/90" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white ml-2" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-24 border-2 border-r-0 border-white/90 flex items-center justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mr-2" />
                    <div className="w-6 h-12 border-2 border-r-0 border-white/90" />
                  </div>

                  {/* Corner Arcs */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-b-2 border-white/90 rounded-br-full" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-l-2 border-b-2 border-white/90 rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-r-2 border-t-2 border-white/90 rounded-tr-full" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-l-2 border-t-2 border-white/90 rounded-tl-full" />

                  {/* Center Pitch Text */}
                  <span className="text-white font-serif font-black text-xs tracking-widest uppercase z-10 drop-shadow-md px-2 text-center">
                    {stadiumName ? `${stadiumName}` : 'CAMPNOW PITCH'}
                  </span>
                </div>

                {/* EAST STAND (Right - Vertical Columns parallel to pitch) */}
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                  {/* Inner Prime Tier (30 Seats Vertical) */}
                  <div className="bg-[#F7F5EF] p-1.5 sm:p-2 rounded-xl border border-[#E4E1D8] space-y-1 text-center shadow-warm-xs">
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-[#2563EB] block uppercase">30 SEATS</span>
                    <div className="flex flex-col gap-1 items-center">
                      {Array.from({ length: 15 }).map((_, rIdx) => (
                        <div key={rIdx} className="flex gap-1">
                          {seatsByStandAndCategory.EAST.PRIME.slice(rIdx * 2, (rIdx + 1) * 2).map(renderSeat)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outer Regular Tier (20 Seats Vertical) */}
                  <div className="bg-[#F7F5EF] p-1.5 sm:p-2 rounded-xl border border-[#E4E1D8] space-y-1 text-center shadow-warm-xs">
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-[#65A30D] block uppercase">20 SEATS</span>
                    <div className="flex flex-col gap-1 items-center">
                      {Array.from({ length: 10 }).map((_, rIdx) => (
                        <div key={rIdx} className="flex gap-1">
                          {seatsByStandAndCategory.EAST.REGULAR.slice(rIdx * 2, (rIdx + 1) * 2).map(renderSeat)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-widest text-[#20221F] uppercase [writing-mode:vertical-lr]">
                      EAST STAND
                    </span>
                  </div>
                </div>

              </div>

              {/* SOUTH STAND (Bottom - Includes 25 VIP Seats) */}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                
                {/* 🔴 25 VIP SEATS TIER (Main Executive Tier) */}
                <div className="bg-[#FEF2F2] p-2.5 rounded-2xl border-2 border-[#EF4444]/40 space-y-1.5 text-center shadow-warm-sm ring-2 ring-[#EF4444]/10">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#DC2626]" />
                    <span className="text-[10px] font-black text-[#DC2626] uppercase tracking-wider">
                      VIP - 25 SEATS (₹{tierConfig.prices.VIP.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="flex gap-1 justify-center">
                      {seatsByStandAndCategory.SOUTH.VIP.map(renderSeat)}
                    </div>
                  </div>
                </div>

                {/* Prime Tier (30 seats) */}
                <div className="bg-[#F7F5EF] p-2 rounded-xl border border-[#E4E1D8] space-y-1.5 text-center shadow-warm-xs">
                  <span className="text-[9px] font-extrabold text-[#2563EB] block uppercase tracking-wider">30 SEATS (Prime)</span>
                  <div className="flex flex-col gap-1.5 items-center">
                    {Array.from({ length: 2 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-1 justify-center">
                        {seatsByStandAndCategory.SOUTH.PRIME.slice(rIdx * 15, (rIdx + 1) * 15).map(renderSeat)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regular Tier (20 seats) */}
                <div className="bg-[#F7F5EF] p-2 rounded-xl border border-[#E4E1D8] space-y-1.5 text-center shadow-warm-xs">
                  <span className="text-[9px] font-extrabold text-[#65A30D] block uppercase tracking-wider">20 SEATS (Regular)</span>
                  <div className="flex flex-col gap-1.5 items-center">
                    {Array.from({ length: 2 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-1 justify-center">
                        {seatsByStandAndCategory.SOUTH.REGULAR.slice(rIdx * 10, (rIdx + 1) * 10).map(renderSeat)}
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] font-black tracking-widest text-[#20221F] uppercase">SOUTH STAND</span>
              </div>

            </div>

          </div>

          {/* Floating Hover Tooltip (Light Glassmorphism) */}
          <AnimatePresence>
            {hoveredSeat && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#E4E1D8] rounded-2xl p-3 shadow-warm-lg z-30 pointer-events-none text-[#20221F]"
              >
                <div className="text-xs font-black text-[#20221F]">{hoveredSeat.id}</div>
                <div className="text-[11px] text-[#6F716B] mt-0.5">
                  {hoveredSeat.stand} Stand • Row {hoveredSeat.row} • Seat {hoveredSeat.seat}
                </div>
                <div className="text-xs font-bold text-[#7A8B5A] mt-1">
                  ₹{hoveredSeat.price.toLocaleString('en-IN')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Right Zoom Controls (Light Glassmorphism) */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E4E1D8] flex items-center gap-1 shadow-warm-sm z-20">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))}
              className="p-2 rounded-xl text-[#20221F] hover:bg-[#F7F5EF] transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-2 rounded-xl text-[#20221F] hover:bg-[#F7F5EF] transition-colors"
              title="Reset Zoom (↺)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(z + 0.15, 1.8))}
              className="p-2 rounded-xl text-[#20221F] hover:bg-[#F7F5EF] transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ── BOTTOM LEGEND BAR (LIGHT GLASSMORPHISM) ── */}
      <div className="pt-4 border-t border-[#E4E1D8] flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex flex-wrap items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#E4E1D8] shadow-warm-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#EF4444] border border-[#DC2626]" />
            <span className="text-xs text-[#20221F] font-bold">VIP Seats (50: 25 North / 25 South)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#3B82F6] border border-[#1D4ED8]" />
            <span className="text-xs text-[#20221F] font-bold">4 Side Prime (120)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#84CC16] border border-[#4D7C0F]" />
            <span className="text-xs text-[#20221F] font-bold">4 Side Regular (80)</span>
          </div>
          <div className="w-px h-4 bg-[#E4E1D8]" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#22C55E] border border-[#15803D] ring-2 ring-[#20221F]" />
            <span className="text-xs text-[#20221F] font-black">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#D1D5DB] border border-[#9CA3AF] opacity-50" />
            <span className="text-xs text-[#6F716B] font-bold">Booked / Sold</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <button
            type="button"
            onClick={onClearSeats}
            className="text-xs font-bold text-red-600 hover:text-red-800 underline"
          >
            Clear Selected Seats
          </button>
        )}
      </div>

    </div>
  );
}
