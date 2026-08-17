import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Star, 
  Calendar, 
  ShieldAlert,
  Layers,
  Maximize2,
  Sparkles
} from 'lucide-react';

export default function StadiumDetailModal({ stadium, isOpen, onClose, onStartBooking }) {
  if (!isOpen || !stadium) return null;

  const [activeImage, setActiveImage] = useState(stadium.image);
  const isMaintenance = stadium.availabilityStatus === 'Maintenance';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-3xl w-full shadow-warm-lg overflow-hidden relative my-8"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#20221F]/70 text-white hover:bg-[#20221F] flex items-center justify-center backdrop-blur-md transition-all border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Banner with Image Gallery */}
          <div className="relative h-64 sm:h-80 w-full bg-[#20221F]">
            <img 
              src={activeImage} 
              alt={stadium.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20221F] via-[#20221F]/40 to-transparent" />

            {/* Thumbnail selector gallery */}
            {stadium.gallery && stadium.gallery.length > 1 && (
              <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10">
                {stadium.gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-[#BEF264] scale-105' : 'border-white/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Rating badge */}
            <div className="absolute top-4 left-6 bg-[#20221F]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-white text-xs font-bold">
              <Star className="w-4 h-4 fill-[#BEF264] text-[#BEF264]" />
              <span>{stadium.rating} / 5.0</span>
              <span className="text-white/60">({stadium.reviewsCount} reviews)</span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 right-6 text-right z-10 hidden sm:block">
              <span className="text-[11px] font-black uppercase text-[#BEF264] tracking-wider block">
                {stadium.availabilityStatus}
              </span>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
                  {stadium.name}
                </h2>
              </div>
              <p className="text-xs text-[#6F716B] flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-[#7A8B5A]" />
                {stadium.location}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#20221F]">About the Pitch & Stadium</h4>
              <p className="text-xs text-[#6F716B] leading-relaxed">
                {stadium.description}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
                <div className="text-[10px] font-bold text-[#6F716B] uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  Capacity
                </div>
                <div className="text-xs font-bold text-[#20221F]">{stadium.capacity}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
                <div className="text-[10px] font-bold text-[#6F716B] uppercase flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  Pitch Turf
                </div>
                <div className="text-xs font-bold text-[#20221F] truncate">{stadium.pitchType}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-[#6F716B] uppercase flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  Dimensions
                </div>
                <div className="text-xs font-bold text-[#20221F]">{stadium.dimensions}</div>
              </div>
            </div>

            {/* Facilities List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#20221F]">Stadium Facilities & Amenities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stadium.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-semibold text-[#20221F]">
                    <CheckCircle2 className="w-4 h-4 text-[#7A8B5A] flex-shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-6 bg-[#F7F5EF] border-t border-[#E4E1D8] flex items-center justify-end gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-3 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#6F716B] hover:text-[#20221F] bg-[#FFFDF8]"
              >
                Close
              </button>
              
              <motion.button 
                whileHover={{ scale: isMaintenance ? 1 : 1.02 }}
                whileTap={{ scale: isMaintenance ? 1 : 0.98 }}
                disabled={isMaintenance}
                onClick={() => {
                  onClose();
                  onStartBooking(stadium);
                }}
                className={`px-6 py-3 rounded-full text-xs font-bold shadow-warm-md flex items-center gap-2 transition-all ${
                  isMaintenance 
                    ? 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed' 
                    : 'bg-[#20221F] text-white hover:bg-[#7A8B5A]'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#BEF264]" />
                <span>{isMaintenance ? 'Under Maintenance' : 'Select Date & Reserve'}</span>
              </motion.button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
