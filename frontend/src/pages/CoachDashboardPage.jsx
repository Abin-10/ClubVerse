import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoachSidebar from '../components/coach/CoachSidebar';
import CoachHeader from '../components/coach/CoachHeader';
import CoachOverviewView from '../components/coach/CoachOverviewView';
import CoachPlayerManagementView from '../components/coach/CoachPlayerManagementView';
import CoachTrainingView from '../components/coach/CoachTrainingView';
import CoachPerformanceView from '../components/coach/CoachPerformanceView';
import CoachMatchesView from '../components/coach/CoachMatchesView';
import CoachNewsView from '../components/coach/CoachNewsView';
import CoachNotificationsView from '../components/coach/CoachNotificationsView';
import CreateTrainingModal from '../components/coach/CreateTrainingModal';
import EditPlayerProfileModal from '../components/player/EditPlayerProfileModal';
import FanSettingsView from '../components/dashboard/FanSettingsView';
import { CheckCircle2 } from 'lucide-react';

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [isCreateTrainingModalOpen, setIsCreateTrainingModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Players state from backend
  const [players, setPlayers] = useState([]);

  // ── Auth user from localStorage (identity / role) ──────────────────────────
  const authUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');

  // ── currentUser: start from localStorage, then enrich with DB record ────────
  const [currentUser, setCurrentUser] = useState(() => authUser || {
    name: 'Coach',
    email: '',
    role: 'Coach',
    profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'
  });

  // Fetch this coach's DB record (specialization, experience, nationality, photo)
  useEffect(() => {
    const email = authUser?.email;
    if (!email) return;

    fetch(`http://localhost:5000/api/coach/profile/${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.full_name) {
          // Merge DB fields — DB is the source of truth for coach fields
          setCurrentUser((prev) => ({
            ...prev,
            name: data.full_name,
            full_name: data.full_name,
            email: data.email || prev.email,
            specialization: data.specialization || prev.specialization,
            experience: data.experience ?? prev.experience,
            nationality: data.nationality || prev.nationality,
            profile_image: data.profile_image || prev.profile_image,
            phone: data.phone || prev.phone,
            status: data.status || prev.status,
            coachId: data.id
          }));
        }
      })
      .catch((err) => console.warn('Coach profile fetch:', err.message));
  }, []);

  // Fetch squad players from backend for CoachPlayerManagementView
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/players')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setPlayers(data); })
      .catch((err) => console.warn('Squad fetch:', err.message));
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#20221F] flex font-sans overflow-x-hidden selection:bg-[#7A8B5A] selection:text-white">
      
      {/* Left Icon Sidebar */}
      <CoachSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 pl-16 sm:pl-20">
        
        {/* Header */}
        <CoachHeader 
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateTrainingClick={() => setIsCreateTrainingModalOpen(true)}
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
                <CoachOverviewView 
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  onCreateTrainingClick={() => setIsCreateTrainingModalOpen(true)}
                  players={players}
                />
              </motion.div>
            )}

            {/* PLAYER MANAGEMENT TAB */}
            {activeTab === 'players' && (
              <motion.div
                key="players"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CoachPlayerManagementView 
                  players={players}
                  searchQuery={searchQuery}
                  onUpdatePerformance={(updatedPlayer) => {
                    setPlayers(prev => prev.map(p => p._id === updatedPlayer._id ? updatedPlayer : p));
                  }}
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}

            {/* TRAINING MANAGEMENT TAB */}
            {activeTab === 'training' && (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CoachTrainingView 
                  searchQuery={searchQuery}
                  isCreateModalOpen={isCreateTrainingModalOpen}
                  setIsCreateModalOpen={setIsCreateTrainingModalOpen}
                  triggerToast={triggerToast}
                />
              </motion.div>
            )}

            {/* PERFORMANCE ANALYSIS TAB */}
            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CoachPerformanceView />
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
                <CoachMatchesView searchQuery={searchQuery} />
              </motion.div>
            )}

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CoachNewsView triggerToast={triggerToast} />
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
                <CoachNotificationsView triggerToast={triggerToast} />
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
                  isAdmin={true}
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

      {/* Create Training Modal */}
      <CreateTrainingModal 
        isOpen={isCreateTrainingModalOpen}
        onClose={() => setIsCreateTrainingModalOpen(false)}
        onCreateTraining={() => {}}
        triggerToast={triggerToast}
      />

      {/* Edit Coach Profile Modal */}
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
