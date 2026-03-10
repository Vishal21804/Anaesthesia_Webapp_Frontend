import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { MachineCard } from '../components/MachineCard';
import { mockMachines, mockOTs } from '../data/mockData';
export function ATOTDetails() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const ot = mockOTs.find((o) => o.id === otId) || mockOTs[0];
  const machines = mockMachines.filter((m) => m.otId === otId);
  // Calculate stats
  const totalMachines = machines.length;
  // Simulate some checked machines for demo
  const checkedCount = Math.floor(totalMachines * 0.3);
  const issueCount = machines.filter((m) => m.status === 'broken').length;
  const handleStartAll = () => {
    if (machines.length > 0) {
      navigate(`/technician/checklist/${otId}/${machines[0].id}`);
    }
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
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {ot.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Daily Safety Check
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {totalMachines}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 mb-1">
                {checkedCount}
              </div>
              <div className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">
                Checked
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-1">
                {issueCount}
              </div>
              <div className="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-wider">
                Issues
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search machines..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

          </div>

          {/* Start Button */}
          <motion.button
            initial={{
              y: 10,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            whileTap={{
              scale: 0.98
            }}
            onClick={handleStartAll}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all">

            <Play className="w-5 h-5 fill-current" />
            Start All Checklists
          </motion.button>
        </header>

        {/* Machine List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Machine List
          </h2>
          {machines.map((machine, index) =>
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

              <MachineCard
              machine={machine}
              onClick={() =>
              navigate(`/technician/checklist/${otId}/${machine.id}`)
              }
              showStatus={true} />

            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="technician" />
    </div>);

}