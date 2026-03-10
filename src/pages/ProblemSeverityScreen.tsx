import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowRight } from
'lucide-react';
import { motion } from 'framer-motion';
export function ProblemSeverityScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [severity, setSeverity] = useState<string>('');
  const severityLevels = [
  {
    id: 'critical',
    label: 'Critical',
    description: 'Machine is unsafe and must not be used',
    icon: AlertCircle,
    color: 'rose',
    bgClass:
    'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50',
    selectedClass: 'border-rose-600 shadow-lg shadow-rose-600/20',
    iconClass: 'text-rose-600 dark:text-rose-400'
  },
  {
    id: 'high',
    label: 'High',
    description: 'Significant issues affecting functionality',
    icon: AlertTriangle,
    color: 'amber',
    bgClass:
    'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50',
    selectedClass: 'border-amber-600 shadow-lg shadow-amber-600/20',
    iconClass: 'text-amber-600 dark:text-amber-500'
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Minor issues that should be addressed soon',
    icon: Info,
    color: 'blue',
    bgClass:
    'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50',
    selectedClass: 'border-blue-600 shadow-lg shadow-blue-600/20',
    iconClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'low',
    label: 'Low',
    description: 'Cosmetic or non-urgent issues',
    icon: Info,
    color: 'slate',
    bgClass:
    'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    selectedClass: 'border-slate-600 shadow-lg shadow-slate-600/20',
    iconClass: 'text-slate-600 dark:text-slate-400'
  }];

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
            Problem Severity
          </h1>
        </header>

        <div className="space-y-4 mb-6">
          {severityLevels.map((level, index) => {
            const Icon = level.icon;
            return (
              <motion.button
                key={level.id}
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
                onClick={() => setSeverity(level.id)}
                className={`w-full rounded-2xl p-5 border-2 transition-all text-left ${level.bgClass} ${severity === level.id ? level.selectedClass : 'border-transparent'}`}>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${level.iconClass} bg-white dark:bg-slate-900 flex-shrink-0`}>

                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                      {level.label}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {level.description}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${severity === level.id ? `bg-${level.color}-600 border-${level.color}-600` : 'border-slate-300 dark:border-slate-600'}`}>

                    {severity === level.id &&
                    <div className="w-2 h-2 bg-white rounded-full" />
                    }
                  </div>
                </div>
              </motion.button>);

          })}
        </div>

        <button
          onClick={() => navigate(`/technician/remarks/${machineId}`)}
          disabled={!severity}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>);

}