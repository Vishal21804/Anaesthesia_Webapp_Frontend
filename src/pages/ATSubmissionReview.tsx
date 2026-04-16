import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  FileText } from
'lucide-react';
import { motion } from 'framer-motion';
import { mockMachines, mockOTs } from '../data/mockData';
export function ATSubmissionReview() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const machine =
  mockMachines.find((m) => m.id === machineId) || mockMachines[0];
  const ot = mockOTs.find((o) => o.id === machine.otId) || mockOTs[0];
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/technician/confirmation');
    }, 1500);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      <div className="max-w-md  px-6 pt-8 pb-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Review Submission
          </h1>
        </header>

        {/* Summary Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">

          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {machine.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {ot.name}
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-900/50">
              READY
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <div className="text-sm">
                <span className="block font-bold text-slate-700 dark:text-slate-300">
                  12 mins
                </span>
                <span className="text-xs text-slate-400">Duration</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="text-sm">
                <span className="block font-bold text-slate-700 dark:text-slate-300">
                  12/12
                </span>
                <span className="text-xs text-slate-400">Items Passed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Issues Section (Empty state for demo) */}
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
          className="mb-6">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Reported Issues
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400  mb-2 opacity-50" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No issues reported during this check.
            </p>
          </div>
        </motion.div>

        {/* Notes Section */}
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
            delay: 0.2
          }}
          className="mb-8">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Technician Notes
          </h3>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional observations..."
              rows={4}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-health-primary/20 focus:border-health-primary resize-none placeholder:text-slate-400" />

          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
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
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">

          {isSubmitting ?
          <span className="animate-pulse">Submitting...</span> :

          <>
              Submit for Approval <Send className="w-5 h-5" />
            </>
          }
        </motion.button>
      </div>
    </div>);

}