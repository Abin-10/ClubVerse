import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerSidebar from '../components/player/PlayerSidebar';
import PlayerHeader from '../components/player/PlayerHeader';
import PlayerOverviewView from '../components/player/PlayerOverviewView';
import PlayerProfileView from '../components/player/PlayerProfileView';
import PlayerTrainingView from '../components/player/PlayerTrainingView';
import PlayerPerformanceView from '../components/player/PlayerPerformanceView';
import PlayerMatchesView from '../components/player/PlayerMatchesView';
import PlayerNotificationsView from '../components/player/PlayerNotificationsView';
import EditPlayerProfileModal from '../components/player/EditPlayerProfileModal';
import FanSettingsView from '../components/dashboard/FanSettingsView';
import { HelpView } from '../components/dashboard/FanSidebarViews';
import { CheckCircle2 } from 'lucide-react';

export default function PlayerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // ── Auth user from localStorage (identity / role) ──────────────────────────
  const authUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');

  // ── currentUser: start from localStorage, then enrich with DB record ────────
  const [currentUser, setCurrentUser] = useState(() => authUser || {
    name: 'Player',
    email: '',
    role: 'Player',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  });

  // Fetch this player's DB record by email
  useEffect(() => {
    const email = authUser?.email;
    if (!email) return;

    fetch(`http://localhost:5000/api/player/profile/${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.full_name) {
          // Merge DB data over auth data — DB is the source of truth for player fields
          setCurrentUser((prev) => ({
            ...prev,
            name: data.full_name,
            full_name: data.full_name,
            email: data.email || prev.email,
            position: data.position || prev.position,
            jersey_number: data.jersey_number ?? prev.jersey_number,
            nationality: data.nationality || prev.nationality,
            preferred_foot: data.preferred_foot || 'Left',
            height: data.height || '178 cm',
            weight: data.weight || '72 kg',
            contract_term: data.contract_term || 'June 2029',
            role_access: data.role_access || 'First Team Professional Player',
            market_value: data.market_value || '€120M',
            medical_clearance: data.medical_clearance || '100% Match Fit',
            bio: data.bio || 'Passionate ClubVerse VIP Supporter ⚽',
            profile_image: data.profile_image || prev.profile_image,
            date_of_birth: data.date_of_birth || prev.date_of_birth,
            phone: data.phone || prev.phone,
            status: data.status || prev.status,
            playerId: data.id
          }));
        }
      })
      .catch((err) => console.warn('Player profile fetch:', err.message));
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#20221F] flex font-sans overflow-x-hidden selection:bg-[#7A8B5A] selection:text-white">
      
      {/* Left Icon Sidebar */}
      <PlayerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <PlayerHeader 
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        />

        {/* Dashboard Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6 flex-1">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerOverviewView 
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {/* MY PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerProfileView 
                  currentUser={currentUser}
                  onUpdateUserData={(updated) => setCurrentUser(updated)}
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}

            {/* TRAINING TAB */}
            {activeTab === 'training' && (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerTrainingView 
                  searchQuery={searchQuery}
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}

            {/* MY PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerPerformanceView />
              </motion.div>
            )}

            {/* MATCHES TAB */}
            {activeTab === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerMatchesView 
                  searchQuery={searchQuery}
                />
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PlayerNotificationsView 
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FanSettingsView 
                  currentUser={currentUser}
                  onUpdateUserData={(updated) => setCurrentUser(updated)}
                  triggerToast={triggerToast}
                />
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
            className="fixed bottom-6 right-6 z-50 bg-[#20221F] text-white px-5 py-3 rounded-2xl shadow-warm-lg border border-[#7A8B5A]/40 flex items-center gap-3 font-sans"
          >
            <CheckCircle2 className="w-5 h-5 text-[#BEF264]" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <EditPlayerProfileModal 
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => setCurrentUser(updated)}
        triggerToast={triggerToast}
      />

    </div>
  );
}
