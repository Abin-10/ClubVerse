import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles,
  Plus
} from 'lucide-react';
import { STADIUMS_LIST, INITIAL_MOCK_BOOKINGS } from '../../data/stadiumData';
import StadiumCard from './StadiumCard';
import StadiumDetailModal from './StadiumDetailModal';
import BookingFlowModal from './BookingFlowModal';
import MyBookingsView from './MyBookingsView';
import BookingDetailModal from './BookingDetailModal';

export default function StadiumBookingView({ currentUser, triggerToast }) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'my-bookings'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Available', 'Limited Slots'

  // Modals state
  const [detailStadium, setDetailStadium] = useState(null);
  const [bookingStadium, setBookingStadium] = useState(null);
  const [activeBookingDetail, setActiveBookingDetail] = useState(null);

  // Bookings list state with localStorage & API sync
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('clubverse_stadium_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MOCK_BOOKINGS;
      }
    }
    return INITIAL_MOCK_BOOKINGS;
  });

  // Save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('clubverse_stadium_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Fetch bookings from MongoDB Express API on mount if available
  useEffect(() => {
    const fetchApiBookings = async () => {
      try {
        const userId = currentUser?.id || currentUser?._id || '';
        const url = userId 
          ? `http://localhost:5000/api/stadium-bookings?user_id=${userId}` 
          : 'http://localhost:5000/api/stadium-bookings';
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.bookings && data.bookings.length > 0) {
            // Merge API bookings with initial local mock bookings
            setBookings(prev => {
              const combined = [...data.bookings];
              prev.forEach(item => {
                if (!combined.some(c => c._id === item._id)) {
                  combined.push(item);
                }
              });
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn('Backend API note (using local bookings):', err);
      }
    };

    fetchApiBookings();
  }, [currentUser]);

  const [stadiums, setStadiums] = useState(STADIUMS_LIST);

  // Fetch stadiums from Express backend API
  useEffect(() => {
    const fetchApiStadiums = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stadiums');
        if (res.ok) {
          const data = await res.json();
          if (data.stadiums && data.stadiums.length > 0) {
            // Normalize backend Stadium objects
            const normalized = data.stadiums.map(s => ({
              id: s._id || s.id,
              name: s.name || s.stadium_name,
              location: s.location || '',
              capacity: s.capacity || '1,000 Seats',
              pricePerHour: s.price_per_hour || s.pricePerHour || 150,
              availabilityStatus: s.availability_status || s.availabilityStatus || 'Available',
              image: s.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
              gallery: s.gallery || [],
              pitchType: s.pitch_type || s.pitchType || 'FIFA Certified Hybrid Grass',
              dimensions: s.dimensions || '105m x 68m (UEFA Standard)',
              description: s.description || '',
              facilities: s.facilities || ['Floodlight System', '4 VIP Dressing Rooms'],
              blocked_dates: s.blocked_dates || s.blockedDates || [],
              seating_tiers: s.seating_tiers || s.seatingTiers || [],
              seatingTiers: s.seating_tiers || s.seatingTiers || [],
              rating: s.rating || 4.8,
              reviewsCount: s.reviews_count || s.reviewsCount || 50
            }));
            setStadiums(normalized);
          }
        }
      } catch (err) {
        console.warn('Backend API note (using local stadiums list):', err);
      }
    };

    fetchApiStadiums();
  }, []);

  // Filter stadiums based on search query and status filter
  const filteredStadiums = stadiums.filter(stadium => {
    const matchesSearch = stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stadium.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || stadium.availabilityStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle new booking creation
  const handleBookingComplete = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    // Try updating backend API
    try {
      await fetch(`http://localhost:5000/api/stadium-bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.warn('Backend API note (cancelling locally):', err);
    }

    setBookings(prev => prev.map(b => {
      if (b._id === bookingId) {
        return { ...b, booking_status: 'Cancelled' };
      }
      return b;
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#7A8B5A]/10 text-[#7A8B5A] border border-[#7A8B5A]/20">
              Fan Pitch Reservation
            </span>
          </div>
          <h2 className="font-serif font-black text-2xl lg:text-3xl text-[#20221F] mt-1">
            Stadium Booking & Pitch Rental
          </h2>
          <p className="text-xs text-[#6F716B] mt-0.5">
            Reserve FIFA-certified pitches, stadium arenas, and matchday training facilities in real-time
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-2 bg-[#EFEEE8]/80 p-1 rounded-full border border-[#E4E1D8]">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'explore'
                ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-sm'
                : 'text-[#6F716B] hover:text-[#20221F]'
            }`}
          >
            Explore Stadiums
          </button>
          
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all relative ${
              activeTab === 'my-bookings'
                ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-sm'
                : 'text-[#6F716B] hover:text-[#20221F]'
            }`}
          >
            My Bookings
            {bookings.filter(b => b.booking_status === 'Upcoming').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black bg-[#BEF264] text-[#20221F] rounded-full">
                {bookings.filter(b => b.booking_status === 'Upcoming').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: EXPLORE STADIUMS LISTING */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F5EF] p-4 rounded-2xl border border-[#E4E1D8]">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#6F716B] absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stadium name, location..."
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#6F716B] mr-1 hidden lg:inline">Status:</span>
              {['All', 'Available', 'Limited Slots'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                    statusFilter === st 
                      ? 'bg-[#20221F] text-white border-[#20221F]' 
                      : 'bg-[#FFFDF8] text-[#6F716B] border-[#E4E1D8] hover:border-[#7A8B5A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>

          {/* Stadium Cards Grid */}
          {filteredStadiums.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-3">
              <Building2 className="w-10 h-10 text-[#6F716B] mx-auto opacity-50" />
              <h4 className="font-serif font-black text-lg text-[#20221F]">No stadiums match your search</h4>
              <p className="text-xs text-[#6F716B]">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStadiums.map((stadium) => (
                <StadiumCard 
                  key={stadium.id}
                  stadium={stadium}
                  onViewDetails={(s) => setDetailStadium(s)}
                  onBookNow={(s) => setBookingStadium(s)}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: MY BOOKINGS LIST */}
      {activeTab === 'my-bookings' && (
        <MyBookingsView 
          bookings={bookings}
          onViewBookingDetails={(b) => setActiveBookingDetail(b)}
          onCancelBooking={handleCancelBooking}
          onGoToListing={() => setActiveTab('explore')}
        />
      )}

      {/* MODAL 1: STADIUM DETAILS */}
      <StadiumDetailModal 
        stadium={detailStadium}
        isOpen={Boolean(detailStadium)}
        onClose={() => setDetailStadium(null)}
        onStartBooking={(s) => {
          setDetailStadium(null);
          setBookingStadium(s);
        }}
      />

      {/* MODAL 2: BOOKING FLOW WIZARD */}
      <BookingFlowModal 
        stadium={bookingStadium}
        isOpen={Boolean(bookingStadium)}
        onClose={() => setBookingStadium(null)}
        currentUser={currentUser}
        existingBookings={bookings}
        onBookingComplete={handleBookingComplete}
        triggerToast={triggerToast}
      />

      {/* MODAL 3: BOOKING DETAIL & QR RECEIPT */}
      <BookingDetailModal 
        booking={activeBookingDetail}
        isOpen={Boolean(activeBookingDetail)}
        onClose={() => setActiveBookingDetail(null)}
        onCancelBooking={handleCancelBooking}
        triggerToast={triggerToast}
      />

    </motion.div>
  );
}
