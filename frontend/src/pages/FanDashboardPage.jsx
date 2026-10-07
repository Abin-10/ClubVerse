import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ActivityChartCard from '../components/dashboard/ActivityChartCard';
import VirtualCardWidget from '../components/dashboard/VirtualCardWidget';
import SpendingChartCard from '../components/dashboard/SpendingChartCard';
import PerksDonutCard from '../components/dashboard/PerksDonutCard';
import FanPollWidget from '../components/dashboard/FanPollWidget';
import FanSettingsView from '../components/dashboard/FanSettingsView';
import StadiumBookingView from '../components/stadium/StadiumBookingView';
import TicketBookingPage from '../components/stadium/TicketBookingPage';
import CommunityView from '../components/community/CommunityView';
import SquadView from '../components/squad/SquadView';
import FanTicketDetailsDashboard from '../components/stadium/FanTicketDetailsDashboard';
import {
  WalletView,
  AnalyticsView,
  TicketsView,
  HelpView
} from '../components/dashboard/FanSidebarViews';
import TicketBookingModal from '../components/modals/TicketBookingModal';

import { Sparkles, CheckCircle2, FileText, Download, X, Plus } from 'lucide-react';

export default function FanDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Logged in user state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('clubverse_user') || 'null');
    } catch (e) {
      return null;
    }
  });

  // Dynamic Dashboard Data State from DB
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch updated user profile & dashboard stats from MongoDB on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      let storedUser = null;
      try {
        storedUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');
      } catch (e) {
        storedUser = null;
      }
      const userId = storedUser?.id || storedUser?._id || 'guest';
      try {
        const res = await fetch(`http://localhost:5000/api/fan/dashboard/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setDashboardData(data);
            if (data.user && storedUser) {
              const updated = { ...storedUser, ...data.user };
              setCurrentUser(updated);
              localStorage.setItem('clubverse_user', JSON.stringify(updated));
            }
          }
        }
      } catch (err) {
        console.warn('Backend server fetch fan dashboard note:', err);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle Wallet Top-Up via DB API
  const handleWalletTopUp = async (amount) => {
    const userId = currentUser?.id || currentUser?._id;
    try {
      const res = await fetch('http://localhost:5000/api/fan/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wallet) {
          setDashboardData(prev => ({
            ...prev,
            wallet: data.wallet
          }));
          triggerToast(data.message || `Wallet topped up with ₹${amount}!`);
        }
      }
    } catch (err) {
      console.error('Failed to top up wallet:', err);
      triggerToast('Wallet top-up failed. Please try again.');
    }
  };

  // Handle Fan Match Poll Vote via DB API
  const handlePollVote = async (optionId, pollId) => {
    const userId = currentUser?.id || currentUser?._id;
    try {
      const res = await fetch('http://localhost:5000/api/fan/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pollId, optionId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.poll) {
          setDashboardData(prev => ({
            ...prev,
            poll: data.poll
          }));
          if (data.fan_points) {
            setCurrentUser(prev => prev ? { ...prev, fan_points: data.fan_points } : prev);
          }
          triggerToast(data.message || 'Vote recorded! +50 VIP Points Claimed');
        }
      }
    } catch (err) {
      console.error('Failed to vote in poll:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#20221F] flex font-sans overflow-x-hidden selection:bg-[#7A8B5A] selection:text-white">
      {/* Fixed Left Icon Sidebar */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-16 sm:pl-20">
        {/* Header */}
        <DashboardHeader
          currentUser={currentUser}
          onAddPassClick={() => setIsTicketModalOpen(true)}
          onCreateReportClick={() => setShowReportModal(true)}
        />

        {/* Dashboard Canvas Container */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6 flex-1">

          {/* Top Banner Alert / Welcome Toast */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-white p-4 rounded-3xl shadow-warm-md flex flex-wrap items-center justify-between gap-4 border border-white/10"
          >
            <div className="flex items-center gap-3">
              {currentUser && currentUser.profile_image ? (
                <img
                  src={currentUser.profile_image}
                  alt="Avatar"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-[#BEF264]"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-[#BEF264]" />
                </div>
              )}
              <div>
                <h2 className="font-serif font-black text-lg">
                  Welcome back, {currentUser ? currentUser.name || currentUser.full_name : 'ClubVerse Supporter'}!
                </h2>
              </div>
            </div>
          </motion.div>

          {/* DYNAMIC TAB VIEWS BASED ON SIDEBAR SELECTION */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Grid Layout - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Widget 1: Weekly Activity Bar Chart (186h) */}
                  <div className="lg:col-span-6">
                    <ActivityChartCard activityData={dashboardData?.activity} />
                  </div>

                  {/* Widget 2: Virtual Wallet & Mint Green VISA Card */}
                  <div className="lg:col-span-6">
                    <VirtualCardWidget
                      walletData={dashboardData?.wallet}
                      onTopUp={handleWalletTopUp}
                    />
                  </div>
                </div>

                {/* Grid Layout - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Widget 4: Total Spent Line Chart (₹820.65) */}
                  <div className="lg:col-span-6">
                    <SpendingChartCard spendingData={dashboardData?.spending} />
                  </div>

                  {/* Widget 5: Donut Contract Type Breakdown */}
                  <div className="lg:col-span-3">
                    <PerksDonutCard perksData={dashboardData?.perks} />
                  </div>

                  {/* Widget 6: Live Fan Match Poll */}
                  <div className="lg:col-span-3">
                    <FanPollWidget
                      pollData={dashboardData?.poll}
                      onVote={handlePollVote}
                    />
                  </div>
                </div>

                {/* Grid Layout - Row 3: Club Teams & Flippable Player Cards */}
                <div className="pt-4">
                  <SquadView />
                </div>
              </motion.div>
            )}

            {/* TAB: SQUAD & TEAMS */}
            {activeTab === 'squad' && (
              <motion.div key="squad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SquadView />
              </motion.div>
            )}

            {/* TAB: SETTINGS (MongoDB Profile & Password Update) */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FanSettingsView
                  currentUser={currentUser}
                  onUpdateUserData={(newUser) => setCurrentUser(newUser)}
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}



            {/* TAB: BOOK TICKETS */}
            {activeTab === 'booktickets' && (
              <motion.div key="booktickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <TicketBookingPage currentUser={currentUser} triggerToast={triggerToast} />
              </motion.div>
            )}

            {/* TAB: MY BOOKED TICKETS & DETAILS DASHBOARD */}
            {activeTab === 'mytickets' && (
              <motion.div key="mytickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <FanTicketDetailsDashboard
                  currentUser={currentUser}
                  triggerToast={triggerToast}
                  onNavigateToBooking={() => setActiveTab('booktickets')}
                />
              </motion.div>
            )}







            {/* TAB: FAN CLUB COMMUNITY */}
            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <CommunityView currentUser={currentUser} triggerToast={triggerToast} />
              </motion.div>
            )}

            {/* TAB: HELP CENTER */}
            {activeTab === 'help' && (
              <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <HelpView />
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#20221F] text-white px-5 py-3 rounded-2xl shadow-warm-lg border border-[#7A8B5A]/40 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-[#BEF264]" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pass Booking Modal */}
      <TicketBookingModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticketTier={{ id: 'vip-pass', name: 'Fan VIP Pass', price: 120 }}
      />

      {/* Create Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-warm-lg space-y-5 relative"
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#20221F] text-white flex items-center justify-center shadow-warm-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#20221F]">Export Fan Analytics</h3>
                  <p className="text-xs text-[#6F716B]">Generate PDF or CSV report of activity</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20221F]">Matchday Engagement Report</span>
                  <span className="text-[10px] text-[#7A8B5A] font-extrabold">PDF</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20221F]">Wallet Transactions & Spendings</span>
                  <span className="text-[10px] text-[#7A8B5A] font-extrabold">CSV</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowReportModal(false);
                  triggerToast('Report downloaded to device');
                }}
                className="w-full py-3 rounded-full bg-[#20221F] text-white font-bold text-xs shadow-warm-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#BEF264]" />
                <span>Download Report Now</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
