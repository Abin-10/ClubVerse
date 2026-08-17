import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Building,
  Plus
} from 'lucide-react';

export default function MyBookingsView({ 
  bookings = [], 
  onViewBookingDetails, 
  onCancelBooking,
  onGoToListing 
}) {
  const [filter, setFilter] = useState('All'); // 'All', 'Upcoming', 'Completed', 'Cancelled'

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true;
    return b.booking_status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h3 className="font-serif font-black text-xl text-[#20221F]">My Stadium Reservations</h3>
          <p className="text-xs text-[#6F716B] mt-0.5">Manage your upcoming matches, entry QR passes, and pitch hire records</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#EFEEE8]/80 p-1 rounded-full border border-[#E4E1D8]">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => {
            const count = tab === 'All' 
              ? bookings.length 
              : bookings.filter(b => b.booking_status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === tab 
                    ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-sm' 
                    : 'text-[#6F716B] hover:text-[#20221F]'
                }`}
              >
                {tab} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List / Grid */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-4 shadow-warm-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F5EF] text-[#7A8B5A] flex items-center justify-center mx-auto border border-[#E4E1D8]">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-serif font-black text-lg text-[#20221F]">No {filter !== 'All' ? filter.toLowerCase() : ''} bookings found</h4>
            <p className="text-xs text-[#6F716B] max-w-sm mx-auto mt-1">
              You haven't reserved any stadium pitches under this category yet. Explore our premier arenas and book your preferred date & slot.
            </p>
          </div>
          <button 
            onClick={onGoToListing}
            className="px-6 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#BEF264]" />
            <span>Browse Stadiums Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((b) => {
            const isUpcoming = b.booking_status === 'Upcoming';
            const isCompleted = b.booking_status === 'Completed';
            const isCancelled = b.booking_status === 'Cancelled';

            return (
              <motion.div 
                key={b._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-5 shadow-warm-md flex flex-col justify-between space-y-4 hover:border-[#7A8B5A]/60 transition-all"
              >
                {/* Top Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#7A8B5A] bg-[#F7F5EF] px-2.5 py-1 rounded-lg border border-[#E4E1D8]">
                      {b._id}
                    </span>

                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      b.booking_status === 'Pending'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : b.booking_status === 'Confirmed' || b.booking_status === 'Upcoming'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : b.booking_status === 'Completed'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        b.booking_status === 'Pending' ? 'bg-amber-500 animate-ping' : b.booking_status === 'Confirmed' || b.booking_status === 'Upcoming' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                      {b.booking_status === 'Pending' ? 'Pending Approval' : b.booking_status === 'Confirmed' ? 'Confirmed' : b.booking_status}
                    </span>
                  </div>

                  {/* Stadium Media preview & Title */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={b.stadium_image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80'} 
                      alt={b.stadium_name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E4E1D8]"
                    />
                    <div>
                      <h4 className="font-serif font-black text-base text-[#20221F]">
                        {b.stadium_name}
                      </h4>
                      <p className="text-[11px] text-[#6F716B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#7A8B5A]" />
                        <span className="truncate">{b.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Date & Time info box */}
                  <div className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#6F716B] block">Date</span>
                      <span className="font-bold text-[#20221F]">{b.booking_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6F716B] block">Time Slot</span>
                      <span className="font-bold text-[#20221F]">{b.time_slot}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="border-t border-[#E4E1D8] pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6F716B] block">Total Paid</span>
                    <span className="font-serif font-black text-base text-[#20221F]">₹{b.total_price?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUpcoming && (
                      <button 
                        onClick={() => onCancelBooking(b._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={() => onViewBookingDetails(b)}
                      className="px-3.5 py-2 rounded-xl bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#BEF264]" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
