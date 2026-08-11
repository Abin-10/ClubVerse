import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Plus, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CoachNewsView({ triggerToast }) {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Squad Briefing & Starting XI Strategy vs Manchester City',
      date: 'Today, 08:00 AM',
      author: 'Mikel Arteta (Head Coach)',
      category: 'Match Briefing',
      content: 'High-press tactical briefing scheduled for tomorrow morning. All first team wingers and midfielders are required in Tactical Room B.'
    },
    {
      id: 2,
      title: 'First Team Recovery & Cryotherapy Schedule',
      date: 'Yesterday',
      author: 'Dr. Sam Wilson (Medical Head)',
      category: 'Medical Notice',
      content: 'Hydration and cryotherapy suites are reserved exclusively for first team squad following high-intensity training.'
    },
    {
      id: 3,
      title: 'Pre-Season International Tour Schedule Confirmed',
      date: '3 days ago',
      author: 'Club Administration',
      category: 'Club Announcement',
      content: 'ClubVerse FC will travel to Tokyo & Los Angeles for international fixture series.'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newPost = {
      id: Date.now(),
      title: newTitle,
      date: 'Just Now',
      author: 'Mikel Arteta (Head Coach)',
      category: 'Coach Announcement',
      content: newContent
    };

    setAnnouncements(prev => [newPost, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
    if (triggerToast) triggerToast('Announcement published to squad bulletin!');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Club Announcements & Bulletins
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            Publish official coach announcements and view club news.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#BEF264]" />
          <span>{showAddForm ? 'Close Form' : 'Publish Announcement'}</span>
        </button>
      </div>

      {/* Add Announcement Form */}
      {showAddForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handlePostAnnouncement} 
          className="bg-[#FFFDF8] border border-[#E4E1D8] p-6 rounded-3xl shadow-warm-md space-y-4"
        >
          <h3 className="font-serif font-black text-lg text-[#20221F]">Publish New Announcement</h3>
          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">Announcement Title</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Tactical Briefing Time Change"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">Bulletin Content</label>
            <textarea 
              rows="3"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write the full announcement for squad players..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
              required
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Post to Squad</span>
          </button>
        </motion.form>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-3 hover:border-[#7A8B5A]/50 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-2">
              <span className="px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#627146] text-[10px] font-black uppercase">
                {post.category}
              </span>
              <span className="text-xs text-[#6F716B] font-semibold">{post.date}</span>
            </div>

            <h3 className="font-serif font-black text-xl text-[#20221F]">{post.title}</h3>
            <p className="text-xs text-[#6F716B] leading-relaxed">{post.content}</p>

            <div className="text-[11px] font-bold text-[#7A8B5A] pt-1">
              Author: {post.author}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
