import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  Star, 
  ArrowRight, 
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function StadiumCard({ stadium, onViewDetails, onBookNow }) {
  const isAvailable = stadium.availabilityStatus === 'Available';
  const isLimited = stadium.availabilityStatus === 'Limited Slots';
  const isMaintenance = stadium.availabilityStatus === 'Maintenance';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl overflow-hidden shadow-warm-md flex flex-col justify-between group hover:border-[#7A8B5A]/60 hover:shadow-warm-lg"
    >
      {/* Stadium Top Media Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#20221F]">
        <img 
          src={stadium.image} 
          alt={stadium.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20221F]/90 via-transparent to-black/30" />

        {/* Status Pill Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {isAvailable && (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#20221F]/80 backdrop-blur-md text-[#BEF264] border border-[#BEF264]/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BEF264] animate-pulse" />
              Available
            </span>
          )}
          {isLimited && (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#20221F]/80 backdrop-blur-md text-[#B08D57] border border-[#B08D57]/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B08D57]" />
              Limited Slots
            </span>
          )}
          {isMaintenance && (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#20221F]/80 backdrop-blur-md text-red-400 border border-red-500/40 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              Under Maintenance
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-[#20221F]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 text-white text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-[#BEF264] text-[#BEF264]" />
          <span>{stadium.rating}</span>
        </div>

        {/* Price tag on overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="font-serif font-black text-xl leading-tight text-white drop-shadow-sm">
              {stadium.name}
            </h3>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#BEF264]" />
              <span className="truncate">{stadium.location}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stadium Card Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        
        {/* Specs Highlights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6F716B] border-b border-[#E4E1D8]/60 pb-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-[#7A8B5A]" />
              {(!stadium.capacity || stadium.capacity.includes('1,000') || stadium.capacity.includes('1000')) ? '250 Seats' : stadium.capacity}
            </span>
          </div>

          {/* Facilities Pills */}
          <div>
            <span className="text-[11px] font-bold text-[#6F716B] uppercase tracking-wider block mb-2">
              Key Facilities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stadium.facilities.slice(0, 3).map((facility, idx) => (
                <span 
                  key={idx} 
                  className="text-[11px] font-semibold text-[#20221F] bg-[#F7F5EF] px-2.5 py-1 rounded-full border border-[#E4E1D8] flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#7A8B5A]" />
                  {facility}
                </span>
              ))}
              {stadium.facilities.length > 3 && (
                <span className="text-[11px] font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 px-2 py-1 rounded-full border border-[#7A8B5A]/20">
                  +{stadium.facilities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button 
            onClick={() => onViewDetails(stadium)}
            className="flex-1 py-2.5 px-3 rounded-full border border-[#E4E1D8] text-[#20221F] bg-[#F7F5EF] text-xs font-bold hover:bg-[#E4E1D8] transition-all text-center"
          >
            View Details
          </button>

          <motion.button 
            whileHover={{ scale: isMaintenance ? 1 : 1.02 }}
            whileTap={{ scale: isMaintenance ? 1 : 0.98 }}
            disabled={isMaintenance}
            onClick={() => !isMaintenance && onBookNow(stadium)}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold shadow-warm-sm flex items-center justify-center gap-1.5 transition-all ${
              isMaintenance 
                ? 'bg-[#E4E1D8] text-[#6F716B] cursor-not-allowed' 
                : 'bg-[#20221F] text-white hover:bg-[#7A8B5A]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#BEF264]" />
            <span>{isMaintenance ? 'Unavailable' : 'Book Now'}</span>
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
