import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import DashboardShowcase from '../components/home/DashboardShowcase';
import ClubIntroduction from '../components/home/ClubIntroduction';
import UpcomingMatches from '../components/home/UpcomingMatches';
import MatchResults from '../components/home/MatchResults';
import FeaturedPlayers from '../components/home/FeaturedPlayers';
import LatestNews from '../components/home/LatestNews';
import AIAssistantSection from '../components/home/AIAssistantSection';
import TicketBookingSection from '../components/home/TicketBookingSection';
import GallerySection from '../components/home/GallerySection';
import FinalCTA from '../components/home/FinalCTA';

import AIAssistantModal from '../components/modals/AIAssistantModal';
import PlayerDetailModal from '../components/modals/PlayerDetailModal';

export default function HomePage() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#20221F] flex flex-col font-sans selection:bg-[#7A8B5A] selection:text-white">
      {/* 1. Translucent Sticky Navbar Header */}
      <Navbar 
        onOpenAIAssistant={() => setIsAIOpen(true)}
      />

      {/* Main Home Page Sections */}
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <HeroSection 
          onOpenAIAssistant={() => setIsAIOpen(true)}
        />

        {/* Section 2: Interactive Fan Dashboard Showcase */}
        <DashboardShowcase />

        {/* Section 3: Club Introduction & Ethos */}
        <ClubIntroduction />

        {/* Section 4: Upcoming Matches */}
        <UpcomingMatches />
        
        {/* Section 5: Latest Results & Form Guide */}
        <MatchResults />

        {/* Section 6: Featured Players & Roster */}
        <FeaturedPlayers 
          onSelectPlayer={(player) => setSelectedPlayer(player)}
        />

        {/* Section 7: Club News & Press Releases */}
        <LatestNews />

        {/* Section 8: AI Football Assistant Introduction */}
        <AIAssistantSection 
          onOpenAIAssistant={() => setIsAIOpen(true)}
        />

        {/* Section 9: Static Matchday Passes & Tickets Tiers */}
        <TicketBookingSection />

        {/* Section 10: Media Gallery & Highlights */}
        <GallerySection />

        {/* Section 11: Final Call-to-Action */}
        <FinalCTA 
          onOpenAIAssistant={() => setIsAIOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer 
        onOpenAIAssistant={() => setIsAIOpen(true)}
      />

      {/* Interactive AI & Player Modals */}
      <AIAssistantModal 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
      />

      <PlayerDetailModal 
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

    </div>
  );
}
