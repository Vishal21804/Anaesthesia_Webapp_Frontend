import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  Activity,
  AlertCircle,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Tag,
  Hash } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines, mockOTs } from '../data/mockData';
import { OTCard } from '../components/OTCard';
export function HMMachineDetail() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const machine = mockMachines.find((m) => m.id === machineId);
  const [assignedOTIds, setAssignedOTIds] = useState<string[]>(
    machine?.assignedOTIds || (machine?.otId ? [machine.otId] : [])
  );
  if (!machine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-health-bg dark:bg-slate-950">
        <p className="text-slate-500">Machine not found</p>
      </div>);

  }
  const assignedOTs = mockOTs.filter((ot) => assignedOTIds.includes(ot.id));
  const handleRemoveOT = (otId: string) => {
    // In a real app, this would be an API call
    setAssignedOTIds((prev) => prev.filter((id) => id !== otId));
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/machines')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Machine Details
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Inventory Management
            </p>
          </div>
        </header>

        {/* Machine Info Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {machine.name}
                </h2>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                  <Tag className="w-3 h-3" />
                  <span>{machine.model}</span>
                </div>
              </div>
            </div>
            {machine.status === 'working' ?
            <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                <Activity className="w-3 h-3" />
                Working
              </div> :

            <div className="px-2 py-1 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-100 dark:border-rose-900/50 flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-500">
                <AlertCircle className="w-3 h-3" />
                Broken
              </div>
            }
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> Serial Number
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {machine.serialNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last Checked
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {machine.lastChecked}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Assigned OTs Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            Assigned Locations
          </h3>
          <button
            onClick={() =>
            navigate(`/management/machine-assign-ots/${machineId}`)
            }
            className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:text-purple-700 transition-colors">

            <Plus className="w-4 h-4" />
            Assign to OTs
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {assignedOTs.length > 0 ?
            assignedOTs.map((ot, index) =>
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
              exit={{
                scale: 0.95,
                opacity: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              className="relative group">

                  <OTCard
                ot={ot}
                onClick={() => navigate(`/management/ot-detail/${ot.id}`)} />

                  <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveOT(ot.id);
                }}
                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors z-20"
                aria-label="Remove assignment">

                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
            ) :

            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">

                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  No OTs assigned
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Assign this machine to an operation theatre
                </p>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}