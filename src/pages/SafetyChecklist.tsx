import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChecklistMachines } from '../services/checklist';
import { inspectMachine } from '../services/machine';
import { Machine } from '../types';
import { MachineCard } from '../components/MachineCard';

export function SafetyChecklist() {
  const navigate = useNavigate();
  const { otId, machineId } = useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [nextMachine, setNextMachine] = useState<Machine | null>(null);
  const [position, setPosition] = useState({ current: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || !machineId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const checklistData = await getChecklistMachines(user.id, Number(otId));

        const machines = [
          ...(checklistData.pending || []),
          ...(checklistData.completed || [])
        ];

        const currentMachine = machines.find((m: Machine) => m.id === Number(machineId));

        if (!currentMachine) {
          setError("Machine not found.");
          return;
        }

        setMachine(currentMachine);

        // Derive otId if not in params
        const effectiveOtId = otId ? Number(otId) : currentMachine.assigned_ots?.[0];

        if (effectiveOtId) {
          const checklistData = await getChecklistMachines(user.id, Number(effectiveOtId));
          const pendingMachines = checklistData.pending || [];

          const currentIndex = pendingMachines.findIndex((m: any) => m.id === Number(machineId));
          setNextMachine(pendingMachines[currentIndex + 1] || null);

          const totalInOt = machines.filter((m: any) => m.assigned_ots?.includes(Number(effectiveOtId))).length;
          const currentPos = machines.filter((m: any) => m.assigned_ots?.includes(Number(effectiveOtId))).findIndex((m: any) => m.id === Number(machineId)) + 1;
          setPosition({ current: currentPos || 0, total: totalInOt || 0 });

          // Store effectiveOtId if we need it for navigation back
          sessionStorage.setItem('current_ot_id', effectiveOtId.toString());
        } else {
          setPosition({ current: 0, total: 0 });
        }

      } catch (err) {
        console.error("Checklist fetch failed", err);
        setError("Failed to load checklist data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, machineId, otId]);

  const [isIssueSheetOpen, setIsIssueSheetOpen] = useState(false);
  const [issueType, setIssueType] = useState('Power Failure');
  const [issueRemark, setIssueRemark] = useState('');
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const issueTypes = [
    'Power Failure',
    'Gas Supply Issue',
    'Sensor Fault',
    'Leakage',
    'Alarm Failure',
    'Other'
  ];

  const handleNavigation = () => {
    const currentOtId = otId || sessionStorage.getItem('current_ot_id');
    if (nextMachine) {
      navigate(`/technician/inspect/${otId}/${nextMachine.id}`);
    } else if (currentOtId) {
      navigate(`/technician/checklist/${currentOtId}`);
    } else {
      navigate('/technician-dashboard');
    }
  };

  const handleWorking = async () => {
    if (!machine || !user) return;
    try {
      await inspectMachine({ machine_id: machine.id, user_id: user.id, status: 'Working' });
      setToast({ visible: true, message: 'Machine marked as WORKING.', type: 'success' });
      setTimeout(() => handleNavigation(), 800);
    } catch (err) {
      setToast({ visible: true, message: 'Failed to update status.', type: 'error' });
    }
  };

  const handleNotWorking = () => {
    setIsIssueSheetOpen(true);
  };

  const handleSubmitIssue = async () => {
    if (!machine || !user) return;
    try {
      await inspectMachine({
        machine_id: machine.id,
        user_id: user.id,
        status: 'Not Working',
        remarks: `${issueType}: ${issueRemark}`,
        priority: 'high'
      });
      setIsIssueSheetOpen(false);
      setToast({ visible: true, message: 'Issue reported successfully.', type: 'error' });
      setTimeout(() => handleNavigation(), 1500);
    } catch (err) {
      setToast({ visible: true, message: 'Failed to report issue.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-8 h-8 text-health-primary animate-spin" />
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950 px-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{error || 'Machine not found'}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-health-primary text-white rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors relative overflow-hidden"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)'
      }}>

      {/* Header */}
      <div className="px-5 pt-6 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Machine Status
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {position.current} of {position.total} Machines
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col h-[calc(100vh-140px)] max-w-md ">
        {/* Machine Summary Card */}
        <div className="mb-8">
          <MachineCard
            machine={machine}
            onClick={() => { }}
          />
        </div>

        {/* Primary Action Area */}
        <div className="flex-1 flex flex-col gap-4 justify-center pb-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleWorking}
            className="flex-1 min-h-[120px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30 flex flex-col items-center justify-center gap-3 transition-colors group">
            <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-wide">WORKING</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNotWorking}
            className="flex-1 min-h-[120px] bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/30 flex flex-col items-center justify-center gap-3 transition-colors group">
            <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
              <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-wide">NOT WORKING</span>
          </motion.button>
        </div>
      </div>

      {/* Issue Report Bottom Sheet */}
      <AnimatePresence>
        {isIssueSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIssueSheetOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 p-6 shadow-xl max-w-md  border-t border-slate-100 dark:border-slate-800">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full  mb-6" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                Report Machine Issue
              </h2>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Problem Type</label>
                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 appearance-none">
                      {issueTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Short Remark (Optional)</label>
                  <input
                    type="text"
                    value={issueRemark}
                    onChange={(e) => setIssueRemark(e.target.value)}
                    placeholder="E.g., Screen not turning on"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmitIssue}
                className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95 text-lg">
                Submit Issue
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-6 right-6 z-50 max-w-[364px] ">
            <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}>
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-bold text-sm leading-tight">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
