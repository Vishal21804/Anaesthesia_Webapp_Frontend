import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  ArrowLeft,
  Wrench,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  Edit2 } from
'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
export function HMMachineManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMachineType, setSelectedMachineType] = useState('');
  const [selectedOTType, setSelectedOTType] = useState('');
  const machineTypes = [
  'All Types',
  'Anesthesia Machine',
  'Ventilator',
  'Patient Monitor',
  'Surgical Light',
  'Electrosurgical Unit',
  'Suction Machine',
  'Defibrillator',
  'Infusion Pump'];

  const otTypes = [
  'All OT Types',
  'General',
  'Cardiac',
  'Orthopedic',
  'Neuro',
  'Ophthalmic',
  'ENT'];

  const filteredMachines = mockMachines.filter(
    (m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getOTCountText = (machine: (typeof mockMachines)[0]) => {
    const count = machine.assignedOTIds?.length || (machine.otId ? 1 : 0);
    if (count === 0) return 'Unassigned';
    if (count === 1) return '1 OT Assigned';
    return `${count} OTs Assigned`;
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/management-page')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Machine Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hospital Inventory
            </p>
          </div>
          <button
            onClick={() => navigate('/management/add-machine')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30">

            <PlusIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
        </header>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search machines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-colors ${showFilters ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'}`}>

            <FilterIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters &&
        <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">

            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                Filters
              </span>
              <button
              onClick={() => {
                setSelectedMachineType('');
                setSelectedOTType('');
              }}
              className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700">

                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Machine Type
                </label>
                <select
                value={selectedMachineType}
                onChange={(e) => setSelectedMachineType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">

                  {machineTypes.map((type) =>
                <option key={type} value={type}>
                      {type}
                    </option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  OT Type
                </label>
                <select
                value={selectedOTType}
                onChange={(e) => setSelectedOTType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">

                  {otTypes.map((type) =>
                <option key={type} value={type}>
                      {type}
                    </option>
                )}
                </select>
              </div>
            </div>
          </motion.div>
        }

        {/* Add New Machine Button */}
        <button
          onClick={() => navigate('/management/add-machine')}
          className="w-full py-4 mb-6 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-colors">

          <Plus className="w-5 h-5" />
          Add New Machine
        </button>

        {/* Machine List */}
        <div className="space-y-4">
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
              }}>

                <button
                onClick={() => navigate(`/hm-edit-machine/${machine.id}`)}
                className="w-full text-left bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">
                        {machine.name}
                      </h3>

                      <div className="flex items-center gap-1.5 mb-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="truncate">{machine.model}</span>
                        <span className="text-slate-300 dark:text-slate-600">
                          •
                        </span>
                        <span className="font-mono text-xs">
                          {machine.serialNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {getOTCountText(machine)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{machine.lastChecked}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {machine.status === 'working' ?
                      <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                            Working
                          </span> :

                      <span className="px-2 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-rose-100 dark:border-rose-900/50">
                            Broken
                          </span>
                      }
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredMachines.length === 0 &&
          <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No machines found matching your search.
              </p>
            </div>
          }
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}