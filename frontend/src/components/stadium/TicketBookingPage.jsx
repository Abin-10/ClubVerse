import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Calendar, MapPin, Clock, Swords, 
  ChevronRight, ChevronLeft, CheckCircle2, 
  ArrowLeft, Loader2, PartyPopper, Building, 
  Sparkles, ShieldCheck, Flame, Trophy, Lock 
} from 'lucide-react';
import CircularStadiumView from './CircularStadiumView';
import RazorpayPaymentModal from './RazorpayPaymentModal';
import { getTeamLogo, formatTimeTo12Hour, getBookingStatus, isPastFixture } from '../../utils/teamUtils';

const API = 'http://localhost:5000/api';

const DEFAULT_MOCK_FIXTURES = [
  {
    _id: 'fix-seed-1',
    home_team: { name: 'Manchester City', short_name: 'MCY', logo_color: '#00A3E0', logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80' },
    away_team: { name: 'ClubVerse FC', short_name: 'CVFC', logo_color: '#DC052D', logo_url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' },
    match_date: '2026-08-18T20:00:00.000Z',
    match_time: '8:00 PM GMT',
    venue: 'Campnow',
    status: 'Upcoming'
  },
  {
    _id: 'fix-seed-2',
    home_team: { name: 'ClubVerse FC', short_name: 'CVFC', logo_color: '#DC052D', logo_url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' },
    away_team: { name: 'Real Madrid', short_name: 'RMA', logo_color: '#FEBE10', logo_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80' },
    match_date: '2026-08-23T17:30:00.000Z',
    match_time: '5:30 PM GMT',
    venue: 'Campnow',
    status: 'Upcoming'
  },
  {
    _id: 'fix-seed-3',
    home_team: { name: 'FC Barcelona', short_name: 'FCB', logo_color: '#004D98', logo_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80' },
    away_team: { name: 'ClubVerse FC', short_name: 'CVFC', logo_color: '#DC052D', logo_url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' },
    match_date: '2026-08-30T19:00:00.000Z',
    match_time: '7:00 PM GMT',
    venue: 'Campnow',
    status: 'Upcoming'
  }
];

export default function TicketBookingPage({ currentUser, triggerToast }) {
  const [step, setStep] = useState(1); // 1: Select Fixture, 2: Select Seats, 3: Confirm, 4: Success
  const [fixtures, setFixtures] = useState(DEFAULT_MOCK_FIXTURES);
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  const handleConfirmBooking = () => {
    if (!selectedFixture || selectedSeats.length === 0) return;
    setShowRazorpayModal(true);
  };

  const handleRazorpayPaymentSuccess = async (paymentId, paymentMethod) => {
    setShowRazorpayModal(false);
    if (!selectedFixture || selectedSeats.length === 0) return;
    const user = currentUser || { name: 'Shup', email: 'shup@gmail.com', id: 'guest-user-1' };

    try {
      setBooking(true);
      const seatsPayload = selectedSeats.map(s => ({
        seat_number: s.seat_number || s.id,
        section: s.section || s.category || 'Regular',
        row: s.row || 1,
        seat: s.seat || 1,
        price: s.price
      }));

      const res = await fetch(`${API}/tickets/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fixture_id: selectedFixture._id,
          user_id: user.id || user._id || 'guest',
          user_name: user.name || user.full_name || 'Guest',
          user_email: user.email || '',
          payment_status: 'Paid',
          razorpay_payment_id: paymentId,
          seats: seatsPayload
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking recording failed');
      setBookingResult({ ...data, razorpay_payment_id: paymentId, payment_method: paymentMethod });
      setStep(4);
      triggerToast?.(`Payment Successful via Razorpay! ${data.tickets?.length || selectedSeats.length} seat(s) confirmed.`);
    } catch (err) {
      alert(err.message || 'Booking recording failed');
    } finally {
      setBooking(false);
    }
  };

  // Fetch live stadiums with seating tiers from MongoDB API
  const fetchStadiums = async () => {
    try {
      const res = await fetch(`${API}/stadiums`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.stadiums) && data.stadiums.length > 0) {
          setStadiums(data.stadiums);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch stadiums in TicketBookingPage:', err);
    }
  };

  useEffect(() => {
    fetchStadiums();
  }, []);

  // Fetch upcoming fixtures from MongoDB DB
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        let res = await fetch(`${API}/fixtures/upcoming`);
        if (res.ok) {
          let data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const valid = data.filter(f => !isPastFixture(f.match_date, f.match_time) && f.status !== 'Completed');
            if (valid.length > 0) {
              setFixtures(valid);
              return;
            }
          }
        }
        // Fallback to all fixtures if upcoming is empty
        res = await fetch(`${API}/fixtures`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const valid = data.filter(f => !isPastFixture(f.match_date, f.match_time) && f.status !== 'Completed');
            if (valid.length > 0) {
              setFixtures(valid);
              return;
            }
          }
        }
        setFixtures(DEFAULT_MOCK_FIXTURES);
      } catch (err) {
        console.warn('Failed to fetch fixtures, using defaults:', err);
        setFixtures(DEFAULT_MOCK_FIXTURES);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, []);

  // Match selected fixture's venue with database stadium
  const currentStadium = React.useMemo(() => {
    if (!selectedFixture) return null;
    const venueName = selectedFixture.venue || 'Campnow';
    const matched = stadiums.find(s => 
      (s.name && s.name.toLowerCase() === venueName.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(venueName.toLowerCase())) ||
      (venueName.toLowerCase().includes(s.name ? s.name.toLowerCase() : ''))
    );
    return matched || stadiums[0] || { name: venueName };
  }, [stadiums, selectedFixture]);

  // Fetch booked seats & refresh stadiums when fixture is selected
  useEffect(() => {
    if (!selectedFixture) return;
    fetchStadiums();
    const fetchBooked = async () => {
      try {
        const res = await fetch(`${API}/tickets/fixture/${selectedFixture._id}`);
        if (res.ok) {
          const tickets = await res.json();
          setBookedSeatIds(tickets.map(t => t.seat_number));
        }
      } catch (err) {
        console.warn('Failed to fetch booked seats:', err);
      }
    };
    fetchBooked();
  }, [selectedFixture]);

  const handleFixtureSelect = (fix) => {
    setSelectedFixture(fix);
    setSelectedSeats([]);
    fetchStadiums();
    setStep(2);
  };

  const handleSeatToggle = (seatData) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seatData.id);
      if (exists) return prev.filter(s => s.id !== seatData.id);
      return [...prev, seatData];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  };

  const STEP_TITLES = [
    { num: 1, name: 'Select Match' },
    { num: 2, name: '3D Seat Selection' },
    { num: 3, name: 'Confirm Booking' },
    { num: 4, name: 'Pass Issued' }
  ];

  return (
    <div className="space-y-6 font-sans selection:bg-[#7A8B5A] selection:text-white">
      
      {/* ── LUXURY PAGE HEADER & STEPPER ── */}
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {step > 1 && step < 4 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStep(s => s - 1); if (step === 2) setSelectedFixture(null); }}
              className="p-2.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] hover:bg-[#20221F] hover:text-white transition-colors shadow-warm-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#20221F] tracking-tight">
                {step === 1 && 'Book Match Tickets'}
                {step === 2 && 'Select Arena Seats'}
                {step === 3 && 'Confirm Reservation'}
                {step === 4 && 'Match Pass Ready!'}
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] border border-[#7A8B5A]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> OFFICIAL TICKETING
              </span>
            </div>
            <p className="text-xs text-[#6F716B] mt-0.5 font-medium">
              {step === 1 && 'Choose an upcoming fixture to access 3D seat reservation'}
              {step === 2 && `${selectedFixture?.home_team?.name} vs ${selectedFixture?.away_team?.name} • ${selectedFixture?.venue || 'Campnow'}`}
              {step === 3 && `Review ${selectedSeats.length} selected seat(s) & subtotal`}
              {step === 4 && 'Your official stadium pass has been generated'}
            </p>
          </div>
        </div>

        {/* Dynamic Glassmorphism Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-[#F7F5EF] p-2 rounded-2xl border border-[#E4E1D8]">
          {STEP_TITLES.map(({ num, name }) => {
            const isActive = num === step;
            const isCompleted = num < step;
            return (
              <div key={num} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#20221F] text-white shadow-warm-xs'
                    : isCompleted
                    ? 'bg-[#22C55E]/15 text-[#166534] border border-[#22C55E]/30'
                    : 'text-[#9CA3AF]'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-[#BEF264] text-[#20221F]'
                      : isCompleted
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#E4E1D8] text-[#6F716B]'
                  }`}>
                    {isCompleted ? '✓' : num}
                  </div>
                  <span className="hidden md:inline">{name}</span>
                </div>
                {num < 4 && <div className="w-3 sm:w-4 h-0.5 bg-[#E4E1D8]" />}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ── STEP 1: SELECT UPCOMING FIXTURE (EDITORIAL MATCHDAY CARDS) ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-56 text-[#6F716B] gap-3 bg-white/80 rounded-3xl border border-[#E4E1D8]">
                <Loader2 className="w-6 h-6 animate-spin text-[#7A8B5A]" />
                <span className="text-xs font-bold">Loading Upcoming Match Fixtures...</span>
              </div>
            ) : fixtures.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-56 text-[#6F716B] gap-2 bg-white/80 rounded-3xl border border-[#E4E1D8]">
                <Swords className="w-10 h-10 opacity-30 text-[#20221F]" />
                <span className="text-xs font-bold">No upcoming fixtures scheduled.</span>
              </div>
            ) : (
              fixtures.map((fix, i) => {
                const homeColor = fix.home_team?.logo_color || '#00A3E0';
                const awayColor = fix.away_team?.logo_color || '#DC052D';
                const bookingStatus = getBookingStatus(fix.match_date, fix.match_time, fix.status);
                const formattedTime = formatTimeTo12Hour(fix.match_time);

                return (
                  <motion.div
                    key={fix._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => bookingStatus.open && handleFixtureSelect(fix)}
                    style={{
                      background: `linear-gradient(135deg, rgba(255,253,248,0.95) 0%, rgba(247,245,239,0.9) 100%)`
                    }}
                    className={`p-6 rounded-3xl border border-[#E4E1D8] shadow-warm-md transition-all duration-300 relative overflow-hidden group ${
                      bookingStatus.open 
                        ? 'hover:shadow-warm-xl hover:border-[#7A8B5A] cursor-pointer hover:-translate-y-1' 
                        : 'opacity-90 bg-[#F9F8F3]'
                    }`}
                  >
                    {/* Subtle Team Dual-Tone Ambient Glow Background */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none transition-opacity group-hover:opacity-25"
                      style={{
                        background: `radial-gradient(circle at 10% 20%, ${homeColor}30 0%, transparent 50%), radial-gradient(circle at 90% 80%, ${awayColor}30 0%, transparent 50%)`
                      }}
                    />

                    {/* Top Match Badging Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E4E1D8]/80 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#BEF264]" /> MATCHDAY FIXTURE
                        </span>
                        <span className="text-[11px] font-extrabold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2.5 py-0.5 rounded-full border border-[#7A8B5A]/20">
                          Official Match Pass
                        </span>
                      </div>
                      
                      {bookingStatus.open ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#22C55E]">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                          250 SEATS AVAILABLE
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{bookingStatus.reason}</span>
                        </div>
                      )}
                    </div>

                    {/* Central Match VS Layout */}
                    <div className="grid grid-cols-12 items-center py-6 gap-4 relative z-10">
                      
                      {/* Home Team (Left Side) */}
                      <div className="col-span-5 flex items-center gap-4">
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-warm-md flex-shrink-0 ring-4 ring-white border-2 border-white/20 relative bg-white"
                          style={{ backgroundColor: homeColor }}
                        >
                          <img
                            src={getTeamLogo(fix.home_team)}
                            alt={fix.home_team?.name || 'Home Team'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-[#7A8B5A] tracking-wider uppercase block">HOME TEAM</span>
                          <h3 className="font-serif font-black text-lg sm:text-xl text-[#20221F] truncate group-hover:text-[#7A8B5A] transition-colors">
                            {fix.home_team?.name}
                          </h3>
                        </div>
                      </div>

                      {/* Versus Central Pill Badge */}
                      <div className="col-span-2 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#20221F] text-white flex items-center justify-center font-serif font-black text-xs sm:text-sm shadow-warm-md ring-4 ring-white border border-[#E4E1D8]">
                          VS
                        </div>
                        <span className="text-[9px] font-black text-[#6F716B] uppercase tracking-widest mt-1">MAIN ARENA</span>
                      </div>

                      {/* Away Team (Right Side) */}
                      <div className="col-span-5 flex items-center justify-end gap-4 text-right">
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-[#6F716B] tracking-wider uppercase block">AWAY TEAM</span>
                          <h3 className="font-serif font-black text-lg sm:text-xl text-[#20221F] truncate group-hover:text-[#7A8B5A] transition-colors">
                            {fix.away_team?.name}
                          </h3>
                        </div>
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-warm-md flex-shrink-0 ring-4 ring-white border-2 border-white/20 relative bg-white"
                          style={{ backgroundColor: awayColor }}
                        >
                          <img
                            src={getTeamLogo(fix.away_team)}
                            alt={fix.away_team?.name || 'Away Team'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Bottom Metadata Bar & Book Now Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E4E1D8]/80 relative z-10">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Match Date */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#20221F] bg-white px-3.5 py-1.5 rounded-xl border border-[#E4E1D8] shadow-warm-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
                          {formatDate(fix.match_date)}
                        </div>

                        {/* Kickoff Time */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#20221F] bg-white px-3.5 py-1.5 rounded-xl border border-[#E4E1D8] shadow-warm-xs">
                          <Clock className="w-3.5 h-3.5 text-[#7A8B5A]" />
                          {formattedTime}
                        </div>

                        {/* Stadium Name Badge */}
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#20221F] bg-[#7A8B5A]/15 px-3.5 py-1.5 rounded-xl border border-[#7A8B5A]/30">
                          <Building className="w-3.5 h-3.5 text-[#7A8B5A]" />
                          <span>Stadium: <span className="text-[#7A8B5A] font-black">{fix.venue || 'Campnow'}</span></span>
                        </div>
                      </div>

                      {/* Primary Book Now Action Button */}
                      <button
                        type="button"
                        disabled={!bookingStatus.open}
                        onClick={(e) => { e.stopPropagation(); if (bookingStatus.open) handleFixtureSelect(fix); }}
                        className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                          bookingStatus.open
                            ? 'bg-[#20221F] text-white hover:bg-[#7A8B5A] shadow-warm-md cursor-pointer'
                            : 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed shadow-none'
                        }`}
                      >
                        <Ticket className="w-4 h-4 text-[#BEF264]" />
                        <span>{bookingStatus.open ? 'Book Seats' : 'Booking Closed'}</span>
                        {bookingStatus.open && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </button>

                    </div>

                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ── STEP 2: SELECT SEATS (3D MAP) ── */}
        {step === 2 && selectedFixture && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Fixture Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white shadow-warm-md flex flex-wrap items-center justify-between gap-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden text-white font-serif font-black text-xs shadow-md border border-white/20 bg-white relative" style={{ backgroundColor: selectedFixture.home_team?.logo_color }}>
                  <img src={getTeamLogo(selectedFixture.home_team)} alt={selectedFixture.home_team?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-serif font-black text-base sm:text-lg block">
                    {selectedFixture.home_team?.name} vs {selectedFixture.away_team?.name}
                  </span>
                  <span className="text-xs font-bold text-[#BEF264] flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    Stadium Arena: {selectedFixture.venue || 'Campnow'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden text-white font-serif font-black text-xs shadow-md border border-white/20 bg-white relative" style={{ backgroundColor: selectedFixture.away_team?.logo_color }}>
                  <img src={getTeamLogo(selectedFixture.away_team)} alt={selectedFixture.away_team?.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="text-right text-xs">
                <div className="text-white/80 font-medium">{formatDate(selectedFixture.match_date)}</div>
                <div className="font-black text-[#BEF264] text-sm">{formatTimeTo12Hour(selectedFixture.match_time)}</div>
              </div>
            </div>

            {/* Circular Stadium 3D View */}
            <CircularStadiumView
              bookedSeatIds={bookedSeatIds}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              onClearSeats={() => setSelectedSeats([])}
              onProceed={() => setStep(3)}
              onBack={() => { setStep(1); setSelectedFixture(null); }}
              stadium={currentStadium}
            />

            {/* Floating Proceed Bar */}
            {selectedSeats.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setStep(3)}
                className="w-full py-4 rounded-2xl bg-[#20221F] hover:bg-[#7A8B5A] text-white font-black text-sm uppercase tracking-wider shadow-warm-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5 text-[#BEF264]" />
                Proceed to Checkout ({selectedSeats.length} Seats — ₹{totalPrice.toLocaleString('en-IN')})
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: CONFIRM RESERVATION ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-5"
          >
            {/* Booking Summary Card */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-[#E4E1D8] shadow-warm-md space-y-6">
              
              {/* Match Info Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E4E1D8]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden text-white font-serif font-black text-xs shadow-md border border-white/20 bg-white relative" style={{ backgroundColor: selectedFixture?.home_team?.logo_color }}>
                    <img src={getTeamLogo(selectedFixture?.home_team)} alt={selectedFixture?.home_team?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#20221F]">
                      {selectedFixture?.home_team?.name} vs {selectedFixture?.away_team?.name}
                    </h3>
                    <div className="text-xs text-[#6F716B] font-medium flex items-center gap-2 mt-0.5">
                      <span>{formatDate(selectedFixture?.match_date)} • {formatTimeTo12Hour(selectedFixture?.match_time)}</span>
                      <span>•</span>
                      <span className="font-bold text-[#7A8B5A]">{selectedFixture?.venue || 'Campnow'}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden text-white font-serif font-black text-xs shadow-md border border-white/20 bg-white relative" style={{ backgroundColor: selectedFixture?.away_team?.logo_color }}>
                  <img src={getTeamLogo(selectedFixture?.away_team)} alt={selectedFixture?.away_team?.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Selected Seats Breakdown */}
              <div>
                <h4 className="text-xs font-black text-[#20221F] mb-3 uppercase tracking-wider flex items-center justify-between">
                  <span>Selected Seats ({selectedSeats.length})</span>
                  <span className="text-[11px] text-[#7A8B5A] font-extrabold">All Seats in INR (₹)</span>
                </h4>
                
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedSeats.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-[4px] ${
                          (s.category === 'VIP' || s.section === 'VIP')
                            ? 'bg-[#EF4444]'
                            : (s.category === 'PRIME' || (s.section && s.section.startsWith('GOLD')))
                            ? 'bg-[#3B82F6]'
                            : 'bg-[#84CC16]'
                        }`} />
                        <span className="text-xs font-black text-[#20221F]">{s.id}</span>
                        <span className="text-[11px] text-[#6F716B] font-medium">
                          {s.category || s.section || 'Seat'} {s.stand ? `(${s.stand} Stand)` : ''}
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#20221F]">₹{s.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-4 border-t border-[#E4E1D8] space-y-2">
                <div className="flex justify-between items-center text-xs text-[#6F716B]">
                  <span>Subtotal ({selectedSeats.length} Seats)</span>
                  <span className="font-bold text-[#20221F]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#6F716B]">
                  <span>Booking & Service Fee</span>
                  <span className="font-bold text-[#22C55E]">FREE (ClubVerse Supporter Perk)</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#E4E1D8]">
                  <span className="text-base font-black text-[#20221F]">Total Amount Due</span>
                  <span className="text-2xl font-serif font-black text-[#20221F]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* User Account Info */}
              <div className="p-3.5 rounded-2xl bg-[#20221F] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7A8B5A] flex items-center justify-center text-white font-serif font-black text-sm">
                    {(currentUser?.name || currentUser?.full_name || 'G')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser?.name || currentUser?.full_name || 'Guest'}</div>
                    <div className="text-[10px] text-white/60">{currentUser?.email || 'No email specified'}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-[#BEF264] px-2.5 py-1 rounded-full bg-white/10">
                  Verified Fan
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleConfirmBooking}
              disabled={booking}
              className="w-full py-4 rounded-2xl bg-[#20221F] hover:bg-[#7A8B5A] text-white font-black text-sm uppercase tracking-wider shadow-warm-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {booking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#BEF264]" />
                  Processing Match Reservation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#BEF264]" />
                  Confirm & Reserve Seats — ₹{totalPrice.toLocaleString('en-IN')}
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 4: SUCCESS PASS ISSUED ── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-6 max-w-xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center shadow-warm-lg"
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>

            <div className="text-center space-y-2">
              <h3 className="font-serif font-black text-2xl text-[#20221F]">Official Match Tickets Reserved!</h3>
              <p className="text-xs text-[#6F716B] max-w-md mx-auto">
                {bookingResult?.tickets?.length || selectedSeats.length} seat(s) reserved for{' '}
                <span className="font-bold text-[#20221F]">
                  {selectedFixture?.home_team?.name} vs {selectedFixture?.away_team?.name}
                </span>{' '}
                at <span className="font-bold text-[#7A8B5A]">{selectedFixture?.venue || 'Campnow'}</span>.
              </p>
            </div>

            {/* Match Pass Summary Card */}
            <div className="w-full p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-[#E4E1D8] shadow-warm-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1D8]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-black text-[#20221F] uppercase">Digital Match Pass</span>
                </div>
                <span className="text-[10px] font-extrabold text-[#22C55E] px-2.5 py-0.5 rounded-full bg-[#22C55E]/10">
                  Confirmed
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F716B]">Venue</span>
                <span className="font-black text-[#20221F]">{selectedFixture?.venue || 'Campnow'}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F716B]">Total Seats Reserved</span>
                <span className="font-black text-[#20221F]">{selectedSeats.length} Seats</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F716B]">Total Amount</span>
                <span className="font-serif font-black text-base text-[#7A8B5A]">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {bookingResult?.razorpay_payment_id && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed border-[#E4E1D8]">
                  <span className="text-[#6F716B]">Razorpay Payment ID</span>
                  <span className="font-mono font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2 py-0.5 rounded-md text-[11px]">
                    {bookingResult.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setStep(1); setSelectedFixture(null); setSelectedSeats([]); }}
              className="px-8 py-3.5 rounded-2xl bg-[#20221F] text-white font-black text-xs uppercase tracking-wider hover:bg-[#7A8B5A] transition-all shadow-warm-md"
            >
              Book Another Match
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <RazorpayPaymentModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        amount={totalPrice}
        fixture={selectedFixture}
        seats={selectedSeats}
        currentUser={currentUser}
        onPaymentSuccess={handleRazorpayPaymentSuccess}
      />
    </div>
  );
}
