import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Plus, Send, Sparkles, CheckCircle2, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

function formatDate(dateInput) {
  if (!dateInput) return 'Recently';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  
  const now = new Date();
  const diffHours = Math.floor((now - d) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just Now';
  if (diffHours < 24) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffHours < 48) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CoachNewsView({ triggerToast }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Coach Announcement');
  const [newAuthor, setNewAuthor] = useState('Head Coach');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch announcements from MongoDB database
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5000/api/announcements');
      if (res.ok) {
        const data = await res.json();
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      } else {
        setError('Failed to load club announcements from database.');
      }
    } catch (err) {
      console.warn('Fetch announcements error:', err);
      setError('Network error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please provide both announcement title and bulletin content.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          author: newAuthor.trim() || 'Head Coach'
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setNewTitle('');
      setNewContent('');
      setShowAddForm(false);
      if (triggerToast) triggerToast(result.message || 'Announcement published to squad bulletin!');
      fetchAnnouncements();
    } catch (err) {
      alert(err.message || 'Failed to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (triggerToast) triggerToast('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      alert(err.message || 'Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
              Club Announcements & Bulletins
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[10px] font-black uppercase tracking-wider">
              {announcements.length} Live Bulletins
            </span>
          </div>
          <p className="text-xs text-[#6F716B] mt-1">
            Publish official coach announcements and view club news synced with MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnnouncements}
            className="p-2.5 rounded-full bg-[#F7F5EF] hover:bg-[#E4E1D8] text-[#20221F] transition-colors border border-[#E4E1D8]"
            title="Refresh Bulletins from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#BEF264]" />
            <span>{showAddForm ? 'Close Form' : 'Publish Announcement'}</span>
          </button>
        </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Announcement Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Tactical Briefing & Starting XI Strategy"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Category & Tag</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
              >
                <option value="Match Briefing">Match Briefing</option>
                <option value="Medical Notice">Medical Notice</option>
                <option value="Club Announcement">Club Announcement</option>
                <option value="Coach Announcement">Coach Announcement</option>
                <option value="Tactical Update">Tactical Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20221F] mb-1">Author Name & Role</label>
            <input 
              type="text" 
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="e.g. Mikel Arteta (Head Coach)"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
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
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
            <span>{submitting ? 'Publishing...' : 'Post to Squad'}</span>
          </button>
        </motion.form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl">
          <Loader2 className="w-8 h-8 text-[#7A8B5A] animate-spin" />
          <p className="text-xs font-semibold text-[#6F716B]">Fetching club announcements from MongoDB database...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchAnnouncements} className="ml-auto underline font-bold">Retry</button>
        </div>
      )}

      {/* Announcements List */}
      {!loading && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-2">
              <Newspaper className="w-8 h-8 text-[#7A8B5A] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#20221F]">No Announcements Found</p>
              <p className="text-xs text-[#6F716B]">No club bulletins posted yet. Click "Publish Announcement" above to add one.</p>
            </div>
          ) : (
            announcements.map((post) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-3 hover:border-[#7A8B5A]/50 transition-colors relative group"
              >
                <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-2">
                  <span className="px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#627146] text-[10px] font-black uppercase">
                    {post.category || 'Coach Announcement'}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6F716B] font-semibold">
                      {formatDate(post.published_at || post.date)}
                    </span>

                    <button
                      onClick={() => handleDeleteAnnouncement(post._id || post.id)}
                      className="p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-black text-xl text-[#20221F]">{post.title}</h3>
                <p className="text-xs text-[#6F716B] leading-relaxed whitespace-pre-line">{post.content}</p>

                <div className="text-[11px] font-bold text-[#7A8B5A] pt-1">
                  Author: {post.author || 'Head Coach'}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
