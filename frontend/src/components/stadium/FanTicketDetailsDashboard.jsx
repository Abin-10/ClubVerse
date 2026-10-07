import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Calendar, Clock, MapPin, QrCode, 
  Search, ShieldCheck, Download, Printer, XCircle, 
  CheckCircle2, Sparkles, Building, RefreshCw, 
  ArrowRight, AlertTriangle, Flame, CreditCard, ChevronRight, X
} from 'lucide-react';
import { getTeamLogo, formatTimeTo12Hour } from '../../utils/teamUtils';

const API = 'http://localhost:5000/api';

export default function FanTicketDetailsDashboard({ 
  currentUser, 
  triggerToast, 
  onNavigateToBooking 
}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All', 'Booked', 'Completed', 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPass, setSelectedPass] = useState(null); // For QR modal
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  const userId = currentUser?.id || currentUser?._id || 'guest';

  // Fetch ticket bookings from MongoDB API
  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tickets/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const ticketList = Array.isArray(data) ? data : (data.tickets || []);
        setTickets(ticketList);
      }
    } catch (err) {
      console.warn('Failed to fetch user tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [userId]);

  // Cancel Ticket Handler
  const handleCancelTicket = async (ticketId) => {
    try {
      setCancellingId(ticketId);
      const res = await fetch(`${API}/tickets/${ticketId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast?.('Ticket reservation cancelled successfully.');
        setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, ticket_status: 'Cancelled' } : t));
        setShowCancelConfirm(null);
        window.dispatchEvent(new Event('clubverse_ticket_update'));
        if (selectedPass?._id === ticketId) {
          setSelectedPass(prev => prev ? { ...prev, ticket_status: 'Cancelled' } : null);
        }
      } else {
        triggerToast?.(data.message || 'Failed to cancel ticket.');
      }
    } catch (err) {
      console.error('Cancel ticket error:', err);
      triggerToast?.('Error processing cancellation request.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'Matchday';
    return new Date(d).toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Filtering tickets
  const filteredTickets = tickets.filter(t => {
    const statusMatch = filter === 'All' 
      ? true 
      : filter === 'Booked' 
      ? (t.ticket_status === 'Booked' || t.ticket_status === 'Confirmed')
      : t.ticket_status === filter;

    const fixture = t.fixture_id || {};
    const homeName = fixture.home_team?.name || '';
    const awayName = fixture.away_team?.name || '';
    const venue = fixture.venue || 'Campnow';
    const q = searchQuery.toLowerCase();

    const searchMatch = !searchQuery || 
      homeName.toLowerCase().includes(q) || 
      awayName.toLowerCase().includes(q) || 
      venue.toLowerCase().includes(q) ||
      (t.seat_number && t.seat_number.toLowerCase().includes(q)) ||
      (t.razorpay_payment_id && t.razorpay_payment_id.toLowerCase().includes(q));

    return statusMatch && searchMatch;
  });

  // Analytics stats summary
  const totalBookings = tickets.length;
  const activeBookings = tickets.filter(t => t.ticket_status === 'Booked' || t.ticket_status === 'Confirmed').length;
  const totalSpent = tickets.reduce((sum, t) => sum + (t.price || 0), 0);

  return (
    <div className="space-y-6 font-sans selection:bg-[#7A8B5A] selection:text-white">
      
      {/* ── HEADER BANNER & STATS DASHBOARD ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white shadow-warm-lg border border-white/10 relative overflow-hidden">
        {/* Background Ambient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#BEF264]/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#BEF264] text-[#20221F] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-warm-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL FAN PASS DASHBOARD
              </span>
              <span className="text-[11px] font-bold text-white/80">Spotify Camp Nou Ticketing Hub</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              My Match Tickets & Entry Passes
            </h1>
            <p className="text-xs text-white/80 max-w-xl">
              View your reserved matchday seats, digital turnstile QR pass codes, venue details, and payment receipts.
            </p>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUserTickets}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              title="Refresh Ticket Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={onNavigateToBooking}
              className="px-5 py-3 rounded-2xl bg-[#BEF264] hover:bg-[#aee64b] text-[#20221F] font-black text-xs uppercase tracking-wider shadow-warm-md flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Ticket className="w-4 h-4 text-[#20221F]" />
              <span>Book New Match</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Analytics Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/15 relative z-10">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/70 uppercase">Total Tickets</span>
            <div className="text-2xl font-black font-serif text-white">{totalBookings}</div>
            <span className="text-[10px] text-[#BEF264] font-semibold">Matchday Passes</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/70 uppercase">Active / Confirmed</span>
            <div className="text-2xl font-black font-serif text-[#BEF264]">{activeBookings}</div>
            <span className="text-[10px] text-emerald-300 font-semibold">Ready for Stadium</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/70 uppercase">Total Spent</span>
            <div className="text-2xl font-black font-serif text-white">₹{totalSpent.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-white/70 font-semibold">Verified Fan Orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/70 uppercase">Fan VIP Status</span>
            <div className="text-xl font-black font-serif text-[#BEF264] truncate">Gold Supporter</div>
            <span className="text-[10px] text-white/70 font-semibold">Priority Entry Gate A</span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E4E1D8] shadow-warm-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-[#F7F5EF] p-1.5 rounded-2xl border border-[#E4E1D8]">
          {[
            { key: 'All', label: 'All Tickets' },
            { key: 'Booked', label: 'Active Pass' },
            { key: 'Completed', label: 'Past Matches' },
            { key: 'Cancelled', label: 'Cancelled' }
          ].map(tab => {
            const count = tab.key === 'All' 
              ? tickets.length 
              : tab.key === 'Booked' 
              ? tickets.filter(t => t.ticket_status === 'Booked' || t.ticket_status === 'Confirmed').length
              : tickets.filter(t => t.ticket_status === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  filter === tab.key
                    ? 'bg-[#20221F] text-white shadow-warm-xs'
                    : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#E4E1D8]/40'
                }`}
              >
                {tab.label} <span className="opacity-75 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F716B]" />
          <input
            type="text"
            placeholder="Search teams, venue, seat, payment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] placeholder-[#6F716B] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* ── TICKETS DISPLAY GRID / LIST ── */}
      {loading ? (
        <div className="p-16 text-center bg-white/80 border border-[#E4E1D8] rounded-3xl space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#7A8B5A] mx-auto" />
          <p className="text-xs font-bold text-[#6F716B]">Fetching your ticket reservations...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-12 text-center bg-white/90 border border-[#E4E1D8] rounded-3xl space-y-4 shadow-warm-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#F7F5EF] text-[#7A8B5A] flex items-center justify-center mx-auto border border-[#E4E1D8]">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-black text-xl text-[#20221F]">
              No {filter !== 'All' ? filter.toLowerCase() : ''} ticket bookings found
            </h3>
            <p className="text-xs text-[#6F716B] max-w-md mx-auto">
              You haven't reserved match passes under this category. Choose an upcoming fixture and reserve your stadium seats now.
            </p>
          </div>
          <button
            onClick={onNavigateToBooking}
            className="px-6 py-3 rounded-2xl bg-[#20221F] hover:bg-[#7A8B5A] text-white font-black text-xs uppercase tracking-wider shadow-warm-md inline-flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#BEF264]" />
            <span>Explore Upcoming Fixtures & Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => {
            const fixture = ticket.fixture_id || {};
            const homeTeam = fixture.home_team || { name: 'Manchester City', logo_color: '#00A3E0' };
            const awayTeam = fixture.away_team || { name: 'ClubVerse FC', logo_color: '#DC052D' };
            const venue = fixture.venue || 'Campnow';
            const matchDate = fixture.match_date || ticket.booking_date;
            const matchTime = fixture.match_time || '20:00 GMT';
            const isCancelled = ticket.ticket_status === 'Cancelled';
            const isBooked = ticket.ticket_status === 'Booked' || ticket.ticket_status === 'Confirmed';

            return (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/95 border rounded-3xl p-5 shadow-warm-md flex flex-col justify-between space-y-4 hover:shadow-warm-xl transition-all duration-300 relative overflow-hidden group ${
                  isCancelled 
                    ? 'border-red-200 opacity-75 bg-red-50/20' 
                    : 'border-[#E4E1D8] hover:border-[#7A8B5A]'
                }`}
              >
                {/* Subtle Top Card Header */}
                <div className="space-y-3">
                  
                  {/* Status & Pass Code Badge */}
                  <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                    <span className="font-mono text-[11px] font-bold text-[#7A8B5A] bg-[#F7F5EF] px-2.5 py-1 rounded-xl border border-[#E4E1D8]">
                      CV-TKT-{ticket._id.substring(18).toUpperCase()}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                      isCancelled
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                      {isCancelled ? 'Cancelled' : 'Confirmed Pass'}
                    </span>
                  </div>

                  {/* Match Teams Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2">
                    <div className="flex items-center justify-between">
                      
                      {/* Home Team */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-xs border border-[#E4E1D8]"
                          style={{ backgroundColor: homeTeam.logo_color }}
                        >
                          <img src={getTeamLogo(homeTeam)} alt={homeTeam.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-serif font-black text-xs text-[#20221F] truncate max-w-[90px]">
                          {homeTeam.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-black text-[#7A8B5A] bg-white px-2 py-0.5 rounded-full border border-[#E4E1D8]">
                        VS
                      </span>

                      {/* Away Team */}
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-black text-xs text-[#20221F] truncate max-w-[90px]">
                          {awayTeam.name}
                        </span>
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-xs border border-[#E4E1D8]"
                          style={{ backgroundColor: awayTeam.logo_color }}
                        >
                          <img src={getTeamLogo(awayTeam)} alt={awayTeam.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Match Date, Time & Venue Specs */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#6F716B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" /> Date & Kickoff
                      </span>
                      <span className="font-bold text-[#20221F]">{formatDate(matchDate)} • {formatTimeTo12Hour(matchTime)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6F716B]">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#7A8B5A]" /> Stadium Arena
                      </span>
                      <span className="font-bold text-[#7A8B5A]">{venue}</span>
                    </div>
                  </div>

                  {/* Seat Allocation Details Pill Box */}
                  <div className="p-3 rounded-2xl bg-[#20221F] text-white space-y-1.5 shadow-warm-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/70 font-medium">Allocated Seat</span>
                      <span className="font-black text-[#BEF264] text-xs font-mono">{ticket.seat_number}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/70 pt-1 border-t border-white/10">
                      <span>Tier: <strong className="text-white">{ticket.section || 'Regular'}</strong></span>
                      <span>Row: <strong className="text-white">{ticket.row || 1}</strong> • Seat: <strong className="text-white">{ticket.seat || 1}</strong></span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-[#6F716B] block">Price Paid</span>
                      <span className="font-serif font-black text-base text-[#20221F]">₹{ticket.price?.toLocaleString('en-IN')}</span>
                    </div>

                    {ticket.razorpay_payment_id && (
                      <div className="text-right">
                        <span className="text-[9px] text-[#6F716B] block">Razorpay Txn</span>
                        <span className="font-mono text-[10px] font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2 py-0.5 rounded-md">
                          {ticket.razorpay_payment_id}
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Actions Toolbar */}
                <div className="border-t border-[#E4E1D8] pt-3 flex items-center justify-between gap-2">
                  
                  {/* Cancel Button */}
                  {isBooked && (
                    <button
                      onClick={() => setShowCancelConfirm(ticket._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                      title="Cancel Ticket Reservation"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Digital QR Pass Action Button */}
                  <button
                    onClick={() => setSelectedPass(ticket)}
                    className="flex-1 py-2.5 rounded-2xl bg-[#20221F] text-white text-xs font-black hover:bg-[#7A8B5A] transition-all flex items-center justify-center gap-2 shadow-warm-xs"
                  >
                    <QrCode className="w-4 h-4 text-[#BEF264]" />
                    <span>View Turnstile Pass</span>
                  </button>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: DIGITAL QR STADIUM ENTRY PASS MODAL ── */}
      <AnimatePresence>
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-lg w-full shadow-warm-xl overflow-hidden relative my-6"
            >
              {/* Top Luxury Header */}
              <div className="bg-[#20221F] text-white p-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#BEF264] flex items-center justify-center font-black">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#BEF264] uppercase tracking-wider block">
                      CV-TKT-{selectedPass._id.substring(18).toUpperCase()}
                    </span>
                    <h3 className="font-serif font-black text-lg text-white">
                      Digital Stadium Entry Pass
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPass(null)}
                  className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pass Content Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Visual Pass Badge Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#3B4237] text-white shadow-warm-md space-y-4 border border-white/10 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-[#BEF264] uppercase tracking-wider">
                        Official Matchday Pass
                      </span>
                      <h4 className="font-serif font-black text-lg text-white mt-0.5">
                        {selectedPass.fixture_id?.home_team?.name || 'Home'} vs {selectedPass.fixture_id?.away_team?.name || 'Away'}
                      </h4>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      selectedPass.ticket_status === 'Cancelled'
                        ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                        : 'bg-[#BEF264]/20 text-[#BEF264] border border-[#BEF264]/30'
                    }`}>
                      {selectedPass.ticket_status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}
                    </span>
                  </div>

                  {/* Pass Specs */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">Kickoff Date</span>
                      <span className="font-bold text-white text-sm">
                        {formatDate(selectedPass.fixture_id?.match_date || selectedPass.booking_date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">Kickoff Time</span>
                      <span className="font-bold text-[#BEF264] text-sm">
                        {formatTimeTo12Hour(selectedPass.fixture_id?.match_time || '20:00 GMT')}
                      </span>
                    </div>
                  </div>

                  {/* Seat Allocation Details */}
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-white/70 block uppercase font-bold">Seat Number</span>
                      <span className="font-mono font-black text-white text-base">{selectedPass.seat_number}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/70 block uppercase font-bold">Tier / Section</span>
                      <span className="font-bold text-[#BEF264]">{selectedPass.section || 'Regular'}</span>
                    </div>
                  </div>

                  {/* Dynamic Turnstile QR Code */}
                  <div className="p-4 rounded-2xl bg-white text-[#20221F] flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#6F716B] uppercase font-black tracking-wider block">Pass Holder</span>
                      <div className="text-xs font-black text-[#20221F]">{selectedPass.user_name || 'Verified Fan'}</div>
                      <div className="text-[10px] text-[#7A8B5A] font-bold">Gate Entry: Turnstile A-04</div>
                    </div>

                    <div className="w-16 h-16 bg-[#F7F5EF] p-1 rounded-xl flex items-center justify-center border border-[#E4E1D8]">
                      <QrCode className="w-14 h-14 text-[#20221F]" />
                    </div>
                  </div>

                </div>

                {/* Additional Matchday Details */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-[#20221F]">Matchday Venue Instructions</h4>
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2 text-[#6F716B]">
                    <div className="flex justify-between">
                      <span>Venue:</span>
                      <strong className="text-[#20221F]">{selectedPass.fixture_id?.venue || 'Campnow Stadium'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount Paid:</span>
                      <strong className="text-[#7A8B5A]">₹{selectedPass.price?.toLocaleString('en-IN')}</strong>
                    </div>
                    {selectedPass.razorpay_payment_id && (
                      <div className="flex justify-between">
                        <span>Razorpay Payment ID:</span>
                        <strong className="font-mono text-[#20221F]">{selectedPass.razorpay_payment_id}</strong>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-[#F7F5EF] border-t border-[#E4E1D8] flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-2xl border border-[#E4E1D8] text-xs font-bold text-[#20221F] bg-white hover:bg-[#E4E1D8] flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-[#7A8B5A]" />
                  <span>Print Ticket</span>
                </button>

                <button
                  onClick={() => setSelectedPass(null)}
                  className="px-6 py-2.5 rounded-2xl bg-[#20221F] text-white text-xs font-black hover:bg-[#7A8B5A]"
                >
                  Close Pass
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: CANCEL TICKET CONFIRMATION PROMPT ── */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 max-w-md w-full shadow-warm-xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#20221F]">Cancel Match Ticket?</h3>
                  <p className="text-xs text-[#6F716B]">This action will release your seat reservation back to the pool.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
                Are you sure you want to cancel this ticket pass? You can re-book tickets anytime if seats remain available.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E4E1D8] bg-white text-xs font-bold text-[#20221F] hover:bg-[#F7F5EF]"
                >
                  Keep Reservation
                </button>
                
                <button
                  disabled={cancellingId === showCancelConfirm}
                  onClick={() => handleCancelTicket(showCancelConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  {cancellingId === showCancelConfirm ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
