import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverviewView from '../components/admin/AdminOverviewView';
import PlayerManagementView from '../components/admin/PlayerManagementView';
import CoachManagementView from '../components/admin/CoachManagementView';
import PlayerModal from '../components/admin/PlayerModal';
import CoachModal from '../components/admin/CoachModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import FanSettingsView from '../components/dashboard/FanSettingsView';
import { HelpView } from '../components/dashboard/FanSidebarViews';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'players' | 'coaches' | 'settings' | 'help'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Data states
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    totalCoaches: 0,
    activeCoaches: 0,
    upcomingMatchesCount: 4,
    recentActivitiesCount: 12
  });
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);

  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [coachToEdit, setCoachToEdit] = useState(null);

  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    itemType: '',
    itemName: '',
    itemToDelete: null
  });

  // Current admin profile from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem('clubverse_user') || 'null');
    return user || {
      name: 'Club Administrator',
      email: 'admin@clubverse.com',
      role: 'Admin',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch initial data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, playersRes, coachesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats'),
        fetch('http://localhost:5000/api/admin/players'),
        fetch('http://localhost:5000/api/admin/coaches')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData);
      }
      if (coachesRes.ok) {
        const coachesData = await coachesRes.json();
        setCoaches(coachesData);
      }
    } catch (err) {
      console.warn('Backend fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------------------------------------
  // PLAYER CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddPlayer = () => {
    setPlayerToEdit(null);
    setIsPlayerModalOpen(true);
  };

  const handleOpenEditPlayer = (player) => {
    setPlayerToEdit(player);
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = async (playerData) => {
    try {
      const isEdit = Boolean(playerData._id);
      const url = isEdit 
        ? `http://localhost:5000/api/admin/players/${playerData._id}` 
        : 'http://localhost:5000/api/admin/players';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save player');
      }

      setIsPlayerModalOpen(false);
      triggerToast(isEdit ? `${playerData.full_name} updated successfully!` : `${playerData.full_name} added to squad!`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving player.');
    }
  };

  const handleOpenDeletePlayer = (player) => {
    setDeleteModalConfig({
      isOpen: true,
      itemType: 'Player',
      itemName: `${player.full_name} (#${player.jersey_number || 'N/A'})`,
      itemToDelete: player
    });
  };

  // ----------------------------------------------------
  // COACH CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddCoach = () => {
    setCoachToEdit(null);
    setIsCoachModalOpen(true);
  };

  const handleOpenEditCoach = (coach) => {
    setCoachToEdit(coach);
    setIsCoachModalOpen(true);
  };

  const handleSaveCoach = async (coachData) => {
    try {
      const isEdit = Boolean(coachData._id);
      const url = isEdit 
        ? `http://localhost:5000/api/admin/coaches/${coachData._id}` 
        : 'http://localhost:5000/api/admin/coaches';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coachData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save coach');
      }

      setIsCoachModalOpen(false);
      triggerToast(isEdit ? `${coachData.full_name} updated successfully!` : `${coachData.full_name} appointed to coaching staff!`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving coach.');
    }
  };

  const handleOpenDeleteCoach = (coach) => {
    setDeleteModalConfig({
      isOpen: true,
      itemType: 'Coach',
      itemName: `${coach.full_name} (${coach.specialization || 'Staff'})`,
      itemToDelete: coach
    });
  };

  // ----------------------------------------------------
  // CONFIRM DELETION
  // ----------------------------------------------------
  const handleConfirmDelete = async () => {
    const { itemType, itemToDelete } = deleteModalConfig;
    if (!itemToDelete) return;

    try {
      const endpoint = itemType === 'Player' ? 'players' : 'coaches';
      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}/${itemToDelete._id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete record');
      }

      setDeleteModalConfig({ isOpen: false, itemType: '', itemName: '', itemToDelete: null });
      triggerToast(`${itemToDelete.full_name} removed permanently.`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error deleting item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#20221F] flex font-sans overflow-x-hidden selection:bg-[#7A8B5A] selection:text-white">
      
      {/* Left Icon Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <AdminHeader 
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddPlayerClick={handleOpenAddPlayer}
          onAddCoachClick={handleOpenAddCoach}
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
                <AdminOverviewView 
                  stats={stats}
                  onNavigateToPlayers={() => setActiveTab('players')}
                  onNavigateToCoaches={() => setActiveTab('coaches')}
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
                <PlayerManagementView 
                  players={players}
                  searchQuery={searchQuery}
                  onAddPlayer={handleOpenAddPlayer}
                  onEditPlayer={handleOpenEditPlayer}
                  onDeletePlayer={handleOpenDeletePlayer}
                />
              </motion.div>
            )}

            {/* COACH MANAGEMENT TAB */}
            {activeTab === 'coaches' && (
              <motion.div
                key="coaches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CoachManagementView 
                  coaches={coaches}
                  searchQuery={searchQuery}
                  onAddCoach={handleOpenAddCoach}
                  onEditCoach={handleOpenEditCoach}
                  onDeleteCoach={handleOpenDeleteCoach}
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
                  isAdmin={true}
                />
              </motion.div>
            )}

            {/* HELP TAB */}
            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <HelpView />
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* Floating Toast Alert */}
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

      {/* MODALS */}
      <PlayerModal 
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        onSave={handleSavePlayer}
        playerToEdit={playerToEdit}
      />

      <CoachModal 
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
        onSave={handleSaveCoach}
        coachToEdit={coachToEdit}
      />

      <DeleteConfirmModal 
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, itemType: '', itemName: '', itemToDelete: null })}
        onConfirm={handleConfirmDelete}
        itemType={deleteModalConfig.itemType}
        itemName={deleteModalConfig.itemName}
      />

    </div>
  );
}
