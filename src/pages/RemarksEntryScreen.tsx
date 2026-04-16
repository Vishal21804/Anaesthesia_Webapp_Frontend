import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
export function RemarksEntryScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [remarks, setRemarks] = useState('');
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Additional Remarks
          </h1>
        </header>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">

          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            Notes & Observations (Optional)
          </label>
          <textarea
            rows={8}
            placeholder="Add any additional context, observations, or recommendations that might help the BMET team..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none focus:border-health-primary focus:ring-1 focus:ring-health-primary resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

          <p className="text-xs text-slate-400 mt-2">
            {remarks.length} characters
          </p>
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
          className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4 mb-6">

          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold">Helpful information:</span> Error codes,
            time of occurrence, frequency, environmental conditions, or any
            patterns you've noticed.
          </p>
        </motion.div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/technician/report-review/${machineId}`)}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

            Review Report <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate(`/technician/report-review/${machineId}`)}
            className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">

            Skip
          </button>
        </div>
      </div>
    </div>);

}
