import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit, Eye, Filter, CheckCircle2, ShieldCheck, Activity, Award } from 'lucide-react';
import CoachPlayerDetailModal from './CoachPlayerDetailModal';
import UpdatePerformanceModal from './UpdatePerformanceModal';

export default function CoachPlayerManagementView({ 
  players = [], 
  searchQuery = '', 
  onUpdatePerformance,
  triggerToast 
}) {
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayerForView, setSelectedPlayerForView] = useState(null);
  const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState(null);

  // Fallback initial squad if backend list is loading/empty
  const squadList = players.length > 0 ? players : [
    {
      _id: 'p1',
      full_name: 'Bukayo Saka',
      email: 'saka7@clubverse.com',
      position: 'Forward / Winger',
      jersey_number: 7,
      goals: 14,
      assists: 9,
      passAccuracy: '88.5%',
      matchRating: '8.6',
      fitnessStatus: '100% Fit',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      _id: 'p2',
      full_name: 'Declan Rice',
      email: 'declan.rice@clubverse.com',
      position: 'Midfielder',
      jersey_number: 41,
      goals: 5,
      assists: 8,
      passAccuracy: '91.2%',
      matchRating: '8.4',
      fitnessStatus: '100% Fit',
      profile_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      _id: 'p3',
      full_name: 'William Saliba',
      email: 'saliba2@clubverse.com',
      position: 'Defender',
      jersey_number: 2,
      goals: 2,
      assists: 1,
      passAccuracy: '93.8%',
      matchRating: '8.5',
      fitnessStatus: '100% Fit',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      _id: 'p4',
      full_name: 'David Raya',
      email: 'raya22@clubverse.com',
      position: 'Goalkeeper',
      jersey_number: 22,
      goals: 0,
      assists: 1,
      passAccuracy: '84.0%',
      matchRating: '8.2',
      fitnessStatus: '100% Fit',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'Active'
    }
  ];

  const filteredPlayers = squadList.filter(player => {
    const name = player.full_name || player.name || '';
    const pos = player.position || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pos.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = positionFilter === 'all' || pos.toLowerCase().includes(positionFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1D8] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#20221F]">
            Player Management & Performance
          </h2>
          <p className="text-xs text-[#6F716B] mt-1">
            View assigned squad players, profile details, and update individual match statistics.
          </p>
        </div>

        {/* Position Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'forward', 'midfielder', 'defender', 'goalkeeper'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                positionFilter === pos 
                  ? 'bg-[#20221F] text-white shadow-warm-sm' 
                  : 'bg-[#F7F5EF] text-[#6F716B] hover:text-[#20221F] border border-[#E4E1D8]'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players Table / Grid */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-3xl p-6 shadow-warm-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7A8B5A]" />
            <h3 className="font-serif font-black text-base text-[#20221F]">
              Assigned First Team Squad ({filteredPlayers.length})
            </h3>
          </div>
        </div>

        {/* Responsive Searchable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4E1D8] text-[#6F716B] uppercase tracking-wider font-extrabold">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Jersey #</th>
                <th className="py-3 px-4">Goals / Assists</th>
                <th className="py-3 px-4">Pass Acc.</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D8]">
              {filteredPlayers.map((player) => (
                <tr key={player._id} className="hover:bg-[#F7F5EF]/70 transition-colors">
                  
                  {/* Player Name & Image */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={player.profile_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'} 
                        alt={player.full_name} 
                        className="w-10 h-10 rounded-xl object-cover border border-[#7A8B5A]" 
                      />
                      <div>
                        <div className="font-bold text-[#20221F] text-xs">{player.full_name || player.name}</div>
                        <div className="text-[10px] text-[#6F716B]">{player.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Position */}
                  <td className="py-3.5 px-4 font-bold text-[#7A8B5A]">
                    {player.position}
                  </td>

                  {/* Jersey */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#20221F]">
                    #{player.jersey_number || 'N/A'}
                  </td>

                  {/* Goals & Assists */}
                  <td className="py-3.5 px-4 font-bold text-[#20221F]">
                    {player.goals || 0} G / {player.assists || 0} A
                  </td>

                  {/* Pass Accuracy */}
                  <td className="py-3.5 px-4 font-bold text-[#20221F]">
                    {player.passAccuracy || '88.5%'}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#BEF264] text-[#20221F] font-black text-[11px]">
                      ★ {player.matchRating || '8.5'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedPlayerForView(player)}
                        className="p-2 rounded-xl bg-[#F7F5EF] hover:bg-[#EFEEE8] border border-[#E4E1D8] text-[#20221F] transition-colors"
                        title="View Player Profile"
                      >
                        <Eye className="w-4 h-4 text-[#7A8B5A]" />
                      </button>

                      <button
                        onClick={() => setSelectedPlayerForEdit(player)}
                        className="px-3 py-1.5 rounded-xl bg-[#20221F] hover:bg-[#7A8B5A] text-white text-[11px] font-bold shadow-warm-sm transition-all flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#BEF264]" />
                        <span>Update Performance</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      <CoachPlayerDetailModal 
        isOpen={Boolean(selectedPlayerForView)}
        onClose={() => setSelectedPlayerForView(null)}
        player={selectedPlayerForView}
      />

      {/* Update Performance Modal */}
      <UpdatePerformanceModal 
        isOpen={Boolean(selectedPlayerForEdit)}
        onClose={() => setSelectedPlayerForEdit(null)}
        player={selectedPlayerForEdit}
        onSavePerformance={(updated) => {
          if (onUpdatePerformance) onUpdatePerformance(updated);
        }}
        triggerToast={triggerToast}
      />

    </div>
  );
}
