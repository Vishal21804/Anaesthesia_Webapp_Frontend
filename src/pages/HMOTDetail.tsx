import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Activity, AlertCircle, Loader } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { MachineCard } from '../components/MachineCard';
import { getOTDetails } from '../services/ot';
import { getOTMachines } from '../services/machine';
import { OT, Machine } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { updateMachine } from '../services/machine';

export function HMOTDetail() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const [ot, setOt] = useState<OT | null>(null);
  const [assignedMachines, setAssignedMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [newSerial, setNewSerial] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const id = Number(otId);

        const [detailRes, machinesRes] = await Promise.all([
          getOTDetails(id, user.id),
          getOTMachines(id, user.id)
        ]);

        if (detailRes.status) {
          setOt(detailRes.data);
          setAssignedMachines(machinesRes.data || []);
        } else {
          setError(detailRes.message || 'OT not found.');
        }

      } catch (err: any) {
        console.error("Fetch error:", err.response || err);
        setError('Failed to fetch details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (otId) {
      fetchData();
    }
  }, [otId]);

  const handleUpdateSerial = async () => {
    if (!editingMachine) return;
    if (!newSerial.trim()) {
      toast.error('Serial number cannot be empty');
      return;
    }

    try {
      setIsUpdating(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await updateMachine(editingMachine.id, {
        serial_number: newSerial.trim()
      }, user.id);

      if (response.status) {
        toast.success(response.message || 'Serial number updated');
        // Update local state
        setAssignedMachines(prev => prev.map(m =>
          m.id === editingMachine.id ? { ...m, serial_number: newSerial.trim() } : m
        ));
        setEditingMachine(null);
      } else {
        toast.error(response.message || 'Failed to update serial number');
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950 text-left">
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
          onClick={() => navigate('/management/ot')}
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

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/ot')}
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
                  onClick={() => {
                    setEditingMachine(machine);
                    setNewSerial(machine.serial_number || '');
                  }}
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

      {/* Update Serial Modal */}
      <AnimatePresence>
        {editingMachine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMachine(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-left">
                Update Serial Number
              </h3>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider text-left">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Enter serial number"
                  autoFocus
                />
              </div>

              <button
                onClick={handleUpdateSerial}
                disabled={isUpdating}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 rounded-2xl font-bold text-white shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Update Serial'
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>);
}
