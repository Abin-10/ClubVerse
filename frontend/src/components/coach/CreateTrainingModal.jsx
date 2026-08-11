import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Save, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CreateTrainingModal({
  isOpen,
  onClose,
  onCreateTraining,
  triggerToast
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:30 AM');
  const [pitch, setPitch] = useState('Pitch 1 (First Team Ground)');
  const [type, setType] = useState('Tactical');
  const [intensity, setIntensity] = useState('High');
  const [drills, setDrills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) {
      alert('Please fill out the session title and date.');
      return;
    }

    setLoading(true);
    const newSession = {
      id: Date.now(),
      title,
      date: date || 'Tomorrow',
      time,
      pitch,
      coach: 'Mikel Arteta',
      type,
      intensity: `${intensity} Intensity`,
      drills: drills || 'Standard tactical buildup & set-piece drills.'
    };

    setTimeout(() => {
      setLoading(false);
      if (onCreateTraining) onCreateTraining(newSession);
      if (triggerToast) triggerToast(`Training Session "${title}" created successfully!`);
      // Reset
      setTitle('');
      setDate('');
      setDrills('');
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-warm-lg space-y-6 relative max-h-[90vh] overflow-y-auto font-sans"
        >
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full hover:bg-[#F7F5EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 pr-8">
            <h3 className="font-serif font-black text-2xl text-[#20221F]">Create Training Session</h3>
            <p className="text-xs text-[#6F716B]">Schedule a new tactical or physical session for the squad.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Session Title</label>
              <input 
                type="text" 
                placeholder="e.g. High-Press & Tactical Counter-Attack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Session Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Time & Duration</label>
                <input 
                  type="text" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                  placeholder="09:30 AM - 11:30 AM"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Session Focus Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                >
                  <option value="Tactical">Tactical Shape</option>
                  <option value="Physical">Physical & Conditioning</option>
                  <option value="Recovery">Recovery & Regeneration</option>
                  <option value="Pre-Match">Pre-Match Set Pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Pitch / Location</label>
                <input 
                  type="text" 
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1">Drills & Tactical Description</label>
              <textarea 
                rows="3"
                value={drills}
                onChange={(e) => setDrills(e.target.value)}
                placeholder="Describe key drill patterns, high-press triggers, and tactical focus..."
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E1D8]">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#6F716B] hover:bg-[#F7F5EF]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#BEF264]" />
                <span>{loading ? 'Publishing...' : 'Schedule Session'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
