import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  Plus, 
  CheckCircle2, 
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  Layers,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';

const PRESET_STADIUM_IMAGES = [
  { label: 'Camp Nou Classic', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Modern Arena', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Night Match', url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Grass Pitch', url: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200&auto=format&fit=crop&q=80' }
];

const DEFAULT_SEATING_TIERS = [
  { name: 'VIP Seats', price: 5000, seats_info: '50 Seats (25 North / 25 South)', total_seats: 50 },
  { name: '4 Side Prime', price: 3000, seats_info: '30 Seats Each Side (Total 120 Seats)', total_seats: 120 },
  { name: '4 Side Regular', price: 1000, seats_info: '20 Seats Each Side (Total 80 Seats)', total_seats: 80 }
];

export default function StadiumModal({ isOpen, onClose, stadiumToEdit, onSaveStadium }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '250 Seats',
    price_per_hour: 5000,
    availability_status: 'Available',
    image: '',
    pitch_type: 'FIFA Certified Hybrid Grass',
    dimensions: '105m x 68m (UEFA Standard)',
    description: '',
    facilities: ['Floodlight System', '4 VIP Dressing Rooms', 'Spectator Parking'],
    blocked_dates: [],
    seating_tiers: DEFAULT_SEATING_TIERS
  });

  const [newFacility, setNewFacility] = useState('');
  const [blockedDateInput, setBlockedDateInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stadiumToEdit) {
      const tiers = Array.isArray(stadiumToEdit.seating_tiers) && stadiumToEdit.seating_tiers.length > 0 
        ? stadiumToEdit.seating_tiers 
        : DEFAULT_SEATING_TIERS;

      setFormData({
        _id: stadiumToEdit._id,
        name: stadiumToEdit.name || stadiumToEdit.stadium_name || '',
        location: stadiumToEdit.location || '',
        capacity: stadiumToEdit.capacity || '250 Seats',
        price_per_hour: stadiumToEdit.price_per_hour || stadiumToEdit.pricePerHour || 5000,
        availability_status: stadiumToEdit.availability_status || stadiumToEdit.availabilityStatus || 'Available',
        image: stadiumToEdit.image || '',
        pitch_type: stadiumToEdit.pitch_type || stadiumToEdit.pitchType || 'FIFA Certified Hybrid Grass',
        dimensions: stadiumToEdit.dimensions || '105m x 68m (UEFA Standard)',
        description: stadiumToEdit.description || '',
        facilities: stadiumToEdit.facilities || ['Floodlight System', '4 VIP Dressing Rooms'],
        blocked_dates: stadiumToEdit.blocked_dates || stadiumToEdit.blockedDates || [],
        seating_tiers: tiers
      });
    } else {
      setFormData({
        name: '',
        location: '',
        capacity: '250 Seats',
        price_per_hour: 5000,
        availability_status: 'Available',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
        pitch_type: 'FIFA Certified Hybrid Grass',
        dimensions: '105m x 68m (UEFA Standard)',
        description: 'Elite professional 250-seat stadium pitch equipped with modern lighting and team facilities.',
        facilities: ['Floodlight System', '4 VIP Dressing Rooms', 'Spectator Parking', 'Medical Suite'],
        blocked_dates: [],
        seating_tiers: DEFAULT_SEATING_TIERS
      });
    }
  }, [stadiumToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTiers = [...prev.seating_tiers];
      updatedTiers[index] = {
        ...updatedTiers[index],
        [field]: field === 'price' || field === 'total_seats' ? Number(value) || 0 : value
      };
      return { ...prev, seating_tiers: updatedTiers };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file size must be less than 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (fac) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== fac)
    }));
  };

  const handleAddBlockedDate = () => {
    if (blockedDateInput && !formData.blocked_dates.includes(blockedDateInput)) {
      setFormData(prev => ({
        ...prev,
        blocked_dates: [...prev.blocked_dates, blockedDateInput]
      }));
      setBlockedDateInput('');
    }
  };

  const handleRemoveBlockedDate = (d) => {
    setFormData(prev => ({
      ...prev,
      blocked_dates: prev.blocked_dates.filter(item => item !== d)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSaveStadium(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl max-w-2xl w-full shadow-warm-lg overflow-hidden relative my-6"
        >
          {/* Header */}
          <div className="bg-[#20221F] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#BEF264] text-[#20221F] flex items-center justify-center font-black">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-white">
                  {stadiumToEdit ? 'Edit Stadium Venue' : 'Add New Stadium Venue'}
                </h3>
                <p className="text-xs text-white/70">
                  {stadiumToEdit ? 'Update stadium pricing, facilities, or date blocks' : 'Create a new stadium pitch for fan bookings'}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

            {/* Stadium Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20221F]">Stadium Name *</label>
                <input 
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Central Arena"
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20221F]">Location / City *</label>
                <input 
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. London, UK • East District"
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>
            </div>

            {/* Capacity & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20221F]">Capacity</label>
                <input 
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="250 Seats"
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20221F]">Availability Status</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                >
                  <option value="Available">Available</option>
                  <option value="Limited Slots">Limited Slots</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Fully Booked">Fully Booked</option>
                </select>
              </div>
            </div>

            {/* Stadium Image Upload & Preview Section */}
            <div className="space-y-2 border border-[#E4E1D8] bg-[#F7F5EF]/60 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#7A8B5A]" />
                  Stadium Venue Photo (Upload File or Image URL)
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Image
                  </button>
                )}
              </div>

              {/* Image Preview & Upload Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <div className="relative group w-full sm:w-44 h-28 rounded-2xl overflow-hidden border-2 border-[#7A8B5A] shadow-warm-sm bg-[#20221F] shrink-0">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Stadium Preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-2 text-center">
                      <ImageIcon className="w-8 h-8 text-white/30 mb-1" />
                      <span className="text-[10px] font-semibold">No Image Uploaded</span>
                    </div>
                  )}

                  {/* Upload Overlay Button */}
                  <label 
                    htmlFor="stadium-photo-upload"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                    title="Change Stadium Photo"
                  >
                    <Camera className="w-5 h-5 text-[#BEF264] mb-1" />
                    <span className="text-[10px] font-bold">Change Image</span>
                  </label>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <input 
                      type="file" 
                      id="stadium-photo-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="stadium-photo-upload"
                      className="px-4 py-2 bg-[#20221F] hover:bg-[#7A8B5A] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-2 shadow-warm-sm shrink-0"
                    >
                      <Upload className="w-4 h-4 text-[#BEF264]" />
                      <span>Upload Image File</span>
                    </label>
                    <span className="text-[11px] text-[#6F716B] font-medium">Supports JPG, PNG, WEBP (Max 8MB)</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6F716B]">Or Paste Image URL Directly:</label>
                    <input 
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#6F716B]">Presets:</span>
                    {PRESET_STADIUM_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                        className="px-2 py-0.5 rounded-lg bg-[#E4E1D8]/60 hover:bg-[#7A8B5A] hover:text-white text-[10px] font-bold text-[#20221F] transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pitch Details */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#20221F]">Pitch Turf Type</label>
              <input 
                type="text"
                name="pitch_type"
                value={formData.pitch_type}
                onChange={handleChange}
                placeholder="e.g. Hybrid Grass / 4G Synthetic"
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
              />
            </div>

            {/* Seating Tiers & Pricing Configuration (Fetched from Database) */}
            <div className="space-y-3 border border-[#E4E1D8] bg-[#FFFDF8] p-4 rounded-2xl shadow-warm-sm">
              <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-2">
                <div>
                  <label className="text-xs font-black text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#7A8B5A]" />
                    Stadium Seating Tiers & Pricing (Fetched from MongoDB)
                  </label>
                  <p className="text-[10px] text-[#6F716B]">Configure tier prices and seat details. Admin changes save live to database.</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A]">
                  3 Active Tiers
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {formData.seating_tiers && formData.seating_tiers.map((tier, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#20221F] flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-blue-500' : 'bg-lime-500'}`} />
                        {tier.name}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#7A8B5A]">
                        Current: ₹{Number(tier.price).toLocaleString('en-IN')} / ticket
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Tier Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#6F716B]">Tier Name</label>
                        <input 
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
                        />
                      </div>

                      {/* Ticket Price (₹) */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#6F716B]">Ticket Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F716B]">₹</span>
                          <input 
                            type="number"
                            min="0"
                            value={tier.price}
                            onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                            className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
                          />
                        </div>
                      </div>

                      {/* Seats Breakdown & Layout */}
                      <div className="space-y-1 sm:col-span-1">
                        <label className="text-[10px] font-bold text-[#6F716B]">Seats Layout / Info</label>
                        <input 
                          type="text"
                          value={tier.seats_info}
                          onChange={(e) => handleTierChange(idx, 'seats_info', e.target.value)}
                          placeholder="e.g. 50 Seats (25 North / 25 South)"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#FFFDF8] focus:outline-none focus:border-[#7A8B5A]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#20221F]">Stadium Overview & Description</label>
              <textarea 
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed pitch specs, lighting system, changing rooms, and spectator details..."
                className="w-full p-3 text-xs font-semibold rounded-2xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
              />
            </div>

            {/* Facilities Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#20221F]">Facilities & Amenities</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Add facility e.g. VAR Rig, Sub-turf heating..."
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E1D8] bg-[#F7F5EF] focus:outline-none focus:border-[#7A8B5A]"
                />
                <button 
                  type="button"
                  onClick={handleAddFacility}
                  className="px-4 py-2 rounded-xl bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A]"
                >
                  + Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.facilities.map((fac, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#F7F5EF] border border-[#E4E1D8] text-xs font-bold text-[#20221F] flex items-center gap-1.5"
                  >
                    <span>{fac}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFacility(fac)}
                      className="text-red-500 hover:text-red-700 font-black text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Blocked Dates (Full-Day Booking Lock) */}
            <div className="space-y-2 border-t border-[#E4E1D8] pt-4">
              <label className="text-xs font-bold text-[#20221F] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7A8B5A]" />
                Block Entire Day / Unavailable Dates (Matchdays / Maintenance)
              </label>
              
              <div className="flex items-center gap-2">
                <input 
                  type="date"
                  value={blockedDateInput}
                  onChange={(e) => setBlockedDateInput(e.target.value)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-[#E4E1D8] bg-[#F7F5EF] text-[#20221F]"
                />
                <button 
                  type="button"
                  onClick={handleAddBlockedDate}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Block This Date
                </button>
              </div>

              {formData.blocked_dates.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.blocked_dates.map((d) => (
                    <span 
                      key={d}
                      className="px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2"
                    >
                      <span>🚫 {d}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveBlockedDate(d)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#E4E1D8] flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#E4E1D8] text-xs font-bold text-[#6F716B] hover:text-[#20221F]"
              >
                Cancel
              </button>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#20221F] text-white text-xs font-bold hover:bg-[#7A8B5A] shadow-warm-md flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#BEF264]" />
                <span>{isSubmitting ? 'Saving...' : stadiumToEdit ? 'Update Stadium' : 'Save & Publish Stadium'}</span>
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
