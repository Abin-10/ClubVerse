import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Award, Target, Zap, Activity, CheckCircle2 } from 'lucide-react';

export default function UpdatePerformanceModal({
  isOpen,
  onClose,
  player,
  onSavePerformance,
  triggerToast
}) {
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [passAccuracy, setPassAccuracy] = useState('88.5%');
  const [matchRating, setMatchRating] = useState('8.5');
  const [fitnessStatus, setFitnessStatus] = useState('100% Fit');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player) {
      setGoals(player.goals || 0);
      setAssists(player.assists || 0);
      setPassAccuracy(player.passAccuracy || '88.5%');
      setMatchRating(player.matchRating || '8.5');
      setFitnessStatus(player.fitnessStatus || '100% Fit');
      setNotes(player.notes || 'High tactical comprehension and exceptional press execution.');
    }
  }, [player, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedPlayer = {
      ...player,
      goals: parseInt(goals),
      assists: parseInt(assists),
      passAccuracy,
      matchRating,
      fitnessStatus,
      notes
    };

    setTimeout(() => {
      setLoading(false);
      if (onSavePerformance) onSavePerformance(updatedPlayer);
      if (triggerToast) triggerToast(`Performance updated for ${player?.full_name || player?.name}!`);
      onClose();
    }, 400);
  };

  if (!isOpen || !player) return null;

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

          <div className="flex items-center gap-4 border-b border-[#E4E1D8] pb-4">
            <img 
              src={player.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'} 
              alt={player.full_name || player.name} 
              className="w-14 h-14 rounded-2xl object-cover border border-[#7A8B5A]" 
            />
            <div>
              <h3 className="font-serif font-black text-xl text-[#20221F]">{player.full_name || player.name}</h3>
              <p className="text-xs text-[#7A8B5A] font-bold">
                {player.position} • #{player.jersey_number || 'N/A'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Season Goals</label>
                <input 
                  type="number" 
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Season Assists</label>
                <input 
                  type="number" 
                  value={assists}
                  onChange={(e) => setAssists(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Pass Accuracy (%)</label>
                <input 
                  type="text" 
                  value={passAccuracy}
                  onChange={(e) => setPassAccuracy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20221F] mb-1">Coach Match Rating (/10)</label>
                <input 
                  type="text" 
                  value={matchRating}
                  onChange={(e) => setMatchRating(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#20221F] mb-1">Physical & Medical Clearance</label>
                <select 
                  value={fitnessStatus}
                  onChange={(e) => setFitnessStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                >
                  <option value="100% Fit">100% Fit (Match Ready)</option>
                  <option value="90% Fit - Light Rotation">90% Fit (Light Rotation Recommended)</option>
                  <option value="Injured - Physio Rehabilitation">Injured (Physio Rehab)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#20221F] mb-1">Coach Tactical Evaluation & Notes</label>
                <textarea 
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter custom tactical feedback, high-press positioning notes..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] text-xs font-bold text-[#20221F] focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]"
                />
              </div>
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
                <span>{loading ? 'Saving...' : 'Update Performance'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
