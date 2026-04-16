import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines, mockOTs } from '../data/mockData';
import { motion } from 'framer-motion';
export function MachineSelect() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const ot = mockOTs.find((o) => o.id === otId);
  // Get all machines for this OT
  const allMachines = mockMachines.filter((m) => m.otId === otId);
  // Filter out machines that have completed checklists
  const availableMachines = useMemo(() => {
    return allMachines.filter((machine) => {
      const saved = sessionStorage.getItem(`checklist-${machine.id}`);
      if (!saved) return true; // Not started yet
      const items = JSON.parse(saved);
      const allChecked = items.every((i: any) => i.status !== 'not-checked');
      return !allChecked; // Only show machines with incomplete checklists
    });
  }, [allMachines]);
  const handleMachineSelect = (machineId: string) => {
    navigate(`/technician/machine/${machineId}`);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Select Machine
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {ot?.name} • {availableMachines.length} available
            </p>
          </div>
        </header>

        {availableMachines.length === 0 ?
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 text-center">

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400  mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              All Machines Checked
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              All machines in {ot?.name} have completed checklists.
            </p>
            <button
            onClick={() => navigate(`/technician/machines/${otId}`)}
            className="bg-health-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-teal-600 transition-all active:scale-95">

              Back to Machine List
            </button>
          </motion.div> :

        <div className="space-y-4">
            {availableMachines.map((machine, index) =>
          <motion.button
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
              delay: index * 0.1
            }}
            onClick={() => handleMachineSelect(machine.id)}
            className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all text-left">

                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">
                      {machine.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {machine.model}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      SN: {machine.serialNumber}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
          )}
          </div>
        }
      </div>
      <BottomNavigation role="technician" />
    </div>);

}