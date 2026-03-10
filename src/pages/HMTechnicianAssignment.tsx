import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  User,
  MapPin,
  Filter } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
// Mock technicians data with roles
const technicians = [
{
  id: 'tech-1',
  name: 'Alex Taylor',
  role: 'AT',
  roleLabel: 'Anaesthesia Tech',
  assignedOTs: ['ot-1', 'ot-2'],
  avatar:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-2',
  name: 'Sarah Smith',
  role: 'AT',
  roleLabel: 'Anaesthesia Tech',
  assignedOTs: ['ot-3'],
  avatar:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-3',
  name: 'Mike Johnson',
  role: 'IC',
  roleLabel: 'OT Incharge',
  assignedOTs: ['icu'],
  avatar:
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-4',
  name: 'Maria Garcia',
  role: 'BMET',
  roleLabel: 'Biomedical Tech',
  assignedOTs: [],
  avatar:
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-5',
  name: 'James Wilson',
  role: 'BMET',
  roleLabel: 'Biomedical Tech',
  assignedOTs: ['rec'],
  avatar:
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}];

type FilterRole = 'ALL' | 'AT' | 'IC' | 'BMET';
export function HMTechnicianAssignment() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTechnicians = technicians.filter((tech) => {
    const matchesRole = activeFilter === 'ALL' || tech.role === activeFilter;
    const matchesSearch = tech.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Technician Assignment
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage staff OT access
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {[
          {
            id: 'ALL',
            label: 'All Staff'
          },
          {
            id: 'AT',
            label: 'Anaesthesia Techs'
          },
          {
            id: 'IC',
            label: 'OT Incharge'
          },
          {
            id: 'BMET',
            label: 'Biomedical Techs'
          }].
          map((filter) =>
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as FilterRole)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

              {filter.label}
            </button>
          )}
        </div>

        {/* Technician List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTechnicians.map((tech, index) =>
            <motion.button
              key={tech.id}
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.95
              }}
              transition={{
                delay: index * 0.05
              }}
              onClick={() =>
              navigate(`/management/technician-ot-assign/${tech.id}`)
              }
              className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all text-left group">

                <div className="relative">
                  <img
                  src={tech.avatar}
                  alt={tech.name}
                  className="w-12 h-12 rounded-xl object-cover" />

                  <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${tech.role === 'AT' ? 'bg-emerald-500' : tech.role === 'IC' ? 'bg-amber-500' : 'bg-blue-500'}`} />

                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {tech.name}
                    </h3>
                    <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${tech.role === 'AT' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : tech.role === 'IC' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>

                      {tech.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {tech.assignedOTs.length > 0 ?
                  `${tech.assignedOTs.length} OT${tech.assignedOTs.length > 1 ? 's' : ''} Assigned` :
                  'No OTs Assigned'}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>

          {filteredTechnicians.length === 0 &&
          <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No staff found matching your criteria.
              </p>
            </div>
          }
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}