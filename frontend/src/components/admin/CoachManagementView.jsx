import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  List, 
  Mail, 
  Phone, 
  Briefcase, 
  CheckCircle2, 
  XCircle,
  UserCheck,
  Globe
} from 'lucide-react';

export default function CoachManagementView({ 
  coaches, 
  searchQuery, 
  onAddCoach, 
  onEditCoach, 
  onDeleteCoach 
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'

  // Filter coaches based on search and status
  const filteredCoaches = coaches.filter((c) => {
    const matchesSearch = 
      (c.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.specialization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Toolbar */}
      <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-6 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7A8B5A] uppercase tracking-wider">Coaching Staff</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A]">
              {filteredCoaches.length} Coaches
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#20221F] font-serif tracking-tight mt-0.5">
            Coach Management
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter Dropdown */}
          <div className="flex items-center bg-[#F7F5EF] p-1 rounded-full border border-[#E4E1D8]">
            {['All', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === st 
                    ? 'bg-[#20221F] text-white shadow-warm-sm' 
                    : 'text-[#6F716B] hover:text-[#20221F]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center bg-[#F7F5EF] p-1 rounded-full border border-[#E4E1D8]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-[#20221F] text-white shadow-warm-sm' : 'text-[#6F716B]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'table' ? 'bg-[#20221F] text-white shadow-warm-sm' : 'text-[#6F716B]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Coach Button */}
          <button
            onClick={onAddCoach}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white text-xs font-bold transition-all shadow-warm-sm"
          >
            <UserCheck className="w-4 h-4 text-white" />
            <span>Add New Coach</span>
          </button>
        </div>
      </div>

      {/* Coaches List Display */}
      {filteredCoaches.length === 0 ? (
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#6F716B] flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-black text-[#20221F]">No Coaches Found</h3>
          <p className="text-xs text-[#6F716B] max-w-sm mx-auto">
            No coaching staff records match your current search or status filter criteria.
          </p>
          <button
            onClick={onAddCoach}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-sm hover:bg-[#627146] transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coach Now</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCoaches.map((coach) => (
            <motion.div
              key={coach._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
              className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[10px] font-black uppercase tracking-wider">
                    {coach.experience ? `${coach.experience} Yrs Exp` : 'Staff'}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    coach.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {coach.status}
                  </span>
                </div>

                {/* Avatar & Name */}
                <div className="text-center my-4 space-y-1">
                  <img
                    src={coach.profile_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'}
                    alt={coach.full_name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-[#20221F] shadow-warm-sm group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-serif font-black text-lg text-[#20221F] truncate pt-1">
                    {coach.full_name}
                  </h3>
                  <p className="text-xs font-bold text-[#7A8B5A] truncate">
                    {coach.specialization || 'Head Coach'}
                  </p>
                </div>

                {/* Details List */}
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-2 text-xs text-[#6F716B]">
                  {coach.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                      <span className="truncate">{coach.email}</span>
                    </div>
                  )}
                  {coach.phone && (
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                      <span className="truncate">{coach.phone}</span>
                    </div>
                  )}
                  {coach.nationality && (
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                      <span className="truncate">{coach.nationality}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                    <span>{coach.experience || 0} Years Coaching Exp.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#E4E1D8]">
                <button
                  onClick={() => onEditCoach(coach)}
                  className="flex-1 py-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] hover:bg-[#20221F] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteCoach(coach)}
                  className="py-2 px-3 rounded-full border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs flex items-center justify-center transition-all"
                  title="Delete Coach"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] shadow-warm-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#20221F]">
              <thead className="bg-[#F7F5EF] border-b border-[#E4E1D8] text-[10px] font-extrabold uppercase tracking-wider text-[#6F716B]">
                <tr>
                  <th className="px-6 py-4">Coach</th>
                  <th className="px-4 py-4">Specialization</th>
                  <th className="px-4 py-4">Experience</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1D8]">
                {filteredCoaches.map((coach) => (
                  <tr key={coach._id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coach.profile_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'}
                          alt={coach.full_name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E4E1D8]"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#20221F]">{coach.full_name}</p>
                          <p className="text-[11px] text-[#6F716B]">{coach.email || 'No email registered'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-bold text-[#7A8B5A]">
                      {coach.specialization || 'Head Coach'}
                    </td>

                    <td className="px-4 py-4 font-black font-serif text-sm">
                      {coach.experience || 0} Years
                    </td>

                    <td className="px-4 py-4 text-xs text-[#6F716B]">
                      {coach.phone || 'N/A'}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        coach.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coach.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditCoach(coach)}
                          className="p-2 rounded-full border border-[#E4E1D8] bg-[#F7F5EF] hover:bg-[#20221F] hover:text-white transition-all"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCoach(coach)}
                          className="p-2 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                          title="Delete Coach"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
