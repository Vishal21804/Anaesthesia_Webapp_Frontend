import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockIssues } from '../data/mockData';
export function BMETCloseIssueConfirmation() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const issue = mockIssues.find((i) => i.id === issueId) || mockIssues[0];
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    if (!confirmed) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/bmet/dashboard');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
      <div className="max-w-md  w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          style={{
            top: 'calc(var(--safe-area-top) + 1.5rem)'
          }}>

          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="text-center mb-8">

          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center  mb-6 shadow-lg shadow-emerald-200/50 dark:shadow-none">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Close Issue?
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            This will mark the issue as fully resolved.
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
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-8">

          <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Issue
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-100">
              {issue.type}: {issue.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Resolution
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-100">
              Repaired and verified
            </p>
          </div>
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
            delay: 0.2
          }}
          className="space-y-6">

          <label className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>

              {confirmed && <Check className="w-4 h-4" />}
            </div>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="hidden" />

            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              I confirm this issue is fully resolved
            </span>
          </label>

          <button
            onClick={handleClose}
            disabled={!confirmed || loading}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

            {loading ?
            <span className="animate-pulse">Closing Issue...</span> :

            'Close Issue'
            }
          </button>
        </motion.div>
      </div>
    </div>);

}
