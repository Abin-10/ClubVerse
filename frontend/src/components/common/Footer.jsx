import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Send, CheckCircle2, Shield, Globe, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export default function Footer({ onOpenAIAssistant }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const sponsors = ['NIKE', 'SPOTIFY', 'AMBILIGHT TV', 'CUPRA', '1XBET', 'KONAMI'];

  return (
    <footer className="bg-[#2E332B] text-[#EFEEE8] pt-20 pb-12 border-t border-[#2E332B] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sponsors Strip */}
        <div className="pb-12 border-b border-[#EFEEE8]/15 mb-12">
          <span className="text-[10px] font-bold text-[#B08D57] tracking-widest uppercase block text-center mb-6">
            OFFICIAL GLOBAL PARTNERS & SPONSORS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
            {sponsors.map(sponsor => (
              <span key={sponsor} className="text-base sm:text-lg font-semibold text-[#EFEEE8] font-serif tracking-wider hover:text-[#B08D57] transition-colors cursor-pointer">
                {sponsor}
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EFEEE8]/15">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex flex-col group inline-block">
              <div className="flex items-center gap-1">
                <span className="font-black text-2xl tracking-tight text-white font-serif">
                  Club
                </span>
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-[#7A8B5A] via-[#94A76F] to-[#B08D57] bg-clip-text text-transparent">
                  Verse
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B5A] inline-block ml-0.5"></span>
              </div>
              <span className="text-[9px] font-extrabold text-[#B08D57] uppercase tracking-[0.22em] -mt-1">
                Management & Fan Hub
              </span>
            </Link>

            <p className="text-xs text-[#EFEEE8]/80 leading-relaxed max-w-md font-medium">
              Official digital experience of ClubVerse FC. Reserve Spotify Arena passes, explore team performance, read official news, and interact with AI Scout.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onOpenAIAssistant}
                className="px-4 py-2 rounded-xl bg-[#FFFDF8]/10 border border-[#EFEEE8]/20 text-[#B08D57] font-bold text-xs flex items-center gap-1.5 hover:bg-[#FFFDF8]/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Football Scout</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#B08D57] uppercase tracking-widest font-sans">
              CLUB SECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#EFEEE8]/80">
              <li><a href="#matches" className="hover:text-white transition-colors">Fixtures & Schedule</a></li>
              <li><a href="#players" className="hover:text-white transition-colors">First Team Roster</a></li>
              <li><a href="#introduction" className="hover:text-white transition-colors">Club Philosophy</a></li>
              <li><a href="#tickets" className="hover:text-white transition-colors">Matchday Passes</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">Press & Statements</a></li>
            </ul>
          </div>

          {/* Fan Experience */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#B08D57] uppercase tracking-widest font-sans">
              MEMBERSHIP & HUB
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#EFEEE8]/80">
              <li><span className="hover:text-white transition-colors cursor-pointer">Official Supporters Club</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">ClubVerse Video Hub</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Youth Academy Development</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Spotify Arena Tour</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Official Fan Store</span></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#B08D57] uppercase tracking-widest font-sans">
              CLUB NEWSLETTER
            </h4>
            <p className="text-xs text-[#EFEEE8]/80 font-medium leading-relaxed">
              Get exclusive starting lineups, matchday ticket priority alerts, and tactical reports directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supporter@clubverse.fc"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FFFDF8]/10 border border-[#EFEEE8]/20 text-white placeholder-[#EFEEE8]/50 text-xs focus:outline-none focus:border-[#7A8B5A]"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#7A8B5A] text-white hover:bg-[#627146]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-[#B08D57] text-xs font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the Supporters Hub!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#EFEEE8]/60">
          <div>
            <span>© {new Date().getFullYear()} ClubVerse FC Platform. All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Cookie Notice</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
