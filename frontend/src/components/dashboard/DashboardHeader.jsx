import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Plus, 
  FileText, 
  Bell, 
  Mail, 
  ChevronDown, 
  Check, 
  Sparkles,
  ArrowLeft,
  Home,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardHeader({ currentUser, onAddPassClick, onCreateReportClick }) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('20-27 Jan 2026');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);

  const dateOptions = ['20-27 Jan 2026', '01-07 Feb 2026', 'This Month', 'All Season'];

  const userAvatar = currentUser?.profile_image || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80';

  const handleLogout = () => {
    localStorage.removeItem('clubverse_user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="bg-[#FFFDF8] border-b border-[#E4E1D8] px-4 lg:px-8 py-4 space-y-4 shadow-warm-sm sticky top-0 z-30 font-sans">
      {/* Top Bar: User Controls & Profile Dropdown */}
      <div className="flex flex-wrap items-center justify-end gap-4">

        {/* Right Side: User Controls & Profile Dropdown with Logout */}
        <div className="flex items-center gap-3">

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotificationCount(0)}
              className="relative p-2 text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] rounded-full transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] rounded-full transition-colors"
              title="Messages"
            >
              <Mail className="w-4 h-4" />
            </motion.button>

            {/* Profile Avatar & Interactive Logout Dropdown (Top Right) */}
            <div className="relative pl-2">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-0.5 rounded-full border border-[#E4E1D8] hover:border-[#7A8B5A] hover:bg-[#EFEEE8] transition-all group"
                title="User Menu & Options"
              >
                <img 
                  src={userAvatar} 
                  alt="Fan Profile" 
                  className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition-transform"
                />
                <ChevronDown className={`w-3.5 h-3.5 text-[#6F716B] transition-transform duration-200 mr-1 ${showProfileMenu ? 'rotate-180 text-[#7A8B5A]' : ''}`} />
              </button>

              {/* Top Right Profile Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl shadow-warm-lg py-3 z-50 overflow-hidden font-sans"
                  >
                    {/* User Header Info */}
                    <div className="px-4 pb-3 border-b border-[#E4E1D8] flex items-center gap-3">
                      <img 
                        src={userAvatar} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full border border-[#E4E1D8] object-cover" 
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#20221F] truncate">
                          {currentUser?.name || currentUser?.full_name || 'Fan Account'}
                        </h4>
                        <p className="text-[11px] text-[#6F716B] truncate">
                          {currentUser?.email || 'fan@clubverse.com'}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A]">
                          {currentUser?.role || 'Fan'} Member
                        </span>
                      </div>
                    </div>

                    {/* Prominent Red Logout Button (Below Profile Image) */}
                    <div className="pt-2 px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                          <span>Log Out</span>
                        </div>
                        <span className="text-[10px] text-red-400 font-semibold">End Session</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>

      {/* Middle Row: Title Breadcrumbs & Search / Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        
        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6F716B]">
            <span>Home Page</span>
            <span>—</span>
            <span className="text-[#20221F] font-bold">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#20221F] font-serif tracking-tight mt-0.5">
            Fan Dashboard
          </h1>
        </div>

        {/* Interactive Action Bar: Search, Sliders, Date Picker, Report */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
            <input 
              type="text" 
              placeholder="Search stats, passes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] placeholder-[#6F716B] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
            />
          </div>

          {/* Filter Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] transition-colors"
            title="Filter Analytics"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </motion.button>

          {/* Date Picker Dropdown */}
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] hover:bg-[#EFEEE8] transition-all shadow-warm-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3 h-3 text-[#6F716B]" />
            </motion.button>

            <AnimatePresence>
              {showDatePicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-[#FFFDF8] border border-[#E4E1D8] rounded-2xl shadow-warm-lg py-2 z-50 overflow-hidden"
                >
                  {dateOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDateRange(opt);
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between text-[#20221F] hover:bg-[#EFEEE8] transition-colors"
                    >
                      <span>{opt}</span>
                      {dateRange === opt && <Check className="w-3.5 h-3.5 text-[#7A8B5A]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Create a Report CTA */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCreateReportClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all shadow-warm-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create a report</span>
          </motion.button>

        </div>
      </div>
    </header>
  );
}
