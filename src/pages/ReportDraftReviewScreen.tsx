import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Edit,
  AlertCircle,
  Calendar,
  User } from
'lucide-react';
import { motion } from 'framer-motion';
export function ReportDraftReviewScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [loading, setLoading] = useState(false);
  const reportData = {
    machine: 'Drager Fabius GS',
    serialNumber: 'SN-2023-001',
    location: 'OT-1',
    problems: ['Gas Leak Detected', 'Alarm System Malfunction'],
    severity: 'Critical',
    remarks:
    'Detected gas leak during routine check. Alarm system failed to trigger. Machine tagged as out of service.',
    technician: 'Alex Taylor',
    date: new Date().toLocaleDateString()
  };
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/technician/confirmation');
    }, 1500);
  };
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
            Review Report
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
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {reportData.machine}
            </h2>
            <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-lg">
              {reportData.severity}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Serial Number
              </p>
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {reportData.serialNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Location
              </p>
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {reportData.location}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Problems Reported
              </p>
              <div className="space-y-2">
                {reportData.problems.map((problem, index) =>
                <div key={index} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      {problem}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {reportData.remarks &&
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Remarks
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  {reportData.remarks}
                </p>
              </div>
            }
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <User className="w-4 h-4" />
              <span>{reportData.technician}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{reportData.date}</span>
            </div>
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
            delay: 0.1
          }}
          className="space-y-3">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
            <span className="animate-pulse">Submitting...</span> :

            <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            }
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">

            <Edit className="w-5 h-5" />
            Edit Report
          </button>
        </motion.div>
      </div>
    </div>);

}