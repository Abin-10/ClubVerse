import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Palette, Sparkles, Check, Image as ImageIcon, Link as LinkIcon, Upload, Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
  '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#A855F7', '#EC4899', '#F43F5E', '#20221F', '#7A8B5A'
];

const PRESET_LOGOS = [
  { name: 'ClubVerse Red', url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80' },
  { name: 'City Cyan', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Royal Gold', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80' },
  { name: 'Blaugrana', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80' },
  { name: 'Red Cannon', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80' }
];

export default function TeamModal({ isOpen, onClose, onSave, teamToEdit }) {
  const [form, setForm] = useState({ name: '', short_name: '', logo_color: '#3B82F6', logo_url: '' });

  useEffect(() => {
    if (teamToEdit) {
      setForm({
        name: teamToEdit.name || '',
        short_name: teamToEdit.short_name || '',
        logo_color: teamToEdit.logo_color || '#3B82F6',
        logo_url: teamToEdit.logo_url || ''
      });
    } else {
      setForm({ name: '', short_name: '', logo_color: '#3B82F6', logo_url: PRESET_LOGOS[0].url });
    }
  }, [teamToEdit, isOpen]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, logo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.short_name.trim()) return;
    onSave({
      ...(teamToEdit ? { _id: teamToEdit._id } : {}),
      name: form.name.trim(),
      short_name: form.short_name.trim().toUpperCase().slice(0, 4),
      logo_color: form.logo_color,
      logo_url: form.logo_url.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-warm-xl relative overflow-hidden my-8"
        >
          {/* Top Banner Graphic */}
          <div 
            className="absolute top-0 left-0 right-0 h-28 pointer-events-none transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${form.logo_color || '#3B82F6'}35 0%, transparent 100%)`
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#6F716B] hover:text-[#20221F] bg-white/80 backdrop-blur-md rounded-full border border-[#E4E1D8] shadow-warm-xs transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 relative z-10 pt-2">
            <div className="relative">
              {form.logo_url ? (
                <img 
                  src={form.logo_url} 
                  alt={form.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-warm-md"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <motion.div 
                  key={form.logo_color}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-warm-md border-2 border-white" 
                  style={{ backgroundColor: form.logo_color }}
                >
                  {form.short_name || <Shield className="w-7 h-7" />}
                </motion.div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#20221F] text-[#BEF264] flex items-center justify-center text-[10px] border border-white font-mono font-bold">
                24
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#20221F] text-[#BEF264] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Total Squad 24
                </span>
              </div>
              <h3 className="font-serif font-black text-2xl text-[#20221F] mt-0.5">
                {teamToEdit ? 'Edit Team Credentials' : 'Register Club & Emblem'}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Team Name */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1.5">Official Team Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Manchester City FC"
                maxLength={50}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
              />
            </div>

            {/* Short Code Name */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1.5">Short Code * (3-4 characters)</label>
              <input
                type="text"
                value={form.short_name}
                onChange={(e) => setForm(f => ({ ...f, short_name: e.target.value.toUpperCase().slice(0, 4) }))}
                placeholder="e.g. MCY"
                maxLength={4}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
              />
            </div>

            {/* Logo Image Upload & URL Selection */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  Team Emblem Logo
                </span>
                <span className="text-[10px] text-[#6F716B]">Upload File or Enter URL</span>
              </label>

              {/* Upload CTA Button & File Input */}
              <div className="flex gap-2 mb-3">
                <input 
                  type="file" 
                  id="admin-team-logo-upload" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
                <label
                  htmlFor="admin-team-logo-upload"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] transition-all cursor-pointer shadow-warm-xs"
                >
                  <Upload className="w-4 h-4 text-[#BEF264]" />
                  <span>Upload Image File</span>
                </label>

                {form.logo_url && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, logo_url: '' }))}
                    className="p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Preset Logos */}
              <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_LOGOS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, logo_url: p.url }))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all whitespace-nowrap ${
                      form.logo_url === p.url 
                        ? 'bg-[#20221F] text-white border-[#20221F] shadow-warm-xs' 
                        : 'bg-[#F7F5EF] border-[#E4E1D8] text-[#20221F] hover:bg-[#EFEEE8]'
                    }`}
                  >
                    <img src={p.url} alt={p.name} className="w-4 h-4 rounded-md object-cover" />
                    <span className="font-bold text-[11px]">{p.name}</span>
                  </button>
                ))}
              </div>

              {/* URL Input */}
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F716B]" />
                <input
                  type="text"
                  value={form.logo_url}
                  onChange={(e) => setForm(f => ({ ...f, logo_url: e.target.value }))}
                  placeholder="Paste Image URL or data:image..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#7A8B5A]/40 transition-all"
                />
              </div>
            </div>

            {/* Logo Color Selection */}
            <div>
              <label className="block text-xs font-bold text-[#20221F] mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#7A8B5A]" />
                <span>Primary Kit Accent Color</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3 bg-[#F7F5EF] p-3 rounded-2xl border border-[#E4E1D8]">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, logo_color: c }))}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      form.logo_color === c ? 'border-[#20221F] scale-125 shadow-md ring-2 ring-white' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {form.logo_color === c && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white flex items-center justify-between shadow-warm-sm border border-[#E4E1D8]/20">
              <div className="flex items-center gap-3">
                {form.logo_url ? (
                  <img 
                    src={form.logo_url} 
                    alt={form.name} 
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md" 
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20"
                    style={{ backgroundColor: form.logo_color }}
                  >
                    {form.short_name || '?'}
                  </div>
                )}
                <div>
                  <div className="font-serif font-black text-sm text-white">{form.name || 'Club Name'}</div>
                  <div className="text-[10px] text-[#BEF264] uppercase font-mono tracking-wider font-bold flex items-center gap-2">
                    <span>{form.short_name || 'CODE'}</span>
                    <span>•</span>
                    <span className="text-white/80">Total Squad 24</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white font-bold border border-white/20">
                Preview
              </span>
            </div>

            {/* Submit CTA */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#20221F] to-[#2E332B] text-white font-bold text-xs shadow-warm-md hover:shadow-warm-lg transition-all"
            >
              {teamToEdit ? 'Save Changes' : 'Register Club'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
