import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingDown, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMMachineFailureTrends() {
  const navigate = useNavigate();
  const failureCategories = [
    {
      label: 'Mechanical',
      count: 15,
      percentage: 45,
      color: 'bg-rose-500'
    },
    {
      label: 'Electrical',
      count: 8,
      percentage: 25,
      color: 'bg-amber-500'
    },
    {
      label: 'Software',
      count: 6,
      percentage: 18,
      color: 'bg-blue-500'
    },
    {
      label: 'Calibration',
      count: 4,
      percentage: 12,
      color: 'bg-purple-500'
    }];

  const problematicMachines = [
    {
      id: 'm1',
      name: 'Drager Fabius GS',
      location: 'OT-1',
      failures: 4,
      lastFailure: '2 days ago',
      status: 'Critical'
    },
    {
      id: 'm2',
      name: 'GE Datex-Ohmeda',
      location: 'OT-3',
      failures: 3,
      lastFailure: '5 days ago',
      status: 'High'
    },
    {
      id: 'm3',
      name: 'Maquet Flow-i',
      location: 'ICU',
      failures: 3,
      lastFailure: '1 week ago',
      status: 'High'
    }];

  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Failure Trends
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Equipment reliability analysis
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Summary Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 mb-8">

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                33
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total Failures (30d)
              </div>
            </div>
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <TrendingDown className="w-4 h-4" />
            <span>12% decrease from last month</span>
          </div>
        </motion.div>

        {/* Failure Categories */}
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Failures by Category
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 mb-8 space-y-4">
          {failureCategories.map((cat, index) =>
            <motion.div
              key={cat.label}
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
              }}>

              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {cat.label}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {cat.count} ({cat.percentage}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{
                    width: 0
                  }}
                  animate={{
                    width: `${cat.percentage}%`
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + index * 0.1
                  }}
                  className={`h-full rounded-full ${cat.color}`} />

              </div>
            </motion.div>
          )}
        </div>

        {/* Problematic Machines */}
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Most Problematic Machines
        </h2>
        <div className="space-y-3">
          {problematicMachines.map((machine, index) =>
            <motion.div
              key={machine.id}
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.4 + index * 0.1
              }}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4">

              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                  {machine.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {machine.location} • Last: {machine.lastFailure}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  {machine.failures}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Failures
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
