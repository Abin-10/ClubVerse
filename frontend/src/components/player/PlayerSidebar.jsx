import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Calendar, 
  Activity, 
  Trophy, 
  Bell, 
  Settings, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PlayerSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'training', icon: Calendar, label: 'Training' },
    { id: 'performance', icon: Activity, label: 'My Performance' },
    { id: 'matches', icon: Trophy, label: 'Matches' },
  ];

  const bottomItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 h-screen bg-[#FFFDF8] border-r border-[#E4E1D8] flex flex-col items-center py-6 justify-between flex-shrink-0 z-50 shadow-warm-sm overflow-y-auto font-sans">
      {/* Brand Icon / Player Badge */}
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('overview')}
          title="ClubVerse Player Portal"
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#20221F] via-[#2E332B] to-[#7A8B5A] text-[#FFFDF8] flex items-center justify-center font-black text-lg shadow-warm-md cursor-pointer border border-[#7A8B5A]/40"
        >
          <Zap className="w-5 h-5 text-[#BEF264]" />
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#20221F] text-[#FFFDF8] shadow-warm-md' 
                    : 'text-[#6F716B] hover:bg-[#EFEEE8] hover:text-[#20221F]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.span 
                    layoutId="activePlayerSidebarIndicator"
                    className="absolute -right-1 w-1.5 h-5 bg-[#7A8B5A] rounded-full" 
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-[#20221F] text-[#FFFDF8]' 
                  : 'text-[#6F716B] hover:bg-[#EFEEE8] hover:text-[#20221F]'
              }`}
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
