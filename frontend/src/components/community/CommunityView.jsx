import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Sparkles, 
  Flame, 
  Search, 
  Pin, 
  CheckCircle2, 
  Share2,
  Trash2,
  BarChart2,
  RefreshCw,
  MessageCircle,
  Radio
} from 'lucide-react';

function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Just now';
  const diff = Date.now() - new Date(dateInput).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityView({ currentUser, triggerToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Main Chat Input State
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Poll Composer State
  const [includePoll, setIncludePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  // Active expanded replies map (postId -> boolean)
  const [expandedComments, setExpandedComments] = useState({});
  // Comment/reply inputs map (postId -> string)
  const [commentInputs, setCommentInputs] = useState({});

  const userId = currentUser?.id || currentUser?._id || 'guest';
  const userName = currentUser?.name || currentUser?.full_name || 'ClubVerse Fan';
  const userAvatar = currentUser?.profile_image || '';
  const userBadge = currentUser?.tier || 'Supporter';

  // Fetch live chat posts from Express MongoDB API
  const fetchPosts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('http://localhost:5000/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.posts)) {
          const cleanPosts = data.posts.filter(p => p.author_name !== 'Marcus Vance' && p.author_name !== 'Elena Rostova');
          setPosts(cleanPosts);
        }
      }
    } catch (err) {
      console.warn('Live chat fetch note:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch and auto-polling every 3 seconds for real-time live chat updates
  useEffect(() => {
    fetchPosts(false);
    const interval = setInterval(() => {
      fetchPosts(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll option helpers
  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions(prev => [...prev, `Option ${prev.length + 1}`]);
    }
  };

  const handleUpdatePollOption = (idx, value) => {
    setPollOptions(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // Send a Live Chat Message
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    let pollData = null;
    if (includePoll && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
      pollData = {
        question: pollQuestion.trim(),
        options: pollOptions.filter(o => o.trim()).map((opt, i) => ({
          id: `opt-${Date.now()}-${i}`,
          text: opt.trim(),
          votes: 0
        })),
        total_votes: 0,
        voted_users: []
      };
    }

    const tempId = `chat-${Date.now()}`;
    const newPostObj = {
      _id: tempId,
      author_id: userId,
      author_name: userName,
      author_avatar: userAvatar,
      author_badge: userBadge,
      category: 'General',
      content: chatMessage.trim(),
      image: '',
      likes_count: 0,
      liked_by: [],
      comments: [],
      poll: pollData,
      created_at: new Date().toISOString()
    };

    // Optimistically add to UI immediately
    setPosts(prev => [newPostObj, ...prev]);
    const sentText = chatMessage.trim();
    setChatMessage('');
    setIncludePoll(false);
    setPollQuestion('');
    setPollOptions(['Option 1', 'Option 2']);
    triggerToast?.('Message sent!');

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:5000/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: userId,
          author_name: userName,
          author_avatar: userAvatar,
          author_badge: userBadge,
          category: 'General',
          content: sentText,
          image: '',
          poll: pollData
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          // Replace temp post with real MongoDB post
          setPosts(prev => prev.map(p => p._id === tempId ? data.post : p));
        }
      }
    } catch (err) {
      console.warn('Backend sync note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like Toggle
  const handleLikeToggle = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const hasLiked = p.liked_by && p.liked_by.includes(userId);
        const newLikedBy = hasLiked ? p.liked_by.filter(id => id !== userId) : [...(p.liked_by || []), userId];
        const newCount = hasLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1;
        return { ...p, liked_by: newLikedBy, likes_count: newCount };
      }
      return p;
    }));

    try {
      await fetch(`http://localhost:5000/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
    } catch (err) {
      console.warn('Backend like update note:', err);
    }
  };

  // Add Reply/Comment to Chat Message
  const handleAddReply = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newCommentObj = {
      author_id: userId,
      author_name: userName,
      author_avatar: userAvatar,
      content: text.trim(),
      created_at: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        return { ...p, comments: [...(p.comments || []), newCommentObj] };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    try {
      await fetch(`http://localhost:5000/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: userId,
          author_name: userName,
          author_avatar: userAvatar,
          content: text.trim()
        })
      });
    } catch (err) {
      console.warn('Backend comment note:', err);
    }
  };

  // Vote in Poll
  const handleVotePoll = async (postId, optionId) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId && p.poll) {
        if (p.poll.voted_users && p.poll.voted_users.includes(userId)) return p;

        const updatedOptions = p.poll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            total_votes: (p.poll.total_votes || 0) + 1,
            voted_users: [...(p.poll.voted_users || []), userId]
          }
        };
      }
      return p;
    }));

    try {
      await fetch(`http://localhost:5000/api/community/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: optionId, user_id: userId })
      });
    } catch (err) {
      console.warn('Backend vote note:', err);
    }
  };

  // Delete Chat Message
  const handleDeletePost = async (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));

    try {
      await fetch(`http://localhost:5000/api/community/posts/${postId}`, {
        method: 'DELETE'
      });
      triggerToast?.('Message deleted.');
    } catch (err) {
      console.warn('Backend delete note:', err);
    }
  };

  // Share Message Helper
  const handleSharePost = (post) => {
    navigator.clipboard?.writeText(window.location.href);
    triggerToast?.('Chat link copied!');
  };

  // Filter messages by search
  const filteredPosts = posts.filter(post => {
    return searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-[#20221F] font-sans selection:bg-[#7A8B5A] selection:text-white"
    >
      {/* ── LIVE FAN CHAT HEADER BANNER ── */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#BEF264] text-[#20221F] flex items-center gap-1.5 shadow-warm-xs">
                <Radio className="w-3.5 h-3.5 text-[#20221F] animate-pulse" />
                Live Fan Chat
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7A8B5A]/10 text-[#7A8B5A] border border-[#7A8B5A]/20">
                {posts.length} Messages
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl lg:text-3xl text-[#20221F] mt-1">
              Fan Club Chatroom
            </h2>
            <p className="text-xs text-[#6F716B] mt-0.5">
              Real-time fan discussion stream. Post a message to chat live with all supporters!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#6F716B] absolute left-3.5 top-2.5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live chat..."
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-full border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
              />
            </div>

            <button
              onClick={() => fetchPosts(false)}
              className="p-2.5 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] text-[#20221F] hover:bg-[#E4E1D8] transition-colors"
              title="Refresh Live Chat"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── PERSISTENT LIVE CHAT MESSAGE COMPOSER BAR ── */}
        <form onSubmit={handleSendChatMessage} className="space-y-3">
          <div className="flex items-center gap-3 bg-[#F7F5EF] p-2.5 rounded-2xl border border-[#E4E1D8] focus-within:border-[#7A8B5A] transition-all">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover border border-[#E4E1D8]" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#20221F] text-[#BEF264] flex items-center justify-center font-black text-xs">
                {userName[0]}
              </div>
            )}

            <input
              type="text"
              required
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Send a chat message to all supporters..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-[#20221F] focus:outline-none placeholder:text-[#6F716B]"
            />

            <button
              type="button"
              onClick={() => setIncludePoll(!includePoll)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                includePoll 
                  ? 'bg-[#7A8B5A] text-white border-[#7A8B5A]' 
                  : 'bg-[#FFFDF8] text-[#7A8B5A] border-[#E4E1D8] hover:border-[#7A8B5A]'
              }`}
              title="Attach Poll"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Poll</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !chatMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold transition-all shadow-warm-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#BEF264]" />
              <span>Send</span>
            </button>
          </div>

          {/* Expanded Poll Creator */}
          <AnimatePresence>
            {includePoll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2 overflow-hidden"
              >
                <div className="text-xs font-bold text-[#20221F] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#7A8B5A]" />
                  <span>Attach Fan Poll to Chat Message</span>
                </div>

                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Poll Question (e.g. Who was the best player tonight?)"
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8]"
                />

                <div className="space-y-1.5 pt-1">
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => handleUpdatePollOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="w-full px-3 py-1 text-xs font-semibold rounded-lg border border-[#E4E1D8] bg-[#FFFDF8]"
                    />
                  ))}
                </div>

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-[11px] font-bold text-[#7A8B5A] hover:underline pt-1 block"
                  >
                    + Add option
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ── LIVE CHAT STREAM FEED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHAT MESSAGES STREAM (9 COLS) */}
        <div className="lg:col-span-9 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl space-y-3 shadow-warm-md">
              <MessageCircle className="w-10 h-10 text-[#7A8B5A] mx-auto opacity-50" />
              <h3 className="font-serif font-black text-lg text-[#20221F]">No chat messages yet</h3>
              <p className="text-xs text-[#6F716B]">Start the conversation! Type a message above to chat live with all fans.</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const hasLiked = post.liked_by && post.liked_by.includes(userId);
              const isRepliesOpen = Boolean(expandedComments[post._id]);
              const timeAgo = formatTimeAgo(post.created_at);

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-[#FFFDF8] border rounded-3xl p-5 shadow-warm-sm space-y-3 relative ${
                    post.is_pinned ? 'border-[#7A8B5A] ring-1 ring-[#7A8B5A]/20' : 'border-[#E4E1D8]'
                  }`}
                >
                  {/* Pinned Badge header */}
                  {post.is_pinned && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#7A8B5A] tracking-wider border-b border-[#E4E1D8] pb-1.5">
                      <Pin className="w-3 h-3 fill-[#7A8B5A]" />
                      <span>Featured Announcement</span>
                    </div>
                  )}

                  {/* Chat Message Author Info Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.author_avatar ? (
                        <img 
                          src={post.author_avatar} 
                          alt={post.author_name}
                          className="w-9 h-9 rounded-full object-cover border border-[#E4E1D8]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#20221F] text-[#BEF264] flex items-center justify-center font-black text-xs">
                          {post.author_name ? post.author_name[0] : 'F'}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-[#20221F]">{post.author_name}</h4>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-[#7A8B5A]">
                            {post.author_badge || 'Supporter'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6F716B] font-medium">
                          {timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Trash Button for deletion */}
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-1.5 text-[#6F716B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Chat Message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chat Message Text Content */}
                  <p className="text-xs sm:text-sm text-[#20221F] leading-relaxed font-semibold pl-1">
                    {post.content}
                  </p>

                  {/* ── DYNAMIC POLL WIDGET (IF ATTACHED) ── */}
                  {post.poll && post.poll.options && (
                    <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2.5 shadow-warm-xs">
                      <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-1.5">
                        <div className="text-xs font-black text-[#20221F] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A]" />
                          <span>{post.poll.question}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#6F716B]">
                          {post.poll.total_votes || 0} votes
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {post.poll.options.map((opt) => {
                          const totalVotes = post.poll.total_votes || 0;
                          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          const hasVoted = post.poll.voted_users && post.poll.voted_users.includes(userId);

                          return (
                            <button
                              key={opt.id || opt.text}
                              type="button"
                              disabled={hasVoted}
                              onClick={() => handleVotePoll(post._id, opt.id)}
                              className={`w-full text-left p-2 rounded-xl border transition-all relative overflow-hidden group ${
                                hasVoted ? 'cursor-default border-[#E4E1D8]' : 'hover:border-[#7A8B5A] border-[#E4E1D8] bg-[#FFFDF8]'
                              }`}
                            >
                              <div 
                                className="absolute inset-0 bg-[#BEF264]/40 transition-all duration-500" 
                                style={{ width: `${pct}%` }} 
                              />
                              
                              <div className="relative z-10 flex items-center justify-between text-xs font-bold text-[#20221F]">
                                <span className="flex items-center gap-1.5">
                                  {opt.text}
                                  {hasVoted && <CheckCircle2 className="w-3 h-3 text-[#7A8B5A]" />}
                                </span>
                                <span>{pct}% ({opt.votes || 0})</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-[#E4E1D8]/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLikeToggle(post._id)}
                        className={`flex items-center gap-1.5 font-bold transition-colors ${
                          hasLiked ? 'text-red-500 font-black' : 'text-[#6F716B] hover:text-[#20221F]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{post.likes_count || 0}</span>
                      </button>

                      {/* Reply in Chat Toggle */}
                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                        className="flex items-center gap-1.5 font-bold text-[#6F716B] hover:text-[#20221F] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#7A8B5A]" />
                        <span>{post.comments ? post.comments.length : 0} Replies</span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleSharePost(post)}
                        className="flex items-center gap-1.5 font-bold text-[#6F716B] hover:text-[#20221F] transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-[#6F716B]">Live Stream</span>
                  </div>

                  {/* ── EXPANDABLE NESTED CHAT REPLIES SECTION ── */}
                  <AnimatePresence>
                    {isRepliesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-[#E4E1D8] space-y-3 overflow-hidden"
                      >
                        {/* Reply list */}
                        <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                          {(!post.comments || post.comments.length === 0) ? (
                            <p className="text-xs text-[#6F716B] italic">No replies yet. Type below to reply to {post.author_name}!</p>
                          ) : (
                            post.comments.map((cmt, idx) => (
                              <div key={idx} className="p-2.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    {cmt.author_avatar ? (
                                      <img src={cmt.author_avatar} alt={cmt.author_name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-[#20221F] text-[#BEF264] text-[9px] font-black flex items-center justify-center">
                                        {cmt.author_name ? cmt.author_name[0] : 'C'}
                                      </div>
                                    )}
                                    <span className="font-black text-[#20221F]">{cmt.author_name}</span>
                                  </div>
                                  <span className="text-[10px] text-[#6F716B]">
                                    {formatTimeAgo(cmt.created_at)}
                                  </span>
                                </div>
                                <p className="text-xs text-[#20221F] font-medium pl-7">{cmt.content}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reply Input Box */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInputs[post._id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post._id)}
                            placeholder={`Reply to ${post.author_name}...`}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(post._id)}
                            className="p-2 rounded-xl bg-[#20221F] hover:bg-[#7A8B5A] text-white transition-colors"
                          >
                            <Send className="w-3.5 h-3.5 text-[#BEF264]" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDEBAR (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Featured Fan Chant Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#20221F] to-[#3B4237] text-white shadow-warm-md space-y-3 border border-white/10">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#BEF264]" />
              <h3 className="font-serif font-black text-lg text-white">Chant of the Week</h3>
            </div>
            <p className="text-xs text-white/90 italic leading-relaxed">
              "We'll sing for the crest on our chest, through win or loss we give our best! ClubVerse FC!"
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#BEF264] font-bold">
              <span>South Stand Ultras</span>
              <span>🔥 142 Chants</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
