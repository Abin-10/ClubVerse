import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Calendar, Trophy, Newspaper, Sparkles } from 'lucide-react';

export default function PlayerNotificationsView({ triggerToast }) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Starting XI Selected vs Manchester City',
      category: 'match',
      time: '2 hours ago',
      unread: true,
      desc: 'Coach Arteta has named you in the starting lineup for Sunday derby match at Spotify Arena.'
    },
    {
      id: 2,
      title: 'Tomorrow Morning Training Schedule',
      category: 'training',
      time: '5 hours ago',
      unread: true,
      desc: 'High-press tactics session begins sharp at 09:30 AM on Pitch 1.'
    },
    {
      id: 3,
      title: 'Club Announcement: New Recovery Center Opened',
      category: 'announcement',
      time: '1 day ago',
      unread: false,
      desc: 'First team players have priority access to the state-of-the-art cryotherapy suites.'
    },
    {
      id: 4,
      title: 'Matchday Squad Travel Details',
      category: 'match',
      time: '2 days ago',
      unread: false,
      desc: 'Team bus departure to stadium confirmed for 14:15 BST.'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    if (triggerToast) triggerToast('All notifications marked as read.');
  };

  const filteredNotifs = notifications.filter(n => filter === 'all' || n.category === filter);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Player Notifications & Alerts
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Stay updated with match updates, training reminders, and official squad announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'match', 'training', 'announcement'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                filter === cat 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 rounded-full bg-[#7A8B5A]/15 hover:bg-[#7A8B5A]/25 text-[#627146] text-xs font-bold transition-all"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-3xl border transition-colors flex items-start gap-4 ${
              item.unread 
                ? 'bg-[#FFFDF8] border-[#7A8B5A]/50 shadow-warm-md' 
                : 'bg-[#F7F5EF] border-[#E4E1D8]'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#20221F] text-[#BEF264] flex items-center justify-center shrink-0 shadow-warm-sm">
              {item.category === 'match' ? <Trophy className="w-5 h-5" /> : item.category === 'training' ? <Calendar className="w-5 h-5" /> : <Newspaper className="w-5 h-5" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#20221F]">{item.title}</h4>
                  {item.unread && (
                    <span className="px-2 py-0.5 rounded-full bg-[#BEF264] text-[#20221F] text-[9px] font-black uppercase">
                      New
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#6F716B]">{item.time}</span>
              </div>
              <p className="text-xs text-[#6F716B] leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
