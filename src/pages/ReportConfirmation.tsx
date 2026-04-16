import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
export function ReportConfirmation() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-health-bg flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">

        <CheckCircle className="w-10 h-10" />
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
          delay: 0.1
        }}
        className="text-2xl font-bold text-slate-800 mb-2">

        Problem Reported
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
          delay: 0.2
        }}
        className="text-slate-500 mb-8 max-w-xs ">

        Issue ID #ISS-042 has been created and the BMET team has been notified.
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
          delay: 0.3
        }}
        className="space-y-3 w-full max-w-xs">

        <button
          onClick={() => navigate('/technician/dashboard')}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

          <Home className="w-5 h-5" />
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate('/technician/ot-selection')}
          className="w-full bg-white text-slate-600 font-bold py-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95">

          Check Another Machine
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>);

}