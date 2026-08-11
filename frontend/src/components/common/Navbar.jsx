import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu as MenuIcon, 
  X, 
  User, 
  LogOut, 
  Trophy, 
  Calendar, 
  Users, 
  Newspaper, 
  Image as ImageIcon,
  Sparkles,
  Ticket,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ onOpenAIAssistant }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  // Simulated logged-in user state from localStorage
  const currentUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active hash section detection
      const sections = ['players', 'matches', 'tickets', 'news', 'gallery', 'ai-assistant'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clubverse_user');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', id: 'home', href: '/', isHash: false, icon: Trophy },
    { name: 'Team', id: 'players', href: '#players', isHash: true, icon: Users },
    { name: 'Matches', id: 'matches', href: '#matches', isHash: true, icon: Calendar },
    { name: 'Tickets', id: 'tickets', href: '#tickets', isHash: true, icon: Ticket },
    { name: 'News', id: 'news', href: '#news', isHash: true, icon: Newspaper },
    { name: 'Gallery', id: 'gallery', href: '#gallery', isHash: true, icon: ImageIcon },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.isHash) {
      const targetId = link.href.replace('#', '');
      setActiveSection(targetId);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveSection('home');
      navigate(link.href);
    }
  };

  const scrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F7F5EF]/95 backdrop-blur-xl py-3 border-b border-[#E4E1D8] shadow-warm-md' 
          : 'bg-[#F7F5EF]/75 backdrop-blur-md py-4 border-b border-[#E4E1D8]/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group py-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex items-center gap-1"
            >
              <span className="font-black text-2xl tracking-tight text-[#20221F] font-serif">
                Club
              </span>
              <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-[#7A8B5A] via-[#8C9F67] to-[#B08D57] bg-clip-text text-transparent">
                Verse
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B5A] inline-block ml-0.5 animate-pulse"></span>
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#FFFDF8]/90 backdrop-blur-md px-2 py-1.5 rounded-full border border-[#E4E1D8] shadow-warm-sm">
            {navLinks.map((link) => {
              const isActive = (link.isHash && activeSection === link.id) || (!link.isHash && location.pathname === link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.isHash) {
                      e.preventDefault();
                      handleNavClick(link);
                    } else if (link.href.startsWith('/')) {
                      e.preventDefault();
                      navigate(link.href);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#20221F] text-[#F7F5EF] shadow-warm-sm'
                      : 'text-[#6F716B] hover:text-[#20221F] hover:bg-[#EFEEE8]/80'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Passes Trigger */}
            <button
              onClick={scrollToTickets}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[#20221F] bg-[#FFFDF8] border border-[#E4E1D8] hover:border-[#B08D57]/60 hover:bg-[#EFEEE8]/50 transition-all shadow-warm-sm group"
            >
              <Ticket className="w-3.5 h-3.5 text-[#B08D57] group-hover:rotate-12 transition-transform duration-200" />
              <span>Passes</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#7A8B5A] bg-[#7A8B5A]/10 hover:bg-[#7A8B5A]/20 border border-[#7A8B5A]/30 transition-all shadow-warm-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A] group-hover:scale-110 transition-transform duration-200" />
              <span>AI Scout</span>
            </button>

            {/* Auth Profile / Actions */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-[#FFFDF8] px-3.5 py-1.5 rounded-full border border-[#E4E1D8] shadow-warm-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7A8B5A] to-[#627146] text-white text-xs font-extrabold flex items-center justify-center shadow-warm-sm">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#20221F] max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-[#6F716B] hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 bg-[#FFFDF8] p-1 rounded-full border border-[#E4E1D8] shadow-warm-sm">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-[#6F716B] hover:text-[#20221F] transition-colors rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#7A8B5A] to-[#627146] hover:brightness-105 rounded-full shadow-warm-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Buttons */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenAIAssistant}
              className="p-2 text-[#7A8B5A] bg-[#FFFDF8] border border-[#E4E1D8] rounded-full shadow-warm-sm active:scale-95 transition-transform"
              aria-label="AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#20221F] bg-[#FFFDF8] border border-[#E4E1D8] shadow-warm-sm active:scale-95 transition-transform"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[#F7F5EF]/98 backdrop-blur-xl border-b border-[#E4E1D8] px-4 pt-3 pb-6 space-y-4 shadow-warm-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = (link.isHash && activeSection === link.id) || (!link.isHash && location.pathname === link.href);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (link.isHash) {
                        e.preventDefault();
                        handleNavClick(link);
                      } else {
                        setMobileMenuOpen(false);
                        navigate(link.href);
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#20221F] text-[#F7F5EF] shadow-warm-sm'
                        : 'text-[#20221F] hover:bg-[#EFEEE8]'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-[#7A8B5A]' : 'text-[#7A8B5A]'}`} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#E4E1D8] space-y-2">
              <div className="flex items-center justify-center">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAIAssistant();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#7A8B5A]/30 text-[#7A8B5A] font-bold text-xs bg-[#7A8B5A]/10 shadow-warm-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  <span>AI Scout</span>
                </button>
              </div>

              {currentUser ? (
                <div className="flex items-center justify-between bg-[#FFFDF8] p-3 rounded-xl border border-[#E4E1D8] shadow-warm-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#7A8B5A]" />
                    <span className="text-xs font-bold text-[#20221F]">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl border border-[#E4E1D8] text-[#20221F] font-bold text-xs bg-[#FFFDF8]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
