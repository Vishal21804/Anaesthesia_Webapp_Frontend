import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  FileText } from
'lucide-react';
import { motion } from 'framer-motion';
export function ICApproveRejectScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const handleApprove = () => {
    setLoading('approve');
    setTimeout(() => {
      navigate('/incharge/reviews');
    }, 1500);
  };
  const handleReject = () => {
    navigate('/incharge/override');
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
            Review Submission
          </h1>
        </div>

        {/* Machine Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-4">

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Drager Fabius GS
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                SN-2023-001
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wide">
              Pending
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" />
              OT-1
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4 text-slate-400" />
              Alex Taylor
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              10:30 AM
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <FileText className="w-4 h-4 text-slate-400" />
              12 Items
            </div>
          </div>
        </motion.div>

        {/* Checklist Summary */}
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
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">

          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
            Checklist Summary
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-900 dark:text-emerald-100">
                  Passed Items
                </span>
              </div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                11
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span className="font-medium text-rose-900 dark:text-rose-100">
                  Failed Items
                </span>
              </div>
              <span className="font-bold text-rose-700 dark:text-rose-400">
                1
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Technician Note
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  "O2 sensor calibration took longer than usual but eventually
                  passed. Please verify."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
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
              delay: 0.2
            }}
            onClick={handleReject}
            className="py-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold border-2 border-rose-100 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2">

            <XCircle className="w-5 h-5" />
            Reject
          </motion.button>

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
              delay: 0.2
            }}
            onClick={handleApprove}
            disabled={loading === 'approve'}
            className="py-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">

            {loading === 'approve' ?
            <span className="animate-pulse">Approving...</span> :

            <>
                <CheckCircle2 className="w-5 h-5" />
                Approve
              </>
            }
          </motion.button>
        </div>
      </div>
    </div>);

}
