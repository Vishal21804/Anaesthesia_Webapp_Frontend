import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Camera, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockIssues } from '../data/mockData';
export function BMETAddRepairNotes() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const issue = mockIssues.find((i) => i.id === issueId) || mockIssues[0];
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSave = () => {
    if (!notes) return;
    setLoading(true);
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      <div className="max-w-md  px-6 pt-8 pb-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Add Repair Notes
            </h1>
            <p className="text-xs font-mono text-slate-400">{issueId}</p>
          </div>
        </header>

        {/* Issue Reference */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/50 mb-6">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {issue.machineName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {issue.description}
              </p>
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
          className="space-y-6">

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
              Detailed Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              placeholder="Enter detailed technical notes, observations, or specific repair steps taken..."
              className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none shadow-sm"
              autoFocus />

          </div>

          <button
            type="button"
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

            <Camera className="w-5 h-5" />
            Attach Photo
          </button>

          <button
            onClick={handleSave}
            disabled={!notes || loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">

            {loading ?
            <span className="animate-pulse">Saving...</span> :

            <>
                Save Notes <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.div>
      </div>
    </div>);

}
