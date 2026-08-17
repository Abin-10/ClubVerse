import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  Ticket,
  Check,
  X,
  FileText
} from 'lucide-react';
import StadiumModal from './StadiumModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function StadiumManagementView({ triggerToast }) {
  const [activeSubTab, setActiveSubTab] = useState('stadiums'); // 'stadiums' or 'bookings'
  
  // Data states
  const [stadiums, setStadiums] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  // Filter states
  const [stadiumSearch, setStadiumSearch] = useState('');
  const [stadiumStatusFilter, setStadiumStatusFilter] = useState('All');

  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('Pending'); // 'Pending', 'Confirmed', 'Rejected', 'All'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stadiumToEdit, setStadiumToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch stadiums from Express API
  const fetchStadiums = async () => {
    try {
      setLoadingStadiums(true);
      const res = await fetch('http://localhost:5000/api/stadiums');
      if (res.ok) {
        const data = await res.json();
        if (data.stadiums) setStadiums(data.stadiums);
      }
    } catch (err) {
      console.warn('Backend fetch note (stadiums):', err);
    } finally {
      setLoadingStadiums(false);
    }
  };

  // Fetch bookings from Express API
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await fetch('http://localhost:5000/api/stadium-bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) setBookings(data.bookings);
      }
    } catch (err) {
      console.warn('Backend fetch note (bookings):', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchStadiums();
    fetchBookings();
  }, []);

  // Filter stadiums
  const filteredStadiums = stadiums.filter(s => {
    const nameStr = s.name || s.stadium_name || '';
    const locStr = s.location || '';
    const matchesSearch = nameStr.toLowerCase().includes(stadiumSearch.toLowerCase()) ||
                          locStr.toLowerCase().includes(stadiumSearch.toLowerCase());
    const matchesStatus = stadiumStatusFilter === 'All' || (s.availability_status || s.availabilityStatus) === stadiumStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const nameStr = b.user_name || '';
    const stadStr = b.stadium_name || '';
    const matchesSearch = nameStr.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          stadStr.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b._id.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'All' || b.booking_status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter(b => b.booking_status === 'Pending').length;

  // Open modal for new stadium
  const handleOpenAdd = () => {
    setStadiumToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for editing stadium
  const handleOpenEdit = (stadium) => {
    setStadiumToEdit(stadium);
    setIsModalOpen(true);
  };

  // Save Stadium (Create / Update)
  const handleSaveStadium = async (stadiumData) => {
    try {
      const isEdit = Boolean(stadiumData._id);
      const url = isEdit 
        ? `http://localhost:5000/api/stadiums/${stadiumData._id}`
        : 'http://localhost:5000/api/stadiums';
      
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stadiumData)
      });

      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setStadiums(prev => prev.map(s => s._id === stadiumData._id ? data.stadium : s));
          if (triggerToast) triggerToast(`Stadium "${stadiumData.name}" updated in database.`);
        } else {
          setStadiums(prev => [data.stadium, ...prev]);
          if (triggerToast) triggerToast(`New Stadium "${stadiumData.name}" saved to database!`);
        }
      }
    } catch (err) {
      if (triggerToast) triggerToast('Network error saving stadium.');
    }
  };

  // Delete Stadium
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`http://localhost:5000/api/stadiums/${deleteTarget._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStadiums(prev => prev.filter(s => s._id !== deleteTarget._id));
        if (triggerToast) triggerToast(`Stadium deleted from database.`);
      }
    } catch (err) {
      if (triggerToast) triggerToast('Failed to delete stadium.');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Update Booking Status in MongoDB (Accept / Reject)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stadium-bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => {
          if (b._id === bookingId) {
            return { ...b, booking_status: newStatus };
          }
          return b;
        }));

        const statusMsg = newStatus === 'Confirmed' ? 'ACCEPTED & CONFIRMED' : 'REJECTED';
        if (triggerToast) triggerToast(`Booking ${bookingId} has been ${statusMsg} in MongoDB!`);
      }
    } catch (err) {
      if (triggerToast) triggerToast('Failed to update booking status in DB.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-sans text-[#20221F]"
    >
      {/* Top Banner & Main Sub-tab Navigation */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 lg:p-8 shadow-warm-md space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#7A8B5A]/10 text-[#7A8B5A] border border-[#7A8B5A]/20">
                Admin Database Center
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl lg:text-3xl text-[#20221F] mt-1">
              Stadium & Booking Administration
            </h2>
          </div>

          {/* Sub-tab Selector Pills */}
          <div className="flex items-center gap-2 bg-[#EFEEE8]/80 p-1 rounded-full border border-[#E4E1D8]">
            <button
              onClick={() => setActiveSubTab('stadiums')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeSubTab === 'stadiums'
                  ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-sm'
                  : 'text-[#6F716B] hover:text-[#20221F]'
              }`}
            >
              Manage Stadiums ({stadiums.length})
            </button>

            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all relative ${
                activeSubTab === 'bookings'
                  ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-sm'
                  : 'text-[#6F716B] hover:text-[#20221F]'
              }`}
            >
              Booking Requests
              {pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black bg-amber-400 text-amber-950 rounded-full">
                  {pendingCount} Pending
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SUB-TAB 1: MANAGE STADIUMS */}
        {activeSubTab === 'stadiums' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#6F716B] absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={stadiumSearch}
                  onChange={(e) => setStadiumSearch(e.target.value)}
                  placeholder="Search stadiums..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {['All', 'Available', 'Limited Slots', 'Maintenance'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStadiumStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                        stadiumStatusFilter === st 
                          ? 'bg-[#20221F] text-white border-[#20221F]' 
                          : 'bg-[#F7F5EF] text-[#6F716B] border-[#E4E1D8]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all flex items-center gap-2 flex-shrink-0 shadow-warm-sm"
                >
                  <Plus className="w-4 h-4 text-[#BEF264]" />
                  <span>Add Stadium</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: BOOKING REQUESTS (APPROVAL WORKFLOW) */}
        {activeSubTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#6F716B] absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by fan name, stadium, or pass ID..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-[#6F716B] mr-1">Status:</span>
                {['Pending', 'Confirmed', 'Rejected', 'All'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                      bookingStatusFilter === st 
                        ? 'bg-[#20221F] text-white border-[#20221F]' 
                        : 'bg-[#F7F5EF] text-[#6F716B] border-[#E4E1D8]'
                    }`}
                  >
                    {st === 'Pending' ? '⚠️ Pending Approval' : st === 'Confirmed' ? '✓ Accepted' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONTENT AREA 1: STADIUMS LIST */}
      {activeSubTab === 'stadiums' && (
        loadingStadiums ? (
          <div className="p-12 text-center text-xs font-bold text-[#6F716B]">Loading stadiums from MongoDB...</div>
        ) : filteredStadiums.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-3">
            <Building className="w-10 h-10 text-[#6F716B] mx-auto opacity-50" />
            <h4 className="font-serif font-black text-lg text-[#20221F]">No stadiums found</h4>
            <p className="text-xs text-[#6F716B]">Click "+ Add Stadium" to publish a new venue in MongoDB.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStadiums.map((stadium) => {
              const name = stadium.name || stadium.stadium_name;
              const status = stadium.availability_status || stadium.availabilityStatus || 'Available';
              const img = stadium.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80';
              const blockedDates = stadium.blocked_dates || stadium.blockedDates || [];

              return (
                <div 
                  key={stadium._id}
                  className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl overflow-hidden shadow-warm-md flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-[#20221F]">
                    <img src={img} alt={name} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#20221F] to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
                        status === 'Available' 
                          ? 'bg-[#20221F]/80 text-[#BEF264] border-[#BEF264]/40' 
                          : status === 'Maintenance'
                          ? 'bg-red-900/80 text-red-300 border-red-500/40'
                          : 'bg-[#20221F]/80 text-amber-300 border-amber-400/40'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif font-black text-lg text-white">{name}</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#BEF264]" />
                        <span className="truncate">{stadium.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#6F716B]">
                        <span>Capacity:</span>
                        <span className="font-bold text-[#20221F]">{stadium.capacity || '250 Seats'}</span>
                      </div>

                      {blockedDates.length > 0 && (
                        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 font-bold flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-red-600 flex-shrink-0" />
                          <span>{blockedDates.length} Date(s) Blocked</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2 border-t border-[#E4E1D8]">
                      <button 
                        onClick={() => handleOpenEdit(stadium)}
                        className="flex-1 py-2 px-3 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#20221F] bg-[#F7F5EF] hover:bg-[#E4E1D8] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#7A8B5A]" />
                        Edit
                      </button>

                      <button 
                        onClick={() => setDeleteTarget(stadium)}
                        className="p-2 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Stadium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* CONTENT AREA 2: BOOKING REQUESTS (APPROVAL WORKFLOW) */}
      {activeSubTab === 'bookings' && (
        loadingBookings ? (
          <div className="p-12 text-center text-xs font-bold text-[#6F716B]">Loading booking requests from MongoDB...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-3">
            <Ticket className="w-10 h-10 text-[#6F716B] mx-auto opacity-50" />
            <h4 className="font-serif font-black text-lg text-[#20221F]">No booking requests found</h4>
            <p className="text-xs text-[#6F716B]">Fan stadium booking requests will appear here for Admin review and approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isPending = b.booking_status === 'Pending';
              const isConfirmed = b.booking_status === 'Confirmed';
              const isRejected = b.booking_status === 'Rejected';

              return (
                <div 
                  key={b._id}
                  className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-5 sm:p-6 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#7A8B5A] bg-[#F7F5EF] px-2.5 py-1 rounded-lg border border-[#E4E1D8]">
                        {b._id}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isPending 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' 
                          : isConfirmed 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        {isPending ? '⚠️ Pending Approval' : isConfirmed ? '✓ Accepted / Confirmed' : '× Rejected'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-black text-lg text-[#20221F]">
                        {b.stadium_name}
                      </h4>
                      <p className="text-xs text-[#6F716B]">
                        Matchday: <span className="font-bold text-[#20221F]">{b.match_title || 'ClubVerse Match'}</span> • Date: <span className="font-bold text-[#20221F]">{b.booking_date}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6F716B] pt-1">
                      <div>
                        <span>Fan Name: </span>
                        <strong className="text-[#20221F]">{b.user_name}</strong> ({b.user_email})
                      </div>
                      <div>
                        <span>Seats Reserved: </span>
                        <strong className="text-[#7A8B5A]">{b.selected_seats?.length || b.total_seats || 1} Seat(s)</strong>
                      </div>
                      <div>
                        <span>Total Paid: </span>
                        <strong className="text-[#20221F] font-serif font-black text-sm">${b.total_price}</strong>
                      </div>
                    </div>

                    {b.selected_seats && b.selected_seats.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {b.selected_seats.map((seatStr, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-[#F7F5EF] border border-[#E4E1D8] text-[10px] font-bold text-[#20221F]">
                            {seatStr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Actions for Admin Acceptance */}
                  <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#E4E1D8]">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed')}
                          className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all flex items-center justify-center gap-1.5 shadow-warm-sm"
                        >
                          <Check className="w-4 h-4 text-[#BEF264]" />
                          <span>Accept & Approve</span>
                        </button>

                        <button
                          onClick={() => handleUpdateBookingStatus(b._id, 'Rejected')}
                          className="flex-1 md:flex-initial px-4 py-2.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                        >
                          <X className="w-4 h-4 text-red-600" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-right">
                        <span className={`text-xs font-bold block ${isConfirmed ? 'text-emerald-700' : 'text-red-700'}`}>
                          {isConfirmed ? '✓ Booking Accepted' : '× Booking Rejected'}
                        </span>
                        {isConfirmed && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b._id, 'Rejected')}
                            className="text-[10px] font-bold text-red-600 hover:underline mt-1"
                          >
                            Revoke Approval
                          </button>
                        )}
                        {isRejected && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed')}
                            className="text-[10px] font-bold text-[#7A8B5A] hover:underline mt-1"
                          >
                            Re-Approve Booking
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )
      )}

      {/* MODAL 1: STADIUM EDIT / CREATE */}
      <StadiumModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stadiumToEdit={stadiumToEdit}
        onSaveStadium={handleSaveStadium}
      />

      {/* MODAL 2: DELETE CONFIRMATION */}
      <DeleteConfirmModal 
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.name || 'Stadium'}
        itemType="Stadium"
      />

    </motion.div>
  );
}
