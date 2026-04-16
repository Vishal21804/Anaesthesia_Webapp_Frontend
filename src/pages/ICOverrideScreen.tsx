import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
export function ICOverrideScreen() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const handleOverride = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/incharge/reviews');
    }, 1500);
  };
  return (
    <div
      className="min-h-[917px] bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Reject Submission
          </h1>
        </div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4 mb-6 flex gap-3">

          <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm">
              Action Required
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
              Rejecting a checklist requires a mandatory reason. This action
              will be logged in the audit trail.
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleOverride} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Reason for Rejection
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 dark:text-slate-100"
              required>

              <option value="">Select a reason...</option>
              <option value="incomplete">Incomplete Checklist</option>
              <option value="incorrect_data">Incorrect Data Entry</option>
              <option value="safety_concern">Safety Concern</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide specific details for the technician..."
              rows={5}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 dark:text-slate-100 resize-none"
              required />

          </div>

          <button
            type="submit"
            disabled={loading || !reason || !notes}
            className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">

            {loading ?
            <span className="animate-pulse">Submitting...</span> :

            <>
                <AlertTriangle className="w-5 h-5" />
                Confirm Rejection
              </>
            }
          </button>
        </form>
      </div>
    </div>);

}
