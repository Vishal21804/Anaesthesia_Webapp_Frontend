import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Activity, AlertCircle, Loader } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { MachineCard } from '../components/MachineCard';
import { getOtList } from '../services/ot';
import { getMachineList } from '../services/machine';
import { OT, Machine } from '../types';
import { motion } from 'framer-motion';

export function HMOTDetail() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const [ot, setOt] = useState<OT | null>(null);
  const [assignedMachines, setAssignedMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ots, machines] = await Promise.all([getOtList(), getMachineList()]);
        
        const currentOtId = parseInt(otId || '', 10);
        const currentOt = ots.find((o: OT) => o.id === currentOtId);
        
        if (currentOt) {
          setOt(currentOt);
          const machinesForOt = machines.filter((m: Machine) => m.assigned_ots.includes(currentOt.id));
          setAssignedMachines(machinesForOt);
        } else {
          setError('OT not found.');
        }

      } catch (err) {
        setError('Failed to fetch details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (otId) {
      fetchData();
    }
  }, [otId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="ml-2 text-slate-500">Loading OT Details...</p>
      </div>
    );
  }

  if (error || !ot) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-red-500">{error || 'Could not load OT details.'}</p>
        <button
            onClick={() => navigate('/management/ot-management')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
            Go Back
        </button>
      </div>
    );
  }

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
            onClick={() => navigate('/management/ot-management')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            OT Details
          </h1>
        </header>

        {/* OT Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {ot.ot_name}
                </h2>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{ot.location}</span>
                </div>
              </div>
            </div>
            {ot.issues_count > 0 ?
            <div className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900/50 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-500">
                <AlertCircle className="w-3 h-3" />
                {ot.issues_count} Issues
              </div> :
            <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                <Activity className="w-3 h-3" />
                Operational
              </div>
            }
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Machines
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {assignedMachines.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Department
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Surgery
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            Assigned Machines
          </h3>
          <button
            onClick={() => navigate(`/management/ot-assign-machine/${otId}`)}
            className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:text-purple-700 transition-colors">
            <Plus className="w-4 h-4" />
            Assign Machine
          </button>
        </div>

        <div className="space-y-4">
          {assignedMachines.length > 0 ?
          assignedMachines.map((machine, index) =>
          <motion.div
            key={machine.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}>
                <MachineCard
                  machine={machine}
                  onClick={() => navigate(`/hm/machine/${machine.id}`)}
                  showStatus={true}
                  role="management"
                />
              </motion.div>
          ) :
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No machines assigned to this OT yet.
              </p>
            </div>
          }
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);
}