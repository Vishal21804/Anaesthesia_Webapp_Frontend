import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { getMachineDetails, inspectMachine } from '../services/machine';
import { getChecklistMachines } from '../services/checklist';

type StatusSelection = 'Working' | 'Not Working' | null;

export function MachineDetail() {
  const navigate = useNavigate();
  const { otId, machineId } = useParams();
  const [machineData, setMachineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<StatusSelection>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState<string | null>(null);

  const [position, setPosition] = useState({ current: 0, total: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchMachine = async () => {
      if (!machineId) return;
      try {
        setLoading(true);
        const data = await getMachineDetails(Number(machineId), user.id);
        setMachineData(data.data || data);

        // Fetch checklist machines to determine progress and next machine
        if (otId) {
          const checklistData = await getChecklistMachines(user.id, Number(otId));
          const machines = [
            ...(checklistData.pending || []),
            ...(checklistData.completed || [])
          ];
          const totalInOt = machines.length;

          // Find progress count
          const completedCount = checklistData.completed?.length || 0;

          setPosition({ current: completedCount, total: totalInOt });
        }
      } catch (err) {
        console.error("Failed to fetch machine", err);
        setError("Failed to load machine details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [machineId, otId, user.id]);

  const handleSubmitStatus = async () => {
    if (selectedStatus !== 'Working' || !machineData) return;

    try {
      setIsSubmitted(true);
      await inspectMachine({
        machine_id: machineData.id,
        user_id: user.id,
        status: 'Working',
        remarks: "", // Must be empty
        priority: undefined
      });

      setToast({ visible: true, message: 'Status updated successfully' });

      setTimeout(() => {
        navigate(`/technician/machines/${otId}`);
      }, 1500);

    } catch (err) {
      setIsSubmitted(false);
      setToast({ visible: true, message: 'Failed to submit status' });
      setTimeout(() => setToast({ visible: false, message: '' }), 1500);
    }
  };

  const handleNotWorkingSubmit = async () => {
    if (!remarks.trim() || !priority || !machineData) return;

    try {
      setIsSubmitted(true);
      await inspectMachine({
        machine_id: machineData.id,
        user_id: user.id,
        status: 'Not Working',
        remarks,
        priority: priority.toLowerCase()
      });

      setToast({ visible: true, message: 'Issue reported successfully' });
      setIsModalOpen(false);

      setTimeout(() => {
        navigate(`/technician/machines/${otId}`);
      }, 1500);

    } catch (err) {
      setIsSubmitted(false);
      setToast({ visible: true, message: 'Failed to report issue' });
      setTimeout(() => setToast({ visible: false, message: '' }), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-8 h-8 text-health-primary animate-spin" />
        <p className="ml-2 text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !machineData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950 px-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{error || 'Machine not found.'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-health-primary text-white rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  // Use effective OT Name
  const effectiveOtName = otId ? `OT-${otId}` : "OT";

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md lg:max-w-6xl  px-6 lg:px-8 pt-8">

        {/* 1. Header */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Machine Details
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {position.current} / {position.total} Checked
            </p>
          </div>

        </header>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* 2. Machine Information Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 lg:mb-0 transition-colors lg:self-start">

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {machineData.machine_name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Anesthesia Workstation • {effectiveOtName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 py-6 border-t border-slate-50 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Serial Number
                </p>
                <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                  {machineData.serial_number || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Last Checked
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {machineData.last_checked
                    ? new Date(machineData.last_checked).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    : 'Never checked'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {effectiveOtName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Next Maintenance
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  2024-06-15
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. Machine Status Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors lg:self-start">

            <div className="mb-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Machine Status
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedStatus('Working')}
                disabled={isSubmitted}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${selectedStatus === 'Working' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'} ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                      Working
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Machine passed inspection
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isSubmitted}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${selectedStatus === 'Not Working' ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'} ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-rose-100 text-rose-600`}>
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                      Not Working
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fault recorded, do not use
                    </p>
                  </div>
                </div>
              </button>

              {/* 4. Submit Status Button */}
              <button
                onClick={handleSubmitStatus}
                disabled={!selectedStatus || isSubmitted}
                className={`w-full font-bold py-4 rounded-xl transition-all mt-4 ${selectedStatus && !isSubmitted ? 'bg-health-primary text-white shadow-lg focus:ring-2 focus:ring-teal-500 hover:bg-teal-600 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
                {isSubmitted ? 'Status Submitted' : 'Submit Status'}
              </button>

              <div className="flex mt-2">
                <button
                  onClick={() => navigate(`/technician/machines/${otId}`)}
                  className="w-full font-bold py-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 shadow-sm transition-all">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Machines
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNavigation role="technician" />

      {/* Bottom Sheet Modal for Not Working */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/35 z-40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-2xl mx-4 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.2)] z-50"
              >
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Report Issue
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Please provide details about the problem.
                </p>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Remarks *
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-100 h-[100px] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] resize-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Priority *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Critical', 'High', 'Moderate', 'Low'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`p-2.5 rounded-xl border transition-all active:scale-[0.98] text-center ${priority === p ? 'border-2 border-[#ff6a00] text-[#ff6a00] font-semibold bg-orange-50 dark:bg-orange-900/10' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:border-slate-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNotWorkingSubmit}
                  disabled={!remarks.trim() || !priority || isSubmitted}
                  className={`w-full font-semibold py-3.5 rounded-xl transition-all ${remarks.trim() && priority && !isSubmitted ? 'bg-[#16a085] text-white shadow-md hover:bg-[#12876f] active:scale-[0.98]' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-none'}`}
                >
                  {isSubmitted ? <Loader className="w-6 h-6  animate-spin" /> : 'Submit Issue'}
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-6 right-6 z-50 max-w-[364px] ">
            <div className="px-4 py-3 rounded-xl bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-white/90">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
