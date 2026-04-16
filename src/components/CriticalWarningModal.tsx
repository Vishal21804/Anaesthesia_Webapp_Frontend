import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface CriticalWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onReport: () => void;
  issueDescription?: string;
}
export function CriticalWarningModal({
  isOpen,
  onClose,
  onContinue,
  onReport,
  issueDescription = 'A critical issue has been detected that may affect patient safety.'
}: CriticalWarningModalProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Red-tinted Backdrop */}
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
          className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm z-50" />


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

            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl pointer-events-auto overflow-hidden border-2 border-rose-100 dark:border-rose-900/50">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center  mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Critical Issue Detected
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                  {issueDescription}
                </p>

                <div className="space-y-3">
                  <button
                  onClick={onReport}
                  className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">

                    <AlertTriangle className="w-4 h-4" />
                    Stop & Report Issue
                  </button>

                  <button
                  onClick={onContinue}
                  className="w-full py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

                    Continue Anyway
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}