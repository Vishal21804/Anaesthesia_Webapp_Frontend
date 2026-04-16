import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockOTs, mockMachines } from '../data/mockData';
export function HMAssignMachineToOT() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const machine =
  mockMachines.find((m) => m.id === machineId) || mockMachines[0];
  const [selectedOT, setSelectedOT] = useState(machine.otId);
  const [loading, setLoading] = useState(false);
  const handleAssign = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/management/machines');
    }, 1500);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
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
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Assign to OT
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update machine location
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

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1">
                {machine.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {machine.model}
              </p>
              <p className="text-xs font-mono text-slate-400">
                SN: {machine.serialNumber}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.1
          }}
          className="space-y-4 mb-8">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
            Select Operation Theatre
          </h3>

          {mockOTs.map((ot) =>
          <button
            key={ot.id}
            onClick={() => setSelectedOT(ot.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedOT === ot.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'}`}>

              <div className="flex items-center gap-3">
                <MapPin
                className={`w-5 h-5 ${selectedOT === ot.id ? 'text-purple-600' : 'text-slate-400'}`} />

                <div>
                  <span className="font-bold block">{ot.name}</span>
                  <span
                  className={`text-xs ${selectedOT === ot.id ? 'text-purple-600/80' : 'text-slate-400'}`}>

                    {ot.machineCount} machines assigned
                  </span>
                </div>
              </div>
              {selectedOT === ot.id &&
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            }
            </button>
          )}
        </motion.div>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

          {loading ?
          <span className="animate-pulse">Assigning...</span> :

          'Assign Machine'
          }
        </button>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
