import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#20221F] relative flex flex-col justify-between overflow-hidden font-sans selection:bg-[#7A8B5A] selection:text-white">
      
      {/* Background Soft Lighting */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#EFEEE8] rounded-full blur-3xl pointer-events-none opacity-80"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#E4E1D8]/60 rounded-full blur-3xl pointer-events-none opacity-70"></div>

      {/* Top Header Bar */}
      <header className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6F716B] hover:text-[#20221F] bg-[#FFFDF8] px-4 py-2 rounded-full border border-[#E4E1D8] shadow-warm-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#7A8B5A]" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-1">
            <span className="font-black text-xl tracking-tight text-[#20221F] font-serif">
              Club
            </span>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[#7A8B5A] to-[#B08D57] bg-clip-text text-transparent">
              Verse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B5A] inline-block ml-0.5"></span>
          </div>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 relative z-10">
        <LoginForm />
      </main>

      {/* Minimal Footer Note */}
      <footer className="p-6 text-center text-xs text-[#6F716B] relative z-10 font-medium">
        <p>© {new Date().getFullYear()} ClubVerse FC • Spotify Arena Platform</p>
      </footer>

    </div>
  );
}
