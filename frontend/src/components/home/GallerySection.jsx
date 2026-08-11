import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Maximize2, X } from 'lucide-react';

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const categories = ['ALL', 'MATCHDAY', 'STADIUM VIBES', 'TRAINING', 'CELEBRATIONS'];

  const gallery = [
    {
      id: 1,
      title: "Yamal Goal Celebration vs Real Madrid",
      category: "MATCHDAY",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000",
      description: "Goal celebration in front of a sold-out Spotify Arena after a curling strike."
    },
    {
      id: 2,
      title: "Spotify Arena Night Illumination",
      category: "STADIUM VIBES",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000",
      description: "Breathtaking aerial view of Spotify Arena illuminated before kickoff."
    },
    {
      id: 3,
      title: "Midfield Rondos at Training Ground",
      category: "TRAINING",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000",
      description: "Pedri and Gavi mastering quick one-touch passing during morning practice."
    },
    {
      id: 4,
      title: "Trophy Parade through City Streets",
      category: "CELEBRATIONS",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1000",
      description: "Supporters flood the city center to celebrate the trophy parade."
    }
  ];

  const filteredGallery = selectedFilter === 'ALL'
    ? gallery
    : gallery.filter(item => item.category === selectedFilter);

  return (
    <section id="gallery" className="py-24 bg-[#F7F5EF] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm">
              <ImageIcon className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>MEDIA GALLERY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
              Matchday Gallery
            </h2>
            <p className="text-sm text-[#6F716B] mt-2 font-medium max-w-xl">
              Pitch action, training ground moments, and supporter celebrations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#EFEEE8] p-1.5 rounded-full border border-[#E4E1D8] overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-[#7A8B5A] text-white shadow-warm-sm'
                    : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#FFFDF8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveImage(item)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#EFEEE8] cursor-pointer shadow-warm-sm border border-[#E4E1D8] transition-all hover:border-[#7A8B5A]"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#20221F]/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md text-[#20221F] text-[10px] font-bold uppercase tracking-wider shadow-warm-sm border border-[#E4E1D8]">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-sm font-semibold truncate pr-2 font-serif">{item.title}</span>
                  <div className="w-8 h-8 rounded-full bg-[#7A8B5A] text-white flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform flex-shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl overflow-hidden shadow-warm-lg"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full overflow-hidden bg-[#EFEEE8]">
                <img 
                  src={activeImage.image} 
                  alt={activeImage.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 text-[#20221F]">
                <span className="px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  {activeImage.category}
                </span>
                <h3 className="text-2xl font-semibold font-serif mb-2">{activeImage.title}</h3>
                <p className="text-xs text-[#6F716B] font-medium leading-relaxed">{activeImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
