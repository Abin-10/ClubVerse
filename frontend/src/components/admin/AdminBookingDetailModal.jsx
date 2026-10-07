import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  QrCode, 
  Printer, 
  XCircle, 
  CheckCircle2,
  AlertTriangle,
  Building,
  CreditCard,
  Ticket,
  FileText,
  ShieldCheck,
  Check,
  Hash,
  DollarSign
} from 'lucide-react';

export default function AdminBookingDetailModal({ 
  booking, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  triggerToast 
}) {
  if (!isOpen || !booking) return null;

  const [isUpdating, setIsUpdating] = useState(false);

  const isPending = booking.booking_status === 'Pending';
  const isConfirmed = booking.booking_status === 'Confirmed' || booking.booking_status === 'Booked';
  const isRejected = booking.booking_status === 'Rejected' || booking.booking_status === 'Cancelled';
  const isTicketType = Boolean(booking.seat_number); // Match ticket vs Stadium booking

  const handleAction = async (newStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(booking._id, newStatus, isTicketType ? 'ticket' : 'stadium');
    setIsUpdating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = booking.booking_date 
    ? (typeof booking.booking_date === 'string' && booking.booking_date.includes('T') 
        ? new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })
        : booking.booking_date)
    : 'N/A';

  const seatsList = isTicketType 
    ? [booking.seat_number] 
    : (booking.selected_seats && booking.selected_seats.length > 0 ? booking.selected_seats : [`${booking.total_seats || 1} Seat(s)`]);

  const totalAmount = booking.total_price || booking.price || 0;
  const passCode = booking._id ? `CV-PASS-${booking._id.toString().substring(18).toUpperCase()}` : 'CV-PASS-89210';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-2xl w-full shadow-warm-lg overflow-hidden relative my-6"
        >
          {/* Header */}
          <div className="bg-[#20221F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#BEF264]/20 border border-[#BEF264]/30 text-[#BEF264] flex items-center justify-center font-black">
                {isTicketType ? <Ticket className="w-5 h-5" /> : <Building className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#BEF264] uppercase tracking-wider block">
                    ID: {booking._id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-white/80">
                    {isTicketType ? 'Match Ticket' : 'Stadium Reservation'}
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg text-white mt-0.5">
                  Fan Booking Inspection & Details
                </h3>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">

            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isPending 
                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                : isConfirmed 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                  isPending ? 'bg-amber-200 text-amber-900' : isConfirmed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                }`}>
                  {isPending ? '⚠️' : isConfirmed ? '✓' : '✕'}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    Booking Status: {booking.booking_status || booking.ticket_status || 'Pending'}
                  </span>
                  <p className="text-[11px] opacity-80">
                    {isPending 
                      ? 'Action Required: Review fan details below to Accept or Reject this request.' 
                      : isConfirmed 
                      ? 'This booking is active and confirmed in the ClubVerse database.' 
                      : 'This booking request was declined or cancelled.'}
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold px-3 py-1 bg-white/80 rounded-lg border border-current/20 shadow-warm-sm">
                {passCode}
              </span>
            </div>

            {/* 2-Column Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Fan Information */}
              <div className="bg-[#F7F5EF] border border-[#E4E1D8] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E4E1D8] pb-2">
                  <User className="w-4 h-4 text-[#7A8B5A]" />
                  <h4 className="font-serif font-black text-sm text-[#20221F]">Fan Customer Details</h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Full Name</span>
                    <strong className="text-[#20221F] text-sm">{booking.user_name || 'Fan Supporter'}</strong>
                  </div>

                  <div>
                    <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="font-semibold text-[#20221F] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#7A8B5A]" />
                      {booking.user_email || 'fan@clubverse.com'}
                    </span>
                  </div>

                  {booking.user_phone && (
                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Phone Contact</span>
                      <span className="font-semibold text-[#20221F] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#7A8B5A]" />
                        {booking.user_phone}
                      </span>
                    </div>
                  )}

                  {booking.user_id && (
                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold">User Account ID</span>
                      <span className="font-mono text-[11px] text-[#6F716B]">{booking.user_id}</span>
                    </div>
                  )}

                  {booking.team_name && (
                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Team / Organization</span>
                      <span className="font-bold text-[#7A8B5A]">{booking.team_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Stadium / Match Specifications */}
              <div className="bg-[#F7F5EF] border border-[#E4E1D8] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E4E1D8] pb-2">
                  <Building className="w-4 h-4 text-[#7A8B5A]" />
                  <h4 className="font-serif font-black text-sm text-[#20221F]">Event & Venue Info</h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Venue / Stadium</span>
                    <strong className="text-[#20221F]">{booking.stadium_name || 'Campnow Stadium'}</strong>
                  </div>

                  <div>
                    <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Match Title / Fixture</span>
                    <span className="font-bold text-[#7A8B5A]">{booking.match_title || 'ClubVerse Fixture'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E4E1D8]">
                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7A8B5A]" /> Date
                      </span>
                      <span className="font-bold text-[#20221F]">{formattedDate}</span>
                    </div>

                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7A8B5A]" /> Time Slot
                      </span>
                      <span className="font-bold text-[#20221F]">{booking.time_slot || 'Matchday Session'}</span>
                    </div>
                  </div>

                  {booking.location && (
                    <div>
                      <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Location</span>
                      <span className="text-[#6F716B] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#7A8B5A]" /> {booking.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Box 3: Seat Allocation & Digital Pass Preview */}
            <div className="p-5 rounded-2xl bg-[#20221F] text-white space-y-4 border border-[#3B4237]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#BEF264]" />
                  <h4 className="font-serif font-black text-sm text-white">Reserved Seats & Turnstile Pass</h4>
                </div>
                <span className="text-[10px] font-mono text-[#BEF264] uppercase tracking-wider">
                  {seatsList.length} Seat(s) Allocated
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {seatsList.map((st, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-xl bg-[#BEF264]/20 text-[#BEF264] border border-[#BEF264]/40 text-xs font-extrabold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {st}
                  </span>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-white/60 block uppercase font-bold">Digital Stadium Turnstile Code</span>
                  <div className="font-mono font-black text-sm text-[#BEF264] tracking-widest">{passCode}</div>
                </div>

                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-10 h-10 text-[#20221F]" />
                </div>
              </div>
            </div>

            {/* Box 4: Financial & Payment Info */}
            <div className="bg-[#F7F5EF] border border-[#E4E1D8] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E4E1D8] pb-2">
                <CreditCard className="w-4 h-4 text-[#7A8B5A]" />
                <h4 className="font-serif font-black text-sm text-[#20221F]">Payment & Financial Ledger</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Total Amount Paid</span>
                  <strong className="text-[#7A8B5A] text-base font-serif font-black">
                    ${totalAmount}
                  </strong>
                </div>

                <div>
                  <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-bold text-[#20221F]">
                    {booking.payment_method || 'Fan Wallet Balance'}
                  </span>
                </div>

                <div>
                  <span className="text-[#6F716B] block text-[10px] uppercase font-bold">Payment Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block mt-0.5">
                    {booking.payment_status || 'Paid'}
                  </span>
                </div>
              </div>

              {booking.razorpay_payment_id && (
                <div className="pt-2 border-t border-[#E4E1D8] flex items-center justify-between text-xs">
                  <span className="text-[#6F716B]">Razorpay Transaction ID:</span>
                  <span className="font-mono font-bold text-[#20221F] bg-[#FFFDF8] px-2 py-0.5 rounded border border-[#E4E1D8]">
                    {booking.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>

            {/* Box 5: Special Notes */}
            {booking.special_notes && (
              <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl p-4 space-y-1 text-xs">
                <span className="font-bold text-[#20221F] block flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  Special Fan Request / Notes:
                </span>
                <p className="text-[#6F716B] italic pl-4 border-l-2 border-[#7A8B5A]">
                  "{booking.special_notes}"
                </p>
              </div>
            )}

          </div>

          {/* Footer & Admin Actions */}
          <div className="p-4 sm:p-5 bg-[#F7F5EF] border-t border-[#E4E1D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#20221F] bg-[#FFFDF8] hover:bg-[#E4E1D8] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#7A8B5A]" />
              Print Full Slip
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isPending && (
                <>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleAction('Confirmed')}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all flex items-center justify-center gap-1.5 shadow-warm-sm"
                  >
                    <Check className="w-4 h-4 text-[#BEF264]" />
                    <span>Accept & Approve</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleAction('Rejected')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 hover:bg-red-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4 text-red-600" />
                    <span>Reject Request</span>
                  </button>
                </>
              )}

              {isConfirmed && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('Rejected')}
                  className="px-4 py-2 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 hover:bg-red-200 transition-all"
                >
                  Revoke Approval
                </button>
              )}

              {isRejected && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('Confirmed')}
                  className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 hover:bg-emerald-200 transition-all"
                >
                  Re-Approve Booking
                </button>
              )}

              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#E4E1D8] text-[#20221F] text-xs font-bold hover:bg-[#d6d3c9] transition-colors"
              >
                Close
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
