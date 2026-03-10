import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wrench, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function RepairInProgressScreen() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const steps = [
  {
    label: 'Diagnosis Complete',
    completed: true
  },
  {
    label: 'Parts Ordered',
    completed: true
  },
  {
    label: 'Repair in Progress',
    completed: false,
    current: true
  },
  {
    label: 'Testing',
    completed: false
  },
  {
    label: 'Final Inspection',
    completed: false
  }];

  const progress =
  steps.filter((s) => s.completed).length / steps.length * 100;
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Repair Progress
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
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 animate-pulse">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Drager Fabius GS
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Issue #{issueId}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Overall Progress
              </span>
              <span className="text-health-primary font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{
                  width: 0
                }}
                animate={{
                  width: `${progress}%`
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut'
                }}
                className="h-full bg-gradient-to-r from-health-primary to-teal-400 rounded-full" />

            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) =>
            <motion.div
              key={index}
              initial={{
                x: -20,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              transition={{
                delay: index * 0.1
              }}
              className="flex items-center gap-3">

                <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-emerald-500 text-white' : step.current ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-2 border-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>

                  {step.completed ?
                <CheckCircle className="w-5 h-5" strokeWidth={3} /> :
                step.current ?
                <Clock className="w-4 h-4" /> :

                <div className="w-2 h-2 bg-slate-400 rounded-full" />
                }
                </div>
                <span
                className={`text-sm font-bold ${step.completed ? 'text-emerald-600 dark:text-emerald-400' : step.current ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>

                  {step.label}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <button
          onClick={() => navigate(`/bmet/parts-log/${issueId}`)}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95">

          Log Parts & Actions
        </button>
      </div>
    </div>);

}