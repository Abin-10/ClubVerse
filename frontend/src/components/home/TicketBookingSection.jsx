import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export default function TicketBookingSection() {
  const [selectedZone, setSelectedZone] = useState('Lateral');

  const tiers = [
    {
      id: 'fan',
      name: 'North / South End',
      zone: 'Atmosphere Fan Sector',
      price: '€65',
      badge: 'FAN SECTOR',
      popular: false,
      features: [
        'Dedicated Fan Sector Access',
        'Official Clubverse Supporter Scarf',
        'Concourse Food Vouchers',
        'Standard Seat Allocation'
      ]
    },
    {
      id: 'lateral',
      name: 'Lateral Main Stand',
      zone: 'Prime Center Pitch View',
      price: '€120',
      badge: 'MOST POPULAR',
      popular: true,
      features: [
        'Center Field Panoramic View',
        'Fast-Track Turnstile Entry',
        'Digital Matchday Programme',
        'Pitchside Photo Pass Access'
      ]
    },
    {
      id: 'vip',
      name: 'Honorary VIP Tribune',
      zone: 'Presidential Suite Area',
      price: '€280',
      badge: 'LUXURY EXPERIENCE',
      popular: false,
      features: [
        'Presidential Lounge Hospitality',
        'Gourmet Catering & Refreshments',
        'Meet & Greet Legend Ambassador',
        'Reserved Stadium Parking Pass'
      ]
    }
  ];

  return (
    <section id="tickets" className="py-24 bg-[#EFEEE8] border-b border-[#E4E1D8] relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4E1D8] text-[#7A8B5A] text-xs font-bold uppercase tracking-widest shadow-warm-sm">
            <Ticket className="w-3.5 h-3.5 text-[#7A8B5A]" />
            <span>STATIC MATCHDAY PASSES & TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#20221F] tracking-tight font-serif">
            Spotify Arena Seating Passes
          </h2>
          <p className="text-sm text-[#6F716B] font-medium">
            Explore static matchday pass tiers for upcoming home matches at Spotify Arena.
          </p>
        </div>

        {/* Stadium Zone Selector */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#E4E1D8] mb-12 text-center max-w-3xl mx-auto relative overflow-hidden shadow-warm-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#B08D57] uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4 text-[#B08D57]" />
            <span>SPOTIFY ARENA SEATING SCHEME</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedZone('North / South')}
              className={`p-3 rounded-2xl border transition-all ${
                selectedZone === 'North / South' 
                  ? 'bg-[#7A8B5A] text-white border-[#7A8B5A]' 
                  : 'bg-[#EFEEE8] text-[#6F716B] border-[#E4E1D8] hover:text-[#20221F]'
              }`}
            >
              <span className="text-xs font-bold block">END SECTORS</span>
              <span className="text-[10px] font-medium block opacity-80">Behind Goals</span>
            </button>

            <button
              onClick={() => setSelectedZone('Lateral')}
              className={`p-3 rounded-2xl border transition-all ${
                selectedZone === 'Lateral' 
                  ? 'bg-[#7A8B5A] text-white border-[#7A8B5A]' 
                  : 'bg-[#EFEEE8] text-[#6F716B] border-[#E4E1D8] hover:text-[#20221F]'
              }`}
            >
              <span className="text-xs font-bold block">LATERAL STAND</span>
              <span className="text-[10px] font-medium block opacity-80">Full Pitch View</span>
            </button>

            <button
              onClick={() => setSelectedZone('VIP Tribune')}
              className={`p-3 rounded-2xl border transition-all ${
                selectedZone === 'VIP Tribune' 
                  ? 'bg-[#2E332B] text-[#B08D57] border-[#2E332B]' 
                  : 'bg-[#EFEEE8] text-[#6F716B] border-[#E4E1D8] hover:text-[#20221F]'
              }`}
            >
              <span className="text-xs font-bold block">VIP TRIBUNE</span>
              <span className="text-[10px] font-medium block opacity-80">Presidential Box</span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.id} 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`p-7 sm:p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular 
                  ? 'bg-[#FFFDF8] border-2 border-[#7A8B5A] shadow-warm-md' 
                  : 'bg-[#FFFDF8] border border-[#E4E1D8] shadow-warm-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7A8B5A] text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-warm-sm tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-[#20221F] font-serif">{tier.name}</h3>
                  {!tier.popular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EFEEE8] text-[#6F716B] text-[10px] font-bold uppercase">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6F716B] font-medium mb-6">{tier.zone}</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-semibold text-[#20221F] font-serif">{tier.price}</span>
                  <span className="text-xs text-[#6F716B] font-bold uppercase">/ MATCH PASS</span>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-[#6F716B] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#7A8B5A] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Static Pass Indicator */}
              <div
                className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 ${
                  tier.popular 
                    ? 'bg-[#7A8B5A] text-white shadow-warm-sm' 
                    : 'bg-[#EFEEE8] text-[#20221F] border border-[#E4E1D8]'
                }`}
              >
                <span>Pass Tier Included</span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
