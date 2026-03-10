import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  LayoutGrid,
  Search,
  Filter,
  Edit2,
  Activity,
  AlertCircle } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockOTs, mockMachines } from '../data/mockData';
export function HMManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab =
  searchParams.get('tab') === 'machines' ? 'machines' : 'otRooms';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'otRooms' | 'machines'>(initialTab);
  // Mock OT types
  const otTypes: Record<string, string> = {
    'ot-1': 'General',
    'ot-2': 'Cardiac',
    'ot-3': 'Emergency',
    icu: 'Critical Care',
    rec: 'Recovery'
  };
  // Dynamic header content based on active tab
  const headerTitle =
  activeTab === 'otRooms' ? 'OT Management' : 'Machine Management';
  const headerSubtitle =
  activeTab === 'otRooms' ?
  'Configure Operation Theatres' :
  'Hospital Inventory';
  const filteredOTs = mockOTs.filter((ot) =>
  ot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMachines = mockMachines.filter(
    (machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
              {headerTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {headerSubtitle}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('otRooms')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'otRooms' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>

            OT ROOMS
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'machines' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>

            MACHINES
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
              activeTab === 'otRooms' ? 'Search OTs...' : 'Search machines...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

          </div>
          <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-600 hover:border-purple-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'otRooms' ?
        <>
            {/* Add OT Button */}
            <button
            onClick={() => navigate('/management/add-ot')}
            className="w-full py-4 mb-6 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-colors">

              <Plus className="w-5 h-5" />
              Add New OT
            </button>

            {/* OT List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredOTs.map((ot, index) =>
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

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <LayoutGrid className="w-6 h-6" />
                          </div>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
                            {otTypes[ot.id] || 'General'}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                          {ot.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                          {ot.machineCount} Machines Assigned
                        </p>

                        <div className="flex items-center justify-end">
                          <button
                        onClick={() =>
                        navigate(`/management/edit-ot/${ot.id}`)
                        }
                        className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">

                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          </> :

        <div className="space-y-4">
            {/* Add New Machine Button */}
            <button
            onClick={() => navigate('/management/add-machine')}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-colors">

              <Plus className="w-5 h-5" />
              Add New Machine
            </button>

            <AnimatePresence mode="popLayout">
              {filteredMachines.map((machine, index) =>
            <motion.div
              key={machine.id}
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">

                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                    {machine.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {machine.model}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {machine.assignedOTIds?.map((otId) => {
                  const ot = mockOTs.find((o) => o.id === otId);
                  return ot ?
                  <span
                    key={otId}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">

                          {ot.name}
                        </span> :
                  null;
                })}
                  </div>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
        }
      </div>

      <BottomNavigation role="management" />
    </div>);

}