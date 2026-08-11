import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Plus, 
  Bell, 
  Mail, 
  ChevronDown, 
  Check, 
  Home,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminHeader({ 
  currentUser, 
  searchQuery, 
  setSearchQuery, 
  onAddPlayerClick, 
  onAddCoachClick 
}) {
  const navigate = useNavigate();
  const [topTab, setTopTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('2026 Season');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(4);

  const dateOptions = ['2026 Season', 'Q1 2026', 'This Month', 'All Time'];

  const adminAvatar = currentUser?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const handleLogout = () => {
    localStorage.removeItem('clubverse_user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="bg-[#FFFDF8] border-b border-[#E4E1D8] px-4 lg:px-8 py-4 space-y-4 shadow-warm-sm sticky top-0 z-30 font-sans">
      {/* Top Bar: Nav Pills, Top Right Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Side: Top Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#EFEEE8]/70 p-1 rounded-full border border-[#E4E1D8]">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#20221F] text-[#FFFDF8] shadow-warm-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BEF264]" />
              <span>Admin Portal</span>
            </span>
          </div>
        </div>

        {/* Right Side: Action Icons & Profile Dropdown */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotificationCount(0)}
              className="relative p-2 text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8] rounded-full transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </motion.button>

            {/* Profile Avatar & Interactive Logout Dropdown */}
            <div className="relative pl-2">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-0.5 rounded-full border border-[#E4E1D8] hover:border-[#7A8B5A] hover:bg-[#EFEEE8] transition-all group"
                title="Admin Account Options"
              >
                <img 
                  src={adminAvatar} 
                  alt="Admin Profile" 
                  className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition-transform border border-[#7A8B5A]/40"
                />
                <ChevronDown className={`w-3.5 h-3.5 text-[#6F716B] transition-transform duration-200 mr-1 ${showProfileMenu ? 'rotate-180 text-[#7A8B5A]' : ''}`} />
              </button>

              {/* Profile Dropdown Overlay */}
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
                        src={adminAvatar} 
                        alt="Admin Avatar" 
                        className="w-10 h-10 rounded-full border border-[#E4E1D8] object-cover" 
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#20221F] truncate">
                          {currentUser?.name || currentUser?.full_name || 'Club Admin'}
                        </h4>
                        <p className="text-[11px] text-[#6F716B] truncate">
                          {currentUser?.email || 'admin@clubverse.com'}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-[#20221F] text-[#BEF264]">
                          System Administrator
                        </span>
                      </div>
                    </div>

                    {/* Logout Button */}
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

      {/* Middle Row: Title Breadcrumb & Search / Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6F716B]">
            <span>ClubVerse Admin</span>
            <span>—</span>
            <span className="text-[#20221F] font-bold">Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#20221F] font-serif tracking-tight mt-0.5">
            Admin Dashboard
          </h1>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F716B]" />
            <input 
              type="text" 
              placeholder="Search players, coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-[#20221F] placeholder-[#6F716B] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all font-medium"
            />
          </div>

          {/* Quick Action Buttons */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddPlayerClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all shadow-warm-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#BEF264]" />
            <span>Add Player</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddCoachClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A8B5A] text-white text-xs font-bold hover:bg-[#627146] transition-all shadow-warm-sm"
          >
            <UserCheck className="w-3.5 h-3.5 text-white" />
            <span>Add Coach</span>
          </motion.button>

        </div>
      </div>
    </header>
  );
}
