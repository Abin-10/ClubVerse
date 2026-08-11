import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  LogOut, 
  User, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function PlayerHeader({ 
  currentUser, 
  searchQuery, 
  setSearchQuery,
  onOpenEditProfile
}) {
  const navigate = useNavigate();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'Matchday Squad Confirmed', time: '2 hours ago', unread: true, desc: 'You are selected in the Starting XI for Sunday derby vs Manchester City.' },
    { id: 2, title: 'Tactical Video Analysis Ready', time: '5 hours ago', unread: true, desc: 'Coach Arteta added new pressing breakdown videos for wingers.' },
    { id: 3, title: 'Physio Fitness Check', time: 'Yesterday', unread: false, desc: 'Recovery metrics passed. Ready for full training session.' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clubverse_user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#E4E1D8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 font-sans">
      
      {/* Left Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F716B]" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fixtures, training sessions, performance stats..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F5EF] text-xs font-semibold text-[#20221F] rounded-full border border-[#E4E1D8] focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] transition-all placeholder-[#6F716B]/60"
          />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        
        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7A8B5A]/10 border border-[#7A8B5A]/30 text-xs font-bold text-[#627146]">
          <Zap className="w-3.5 h-3.5 text-[#7A8B5A]" />
          <span>Squad Athlete • Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="relative p-2.5 rounded-2xl bg-[#F7F5EF] hover:bg-[#EFEEE8] border border-[#E4E1D8] text-[#20221F] transition-colors"
            title="Player Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7A8B5A] ring-2 ring-white"></span>
          </motion.button>

          <AnimatePresence>
            {showNotificationsDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl shadow-warm-lg p-4 space-y-3 z-50"
              >
                <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#7A8B5A]" />
                    <h4 className="font-serif font-black text-sm text-[#20221F]">Player Alerts</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BEF264] text-[#20221F]">
                    2 New
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-2xl border text-xs space-y-1 transition-colors ${
                        item.unread 
                          ? 'bg-[#F7F5EF] border-[#7A8B5A]/40' 
                          : 'bg-white border-[#E4E1D8]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#20221F]">{item.title}</span>
                        <span className="text-[10px] text-[#6F716B]">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#6F716B] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#F7F5EF] hover:bg-[#EFEEE8] border border-[#E4E1D8] transition-all"
          >
            <img 
              src={currentUser?.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'} 
              alt={currentUser?.name || 'Player'} 
              className="w-8 h-8 rounded-xl object-cover border border-[#7A8B5A]"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-[#20221F] leading-tight">
                {currentUser?.name || currentUser?.full_name || 'Bukayo Saka'}
              </div>
              <div className="text-[10px] text-[#6F716B] font-semibold">
                Player • #{currentUser?.jersey_number || 7}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl shadow-warm-lg p-3 space-y-1 z-50 text-xs font-bold"
              >
                <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8] mb-2">
                  <div className="text-[#20221F] font-black">{currentUser?.name || 'Bukayo Saka'}</div>
                  <div className="text-[10px] text-[#6F716B]">{currentUser?.email || 'saka7@clubverse.com'}</div>
                </div>

                <button 
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onOpenEditProfile) onOpenEditProfile();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#20221F] hover:bg-[#F7F5EF] transition-colors"
                >
                  <User className="w-4 h-4 text-[#7A8B5A]" />
                  <span>Edit Profile</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
