import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight,
  Building,
  AlertTriangle,
  Ticket
} from 'lucide-react';
import { MATCH_EVENTS } from '../../data/stadiumData';
import StadiumSeatingMap from './StadiumSeatingMap';
import Stadium3DView from './Stadium3DView';

export default function BookingFlowModal({ 
  stadium, 
  isOpen, 
  onClose, 
  currentUser, 
  onBookingComplete,
  triggerToast 
}) {
  if (!isOpen || !stadium) return null;

  // Wizard Steps: 1 = Event & Match Date, 2 = 3D/2D BookMyShow Seat Picker, 3 = Contact Details, 4 = Summary & Payment, 5 = Confirmation
  const [step, setStep] = useState(1);

  // Form State
  const [dbFixtures, setDbFixtures] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(MATCH_EVENTS[0]);
  const [selectedDate, setSelectedDate] = useState(MATCH_EVENTS[0].dateStr);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch admin fixtures from DB
  useEffect(() => {
    const fetchAdminFixtures = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/fixtures/upcoming');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(f => ({
              id: f._id,
              dateStr: f.match_date ? new Date(f.match_date).toISOString().split('T')[0] : '2026-08-20',
              matchTitle: `${f.home_team?.name || 'Home Team'} vs ${f.away_team?.name || 'Away Team'}`,
              competition: f.venue || 'Premier League',
              badge: f.status || '🔥 Admin Fixture'
            }));
            setDbFixtures(mapped);
            setSelectedMatch(mapped[0]);
            setSelectedDate(mapped[0].dateStr);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch DB fixtures for modal:', err);
      }
    };
    fetchAdminFixtures();
  }, []);

  // Contact details
  const [fullName, setFullName] = useState(currentUser?.name || currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [teamName, setTeamName] = useState('ClubVerse Supporter Squad');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Fan Wallet Balance');

  // Completed booking data
  const [completedBooking, setCompletedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name || currentUser.full_name || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Toggle seat selection
  const handleSeatToggle = (seatObj) => {
    if (selectedSeats.some(s => s.key === seatObj.key)) {
      setSelectedSeats(prev => prev.filter(s => s.key !== seatObj.key));
    } else {
      setSelectedSeats(prev => [...prev, seatObj]);
    }
  };

  // Pricing calculation
  const serviceFee = 15;
  const seatsSubtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const totalPrice = seatsSubtotal + serviceFee;

  // Date blocked check
  const isDateBlockedByAdmin = stadium.blocked_dates?.includes(selectedDate);
  const isStadiumInMaintenance = stadium.availabilityStatus === 'Maintenance';
  const isFullDayUnavailable = isDateBlockedByAdmin || isStadiumInMaintenance;

  // Submit booking logic
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const bookingId = 'STAD-' + Math.floor(10000 + Math.random() * 90000);

    const seatLabels = selectedSeats.map(s => s.label);

    const newBookingData = {
      _id: bookingId,
      stadium_id: stadium.id || stadium._id,
      stadium_name: stadium.name,
      stadium_image: stadium.image,
      location: stadium.location,
      user_id: currentUser?.id || currentUser?._id || 'guest',
      user_name: fullName,
      user_email: email,
      user_phone: phone,
      team_name: teamName,
      special_notes: specialNotes,
      booking_date: selectedDate,
      match_title: selectedMatch?.matchTitle || 'ClubVerse Matchday',
      selected_seats: seatLabels,
      total_seats: selectedSeats.length,
      total_price: totalPrice,
      payment_method: paymentMethod,
      payment_status: 'Paid',
      booking_status: 'Upcoming',
      created_at: new Date().toISOString()
    };

    // Post to Express backend API if active
    try {
      const res = await fetch('http://localhost:5000/api/stadium-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.booking) {
          newBookingData._id = data.booking._id || bookingId;
        }
      }
    } catch (err) {
      console.warn('Backend API note (saving locally):', err.message);
    }

    setIsSubmitting(false);
    setCompletedBooking(newBookingData);
    onBookingComplete(newBookingData);
    setStep(5);
    if (triggerToast) triggerToast(`Booking ${bookingId} confirmed!`);
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedSeats([]);
    setCompletedBooking(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-3xl w-full shadow-warm-lg overflow-hidden relative my-6"
        >
          {/* Header */}
          <div className="bg-[#20221F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black shadow-warm-sm">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-white">
                  {stadium.name}
                </h3>
                <p className="text-xs text-white/70">
                  {step === 1 && 'Step 1 of 4 • Select Matchday Date'}
                  {step === 2 && 'Step 2 of 4 • Interactive Stadium Seating Map (Blue/Red Seats)'}
                  {step === 3 && 'Step 3 of 4 • Enter Contact Details'}
                  {step === 4 && 'Step 4 of 4 • Summary & Payment'}
                  {step === 5 && 'Ticket Reserved Successfully!'}
                </p>
              </div>
            </div>

            <button 
              onClick={resetAndClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicators Bar */}
          {step < 5 && (
            <div className="bg-[#F7F5EF] px-6 py-3 border-b border-[#E4E1D8] flex items-center justify-between">
              {[
                { number: 1, label: 'Matchday Event' },
                { number: 2, label: '3D/2D Seats' },
                { number: 3, label: 'Contact' },
                { number: 4, label: 'Summary' }
              ].map((s) => (
                <div key={s.number} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[11px] font-black flex items-center justify-center transition-all ${
                    step === s.number 
                      ? 'bg-[#20221F] text-[#BEF264]' 
                      : step > s.number 
                      ? 'bg-[#7A8B5A] text-white' 
                      : 'bg-[#E4E1D8] text-[#6F716B]'
                  }`}>
                    {step > s.number ? '✓' : s.number}
                  </div>
                  <span className={`text-[11px] font-bold hidden sm:inline ${step === s.number ? 'text-[#20221F]' : 'text-[#6F716B]'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Step Contents */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

            {/* STEP 1: DISCRETE NON-CONTINUOUS MATCHDAY EVENT DATES */}
            {step === 1 && (
              <div className="space-y-6">
                
                {/* Unavailable Warning */}
                {isFullDayUnavailable && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs">Stadium Pitch Maintenance / Reserved</h4>
                      <p className="text-[11px] text-red-700">
                        The stadium is currently under maintenance or blocked for official team practice.
                      </p>
                    </div>
                  </div>
                )}

                {/* Matchday Event Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#7A8B5A]" />
                      Select Matchday Fixture Date
                    </label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E4E1D8] bg-[#F7F5EF] text-[#20221F]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {(dbFixtures.length > 0 ? dbFixtures : MATCH_EVENTS).map((ev) => {
                      const isSel = selectedMatch.id === ev.id && selectedDate === ev.dateStr;
                      const isBlocked = stadium.blocked_dates?.includes(ev.dateStr);

                      return (
                        <button
                          key={ev.id}
                          type="button"
                          disabled={isBlocked}
                          onClick={() => {
                            setSelectedMatch(ev);
                            setSelectedDate(ev.dateStr);
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isBlocked 
                              ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed opacity-75'
                              : isSel
                              ? 'bg-[#20221F] text-white border-[#20221F] shadow-warm-md'
                              : 'bg-[#F7F5EF] text-[#20221F] border-[#E4E1D8] hover:border-[#7A8B5A]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                isSel ? 'bg-[#BEF264] text-[#20221F]' : 'bg-[#7A8B5A]/20 text-[#7A8B5A]'
                              }`}>
                                {ev.competition}
                              </span>
                              <span className={`text-[10px] font-bold ${isSel ? 'text-white/70' : 'text-[#6F716B]'}`}>
                                {ev.dateStr}
                              </span>
                            </div>
                            <h4 className="font-serif font-black text-sm">{ev.matchTitle}</h4>
                          </div>

                          <div className="text-right">
                            <span className={`text-[10px] font-extrabold block ${isSel ? 'text-[#BEF264]' : 'text-[#7A8B5A]'}`}>
                              {ev.badge}
                            </span>
                            <span className={`text-[11px] font-bold block mt-1 ${isSel ? 'text-white/80' : 'text-[#6F716B]'}`}>
                              {isBlocked ? 'Blocked' : 'Seats Open'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: INTERACTIVE STADIUM 3D/2D SEATING MAP */}
            {step === 2 && (
              <Stadium3DView 
                stadiumName={stadium?.name}
                stadium={stadium}
                seatingTiers={stadium?.seating_tiers || stadium?.seatingTiers}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                onClearSeats={() => setSelectedSeats([])}
                onProceed={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {/* STEP 3: CONTACT DETAILS */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1 border-b border-[#E4E1D8] pb-3">
                  <h4 className="font-bold text-sm text-[#20221F]">Booking Contact & Fan Information</h4>
                  <p className="text-xs text-[#6F716B]">Enter details for stadium entry pass and security clearance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#20221F]">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6F716B] absolute left-3 top-3" />
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#20221F]">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6F716B] absolute left-3 top-3" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="fan@clubverse.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#20221F]">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6F716B] absolute left-3 top-3" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700 900123"
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#20221F]">Fan / Supporters Club Name</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#6F716B] absolute left-3 top-3" />
                      <input 
                        type="text" 
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. ClubVerse Supporters FC"
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#20221F]">Special Notes / Access Requests</label>
                  <textarea 
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Wheelchair assistance or VIP lounge key request..."
                    className="w-full p-3 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: SUMMARY & PAYMENT */}
            {step === 4 && (
              <div className="space-y-5">
                
                {/* Booking Breakdown Card */}
                <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#7A8B5A]">{selectedMatch?.competition || 'Stadium Matchday'}</span>
                      <h4 className="font-serif font-black text-lg text-[#20221F]">{selectedMatch?.matchTitle || stadium.name}</h4>
                      <p className="text-xs text-[#6F716B]">{stadium.name} • {stadium.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-[#7A8B5A]">Selected Seats</span>
                      <div className="text-xs font-bold text-[#20221F]">{selectedSeats.length} Seats</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#6F716B] block uppercase">Selected Seat Numbers:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeats.map(s => (
                        <span key={s.key} className="px-3 py-1 rounded-lg bg-[#20221F] text-[#BEF264] text-xs font-bold">
                          {s.label} (₹{s.price.toLocaleString('en-IN')})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing Itemized Breakdown */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E4E1D8] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6F716B]">
                    <span>Seats Total ({selectedSeats.length} seats)</span>
                    <span className="font-bold text-[#20221F]">₹{seatsSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6F716B]">
                    <span>Stadium Service & Matchday Booking Tax</span>
                    <span className="font-bold text-[#20221F]">₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black text-[#20221F] border-t border-[#E4E1D8] pt-2 mt-1">
                    <span>Total Amount</span>
                    <span className="text-xl font-serif font-black text-[#7A8B5A]">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#7A8B5A]" />
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Fan Wallet Balance',
                      'Pay at Venue',
                      'Credit / Debit Card'
                    ].map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPaymentMethod(pm)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                          paymentMethod === pm 
                            ? 'bg-[#20221F] text-white border-[#20221F]' 
                            : 'bg-[#F7F5EF] text-[#20221F] border-[#E4E1D8] hover:bg-[#E4E1D8]'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 5: CONFIRMATION RECEIPT */}
            {step === 5 && completedBooking && (
              <div className="text-center space-y-5 py-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-[#BEF264]/20 border-2 border-[#BEF264] text-[#7A8B5A] flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-9 h-9 text-[#7A8B5A]" />
                </motion.div>

                <div>
                  <span className="text-[10px] font-black uppercase text-[#7A8B5A] tracking-wider">
                    Match Ticket Confirmed
                  </span>
                  <h3 className="font-serif font-black text-2xl text-[#20221F] mt-1">
                    Stadium Seats Reserved!
                  </h3>
                  <p className="text-xs text-[#6F716B] max-w-sm mx-auto mt-1">
                    Your seats have been booked. Present your digital ticket pass or QR code at stadium main gate entry.
                  </p>
                </div>

                {/* Digital Ticket Pass Box */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#20221F] to-[#2E332B] text-white text-left space-y-4 max-w-md mx-auto shadow-warm-md border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-[#BEF264] uppercase">Pass ID</span>
                      <div className="font-mono font-black text-base tracking-wide text-white">{completedBooking._id}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#BEF264]/20 text-[#BEF264] text-[10px] font-extrabold border border-[#BEF264]/30">
                      Confirmed
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-lg text-white">{completedBooking.stadium_name}</h4>
                    <p className="text-xs text-white/70">{completedBooking.match_title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-white/60 block">Event Date</span>
                      <span className="font-bold text-white">{completedBooking.booking_date}</span>
                    </div>
                    <div>
                      <span className="text-white/60 block">Seats Reserved</span>
                      <span className="font-bold text-[#BEF264]">{completedBooking.total_seats} Seats</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 bg-[#F7F5EF] border-t border-[#E4E1D8] flex items-center justify-between gap-3">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#6F716B] hover:text-[#20221F] bg-[#FFFDF8] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                disabled={isFullDayUnavailable}
                onClick={() => setStep(2)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all ${
                  !isFullDayUnavailable 
                    ? 'bg-[#20221F] text-white hover:bg-[#7A8B5A]' 
                    : 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed'
                }`}
              >
                <span>Choose Seats on 3D Map</span>
                <ArrowRight className="w-4 h-4 text-[#BEF264]" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(3)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all ${
                  selectedSeats.length > 0 
                    ? 'bg-[#20221F] text-white hover:bg-[#7A8B5A]' 
                    : 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed'
                }`}
              >
                <span>Enter Contact Info</span>
                <ArrowRight className="w-4 h-4 text-[#BEF264]" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={!fullName || !email}
                onClick={() => setStep(4)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all ${
                  fullName && email 
                    ? 'bg-[#20221F] text-white hover:bg-[#7A8B5A]' 
                    : 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed'
                }`}
              >
                <span>Review Summary</span>
                <ArrowRight className="w-4 h-4 text-[#BEF264]" />
              </button>
            )}

            {step === 4 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-6 py-3 rounded-full bg-[#20221F] text-white font-bold text-xs shadow-warm-md flex items-center gap-2 hover:bg-[#7A8B5A]"
              >
                <ShieldCheck className="w-4 h-4 text-[#BEF264]" />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm & Reserve Tickets'}</span>
              </motion.button>
            )}

            {step === 5 && (
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 rounded-full bg-[#20221F] text-white font-bold text-xs shadow-warm-md text-center hover:bg-[#7A8B5A] transition-colors"
              >
                Close & Return to Dashboard
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
