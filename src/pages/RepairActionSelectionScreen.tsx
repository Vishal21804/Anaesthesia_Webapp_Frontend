import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  Settings,
  Zap,
  Package,
  ArrowRight } from
'lucide-react';
import { motion } from 'framer-motion';
export function RepairActionSelectionScreen() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const [selectedAction, setSelectedAction] = useState('');
  const actions = [
  {
    id: 'repair',
    icon: Wrench,
    title: 'Repair',
    description: 'Fix the existing component',
    color: 'blue'
  },
  {
    id: 'replace',
    icon: Package,
    title: 'Replace Part',
    description: 'Install new component',
    color: 'purple'
  },
  {
    id: 'calibrate',
    icon: Settings,
    title: 'Calibrate',
    description: 'Adjust settings and parameters',
    color: 'emerald'
  },
  {
    id: 'upgrade',
    icon: Zap,
    title: 'Upgrade',
    description: 'Install software/firmware update',
    color: 'amber'
  }];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    purple:
    'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    emerald:
    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber:
    'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/50'
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
            Select Action
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{
                  y: 20,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.1
                }}
                onClick={() => setSelectedAction(action.id)}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 transition-all text-left ${selectedAction === action.id ? 'border-health-primary shadow-lg' : 'border-slate-100 dark:border-slate-700'}`}>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorClasses[action.color as keyof typeof colorClasses]}`}>

                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>);

          })}
        </div>

        <button
          onClick={() => navigate(`/bmet/repair-progress/${issueId}`)}
          disabled={!selectedAction}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>);

}
