import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
export function PredefinedProblemListScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const problems = [
  {
    id: 'leak',
    label: 'Gas Leak Detected',
    category: 'Critical'
  },
  {
    id: 'pressure',
    label: 'Pressure Irregularity',
    category: 'Critical'
  },
  {
    id: 'alarm',
    label: 'Alarm System Malfunction',
    category: 'High'
  },
  {
    id: 'display',
    label: 'Display Issues',
    category: 'Medium'
  },
  {
    id: 'sensor',
    label: 'Sensor Calibration Needed',
    category: 'Medium'
  },
  {
    id: 'battery',
    label: 'Battery Low/Not Charging',
    category: 'Medium'
  },
  {
    id: 'noise',
    label: 'Unusual Noise',
    category: 'Low'
  },
  {
    id: 'cosmetic',
    label: 'Cosmetic Damage',
    category: 'Low'
  }];

  const toggleProblem = (id: string) => {
    setSelectedProblems((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
  const categoryColors = {
    Critical: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
    High: 'text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30',
    Medium: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    Low: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Select Problems
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedProblems.length} selected
            </p>
          </div>
        </header>

        <div className="space-y-3 mb-6">
          {problems.map((problem, index) =>
          <motion.button
            key={problem.id}
            initial={{
              x: -20,
              opacity: 0
            }}
            animate={{
              x: 0,
              opacity: 1
            }}
            transition={{
              delay: index * 0.05
            }}
            onClick={() => toggleProblem(problem.id)}
            className={`w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 transition-all text-left ${selectedProblems.includes(problem.id) ? 'border-health-primary shadow-md' : 'border-slate-100 dark:border-slate-700'}`}>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {problem.label}
                  </h3>
                  <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${categoryColors[problem.category as keyof typeof categoryColors]}`}>

                    {problem.category}
                  </span>
                </div>
                <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedProblems.includes(problem.id) ? 'bg-health-primary border-health-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>

                  {selectedProblems.includes(problem.id) &&
                <CheckCircle className="w-4 h-4" strokeWidth={3} />
                }
                </div>
              </div>
            </motion.button>
          )}
        </div>

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
            delay: 0.4
          }}
          onClick={() => navigate(`/technician/custom-problem/${machineId}`)}
          className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all mb-6">

          <Plus className="w-5 h-5" />
          Add Custom Problem
        </motion.button>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20 transition-colors">
          <div className="max-w-md mx-auto">
            <button
              onClick={() =>
              navigate(`/technician/problem-severity/${machineId}`)
              }
              disabled={selectedProblems.length === 0}
              className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

              Continue ({selectedProblems.length})
            </button>
          </div>
        </div>
      </div>
    </div>);

}