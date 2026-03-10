import React, { useState } from 'react';
import { X, AlertTriangle, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: {
    type: string;
    severity: 'critical' | 'minor';
    description: string;
  }) => void;
  machineId: string;
}
export function AddIssueModal({
  isOpen,
  onClose,
  onSubmit,
  machineId
}: AddIssueModalProps) {
  const [type, setType] = useState('Mechanical');
  const [severity, setSeverity] = useState<'critical' | 'minor'>('minor');
  const [description, setDescription] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      severity,
      description
    });
    // Reset form
    setType('Mechanical');
    setSeverity('minor');
    setDescription('');
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />


          {/* Modal */}
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                  Report Issue
                </h3>
                <button
                onClick={onClose}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Issue Type
                    </label>
                    <div className="relative">
                      <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-health-primary/20 focus:border-health-primary appearance-none">

                        <option value="Mechanical">Mechanical Failure</option>
                        <option value="Electrical">Electrical Issue</option>
                        <option value="Software">Software Error</option>
                        <option value="Calibration">Calibration Needed</option>
                        <option value="Other">Other Issue</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">

                          <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7" />

                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Severity
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                      type="button"
                      onClick={() => setSeverity('minor')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${severity === 'minor' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>

                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-bold">Minor</span>
                      </button>
                      <button
                      type="button"
                      onClick={() => setSeverity('critical')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${severity === 'critical' ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>

                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-xs font-bold">Critical</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Description
                    </label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-health-primary/20 focus:border-health-primary resize-none placeholder:text-slate-400"
                    required />

                  </div>

                  <button
                  type="button"
                  className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

                    <Camera className="w-4 h-4" />
                    Add Photo (Optional)
                  </button>

                  <div className="pt-2 flex gap-3">
                    <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">

                      Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={!description}
                    className="flex-1 py-3 bg-health-primary text-white font-bold rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}