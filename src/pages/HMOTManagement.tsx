import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, SearchIcon, FilterIcon } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { OTCard } from '../components/OTCard';
import { mockOTs } from '../data/mockData';
import { motion } from 'framer-motion';
export function HMOTManagement() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOTType, setSelectedOTType] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const otTypes = [
  'All Types',
  'General',
  'Cardiac',
  'Orthopedic',
  'Neuro',
  'Ophthalmic',
  'ENT'];

  const floors = [
  'All Floors',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor'];

  // Filter logic
  const filteredOTRooms = mockOTs.filter((room) => {
    const matchesSearch = room.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    const matchesOTType =
    !selectedOTType ||
    selectedOTType === 'All Types' ||
    room.type === selectedOTType;
    const matchesFloor =
    !selectedFloor ||
    selectedFloor === 'All Floors' ||
    room.floor === selectedFloor;
    return matchesSearch && matchesOTType && matchesFloor;
  });
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/management/management-page')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            OT Management
          </h1>
        </header>

        <motion.button
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={() => navigate('/management/add-ot')}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all mb-6">

          <Plus className="w-5 h-5" />
          Add New OT
        </motion.button>

        <div className="space-y-4">
          {filteredOTRooms.map((ot, index) =>
          <motion.div
            key={ot.id}
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: index * 0.05
            }}
            className="relative group">

              <div className="absolute top-3 right-3 z-10">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
                  {otTypes[ot.id] || 'General'}
                </span>
              </div>
              <OTCard
              ot={ot}
              onClick={() => navigate(`/management/edit-ot/${ot.id}`)} />

            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}