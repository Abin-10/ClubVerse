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
  AlertTriangle,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function BookingDetailModal({ 
  booking, 
  isOpen, 
  onClose, 
  onCancelBooking,
  triggerToast 
}) {
  if (!isOpen || !booking) return null;

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isUpcoming = booking.booking_status === 'Upcoming';
  const isCancelled = booking.booking_status === 'Cancelled';
  const isCompleted = booking.booking_status === 'Completed';

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    await onCancelBooking(booking._id);
    setIsCancelling(false);
    setShowCancelPrompt(false);
    onClose();
    if (triggerToast) triggerToast(`Booking ${booking._id} cancelled successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-xl w-full shadow-warm-lg overflow-hidden relative my-6"
        >
          {/* Header */}
          <div className="bg-[#20221F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-[#BEF264] flex items-center justify-center font-black">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#BEF264] uppercase tracking-wider block">
                  {booking._id}
                </span>
                <h3 className="font-serif font-black text-lg text-white">
                  Stadium Entry Pass & Details
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
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

            {/* Cancel confirmation prompt */}
            {showCancelPrompt ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Are you sure you want to cancel this booking?</span>
                </div>
                <p className="text-xs text-red-700">
                  Cancelling will release your reserved time slot ({booking.time_slot} on {booking.booking_date}) for other fans.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={() => setShowCancelPrompt(false)}
                    className="flex-1 py-2 rounded-xl bg-white border border-red-200 text-xs font-bold text-red-800 hover:bg-red-100"
                  >
                    Keep Booking
                  </button>
                  <button 
                    disabled={isCancelling}
                    onClick={handleConfirmCancel}
                    className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel Reservation'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* QR Code Pass Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#3B4237] text-white shadow-warm-md space-y-4 border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-[#BEF264] uppercase tracking-wider">
                        Official Stadium Pass
                      </span>
                      <h4 className="font-serif font-black text-xl text-white mt-0.5">
                        {booking.stadium_name}
                      </h4>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                      isUpcoming 
                        ? 'bg-[#BEF264]/20 text-[#BEF264] border-[#BEF264]/30' 
                        : isCompleted 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' 
                        : 'bg-red-500/20 text-red-300 border-red-400/30'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">Event Date</span>
                      <span className="font-bold text-white text-sm">{booking.booking_date}</span>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">Total Paid</span>
                      <span className="font-bold text-[#BEF264] text-sm">${booking.total_price}</span>
                    </div>
                  </div>

                  {booking.selected_seats && booking.selected_seats.length > 0 && (
                    <div className="border-t border-white/10 pt-2 space-y-1">
                      <span className="text-white/60 block text-[10px] uppercase font-bold">Reserved Seats</span>
                      <div className="flex flex-wrap gap-1">
                        {booking.selected_seats.map((st, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-[#BEF264]/20 text-[#BEF264] text-[11px] font-bold border border-[#BEF264]/30">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mock QR Code Graphic */}
                  <div className="pt-2 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/70 block">Pass Holder</span>
                      <div className="text-xs font-bold text-white">{booking.user_name}</div>
                      <div className="text-[10px] text-white/50">{booking.team_name || 'Individual Fan'}</div>
                    </div>
                    
                    <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center">
                      {/* Generates clean SVG QR style box */}
                      <QrCode className="w-14 h-14 text-[#20221F]" />
                    </div>
                  </div>
                </div>

                {/* Additional Info Specs */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#20221F]">Reservation Details</h4>
                  
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#6F716B]">
                      <span>Location</span>
                      <span className="font-bold text-[#20221F]">{booking.location}</span>
                    </div>
                    {booking.pitch_sector && (
                      <div className="flex items-center justify-between text-[#6F716B]">
                        <span>Pitch Sector</span>
                        <span className="font-bold text-[#7A8B5A]">{booking.pitch_sector}</span>
                      </div>
                    )}
                    {booking.addons && booking.addons.length > 0 && (
                      <div className="border-t border-[#E4E1D8] pt-2 text-[#6F716B]">
                        <span className="block font-bold text-[#20221F] mb-1">Matchday Add-ons Included:</span>
                        <div className="flex flex-wrap gap-1">
                          {booking.addons.map((ad, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-[#7A8B5A]/10 text-[#7A8B5A] text-[10px] font-bold">
                              ✓ {ad}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[#6F716B] border-t border-[#E4E1D8] pt-2">
                      <span>Contact Email</span>
                      <span className="font-bold text-[#20221F]">{booking.user_email}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#6F716B]">
                      <span>Phone</span>
                      <span className="font-bold text-[#20221F]">{booking.user_phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#6F716B]">
                      <span>Payment Method</span>
                      <span className="font-bold text-[#20221F]">{booking.payment_method}</span>
                    </div>
                    {booking.special_notes && (
                      <div className="border-t border-[#E4E1D8] pt-2 text-[#6F716B]">
                        <span className="block font-bold text-[#20221F] mb-0.5">Special Requests:</span>
                        <span>{booking.special_notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-[#F7F5EF] border-t border-[#E4E1D8] flex items-center justify-between gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#20221F] bg-[#FFFDF8] hover:bg-[#E4E1D8] flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#7A8B5A]" />
              Print Pass
            </button>

            <div className="flex items-center gap-2">
              {isUpcoming && !showCancelPrompt && (
                <button 
                  onClick={() => setShowCancelPrompt(true)}
                  className="px-4 py-2.5 rounded-full bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 border border-red-200 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Cancel Booking
                </button>
              )}

              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A]"
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
