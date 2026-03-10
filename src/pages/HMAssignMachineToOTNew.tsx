import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Search, Filter } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines } from '../data/mockData';
import { motion } from 'framer-motion';
export function HMAssignMachineToOTNew() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Filter machines: show all machines, but maybe indicate which are already assigned elsewhere
  // For this flow, we'll just list all machines
  const filteredMachines = mockMachines.filter(
    (m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleSelection = (id: string) => {
    setSelectedMachineIds((prev) =>
    prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };
  const handleSave = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      navigate(`/management/ot-detail/${otId}`);
    }, 1500);
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
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Assign Machines
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select machines to add to OT
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

          </div>
          <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-600 hover:border-purple-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Machine List with Checkboxes */}
        <div className="space-y-3 mb-24">
          {filteredMachines.map((machine, index) => {
            const isSelected = selectedMachineIds.includes(machine.id);
            return (
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
                  delay: index * 0.05
                }}
                onClick={() => toggleSelection(machine.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all relative overflow-hidden ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-1 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300 dark:border-slate-600'}`}>

                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {machine.model}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                        {machine.serialNumber}
                      </span>
                      {machine.otId &&
                      <span className="text-[10px] text-slate-400">
                          Currently in {machine.otId.toUpperCase()}
                        </span>
                      }
                    </div>
                  </div>
                </div>
              </motion.button>);

          })}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-20">
          <button
            onClick={handleSave}
            disabled={selectedMachineIds.length === 0 || isSubmitting}
            className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${selectedMachineIds.length > 0 ? 'bg-purple-600 text-white shadow-purple-600/30 hover:bg-purple-700 active:scale-95' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}>

            {isSubmitting ?
            <span className="animate-pulse">Assigning...</span> :

            `Assign ${selectedMachineIds.length} Machine${selectedMachineIds.length !== 1 ? 's' : ''}`
            }
          </button>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}