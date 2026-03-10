import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Home, ClipboardCheck, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { inspectMachine } from '../services/machine';

export function WorkingStatusScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logStatus = async () => {
      if (!machineId) {
        setError("Machine ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        await inspectMachine({ machine_id: parseInt(machineId), status: 'Working' });
      } catch (err) {
        setError('Failed to log machine status. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    logStatus();
  }, [machineId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader className="w-12 h-12 text-health-primary animate-spin" />
        <p className="mt-4 text-slate-500">Logging status...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
                <AlertCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                Submission Failed
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
                {error}
            </p>
            <button
                onClick={() => navigate(-1)}
                className="w-full max-w-sm bg-health-primary text-white font-bold py-4 rounded-xl">
                Go Back
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <motion.div
        initial={{
          scale: 0,
          rotate: -180
        }}
        animate={{
          scale: 1,
          rotate: 0
        }}
        transition={{
          type: 'spring',
          duration: 0.8
        }}
        className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">

        <CheckCircle className="w-12 h-12" />
      </motion.div>

      <motion.h1
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.2
        }}
        className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">

        Machine Operational
      </motion.h1>

      <motion.p
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.3
        }}
        className="text-slate-600 dark:text-slate-300 mb-2 max-w-sm">

        All safety checks passed successfully
      </motion.p>

      <motion.p
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.4
        }}
        className="text-sm text-slate-500 dark:text-slate-400 mb-8">

        Machine is safe for operation
      </motion.p>

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
          delay: 0.5
        }}
        className="w-full max-w-sm space-y-3">

        <button
          onClick={() => navigate('/technician/dashboard')}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

          <Home className="w-5 h-5" />
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate('/technician/ot-selection')}
          className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">

          <ClipboardCheck className="w-5 h-5" />
          Check Another Machine
        </button>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.6
        }}
        className="mt-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 max-w-sm">

        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            Status logged:
          </span>{' '}
          This machine has been marked as operational in the system.
        </p>
      </motion.div>
    </div>);
}