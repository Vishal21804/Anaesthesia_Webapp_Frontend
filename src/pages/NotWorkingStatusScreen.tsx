import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { XCircle, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
export function NotWorkingStatusScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
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
        className="w-24 h-24 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">

        <XCircle className="w-12 h-12" />
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

        Machine Not Operational
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

        Critical issues detected - machine is unsafe for use
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
        className="text-sm text-rose-600 dark:text-rose-400 font-bold mb-8">

        DO NOT USE THIS MACHINE
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
        className="w-full max-w-sm">

        <button
          onClick={() =>
          navigate(`/technician/predefined-problems/${machineId}`)
          }
          className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95">

          <FileText className="w-5 h-5" />
          Report Critical Issues
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
        className="mt-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl p-4 max-w-sm">

        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">
              Immediate Action Required
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tag this machine as "Out of Service" and notify the BMET team
              immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>);

}
