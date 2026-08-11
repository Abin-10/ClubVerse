import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Clock, Calendar, ArrowRight, X } from 'lucide-react';

export default function LatestNews() {
  const [activeArticle, setActiveArticle] = useState(null);

  const news = [
    {
      id: 1,
      title: "Lamine Yamal Signs Long-Term Contract Extension Until 2030",
      category: "OFFICIAL STATEMENT",
      date: "May 10, 2026",
      readTime: "3 min read",
      author: "ClubVerse Media",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      excerpt: "ClubVerse FC has reached an agreement to secure Lamine Yamal's future at Spotify Arena with a historic contract release clause.",
      content: "ClubVerse FC is delighted to announce that Lamine Yamal has signed a new long-term contract extension. The young forward expressed his joy at continuing his development with his home club."
    },
    {
      id: 2,
      title: "Spotify Arena Upgrade: Sustainable Solar Panels & Roof Completion",
      category: "STADIUM UPDATE",
      date: "May 06, 2026",
      readTime: "4 min read",
      author: "Stadium Operations",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
      excerpt: "The stadium renovation enters its final phase with 98,000 seating capacity, 360° LED rings, and eco-friendly solar roof integration.",
      content: "The Spotify Arena modernization project is nearing full completion. The upgraded facility features state-of-the-art turf management, retractable roof paneling, and improved supporter concourses."
    },
    {
      id: 3,
      title: "Tactical Analysis: High-Pressing Control in El Clásico Masterclass",
      category: "TACTICAL REPORT",
      date: "May 02, 2026",
      readTime: "5 min read",
      author: "Analytics Lab",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800",
      excerpt: "An in-depth tactical report analyzing the aggressive offside trap and rapid midfield transitions in the recent 4-0 derby win.",
      content: "A detailed breakdown of tactical positioning during the derby match. By organizing a compact mid-block and pressing opposition build-up, the squad dominated possession in key central areas."
    }
  ];

  return (
    <section id="news" className="py-24 bg-[#EFEEE8] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm">
              <Newspaper className="w-3.5 h-3.5 text-[#7A8B5A]" />
              <span>PRESS & ANNOUNCEMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
              Latest Club News
            </h2>
            <p className="text-sm text-[#6F716B] mt-2 font-medium max-w-xl">
              Official statements, tactical analysis, academy reports, and stadium developments.
            </p>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.div 
              key={article.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveArticle(article)}
              className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E4E1D8] shadow-warm-sm hover:shadow-warm-md flex flex-col justify-between group transition-all cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFEEE8]">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md text-[#20221F] text-[10px] font-bold uppercase tracking-wider shadow-warm-sm border border-[#E4E1D8]">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-[#6F716B]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6F716B]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#20221F] font-serif leading-snug group-hover:text-[#7A8B5A] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6F716B] line-clamp-2 leading-relaxed font-medium">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#E4E1D8] text-xs font-bold text-[#7A8B5A]">
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-[#20221F] shadow-warm-lg relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EFEEE8] hover:bg-[#E4E1D8] text-[#20221F]"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 bg-[#7A8B5A]/15 text-[#7A8B5A]">
                {activeArticle.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-semibold font-serif mb-3 leading-snug">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-[#6F716B] mb-4 pb-4 border-b border-[#E4E1D8]">
                <span>By {activeArticle.author}</span>
                <span>•</span>
                <span>{activeArticle.date}</span>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-[#EFEEE8]">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-sm text-[#6F716B] leading-relaxed font-medium space-y-4">
                <p>{activeArticle.excerpt}</p>
                <p>{activeArticle.content}</p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
