import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Trophy, CheckCircle2 } from 'lucide-react';

export default function CoachNotificationsView({ triggerToast }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'training' | 'match'
  const [notifs, setNotifs] = useState([
    {
      id: 1,
      title: 'Training Attendance Completed',
      category: 'training',
      time: '1 hour ago',
      desc: '24 out of 24 players attended the high-press tactical session on Pitch 1.'
    },
    {
      id: 2,
      title: 'Derby Match Starting XI Confirmed',
      category: 'match',
      time: '3 hours ago',
      desc: 'Tactical roster locked for Manchester City matchday 28.'
    },
    {
      id: 3,
      title: 'Physio Recovery Alert',
      category: 'training',
      time: 'Yesterday',
      desc: 'Bukayo Saka completed 100% mobility test with zero muscle stiffness.'
    }
  ]);

  const filteredNotifs = notifs.filter(n => filter === 'all' || n.category === filter);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Coach Alerts & Notifications
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Stay informed with real-time training alerts and matchday notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'training', 'match'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                filter === type 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
              }`}
            >
              {type} Alerts
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E4E1D8] shadow-warm-md flex items-start gap-4 hover:border-[#7A8B5A]/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#20221F] text-[#BEF264] flex items-center justify-center shrink-0 shadow-warm-sm">
              {item.category === 'match' ? <Trophy className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#20221F]">{item.title}</h4>
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
