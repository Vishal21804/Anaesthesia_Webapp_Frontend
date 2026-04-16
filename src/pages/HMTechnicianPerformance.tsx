import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle2
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMTechnicianPerformance() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week');
  const technicians = [
    {
      id: 't1',
      name: 'Alex Taylor',
      role: 'AT',
      checklists: 45,
      avgTime: '8m',
      issues: 3,
      score: 98,
      rank: 1,
      color: 'emerald'
    },
    {
      id: 't2',
      name: 'Sarah Smith',
      role: 'AT',
      checklists: 42,
      avgTime: '12m',
      issues: 1,
      score: 95,
      rank: 2,
      color: 'blue'
    },
    {
      id: 't3',
      name: 'Mike Johnson',
      role: 'AT',
      checklists: 38,
      avgTime: '9m',
      issues: 5,
      score: 92,
      rank: 3,
      color: 'purple'
    },
    {
      id: 't4',
      name: 'Maria Garcia',
      role: 'AT',
      checklists: 35,
      avgTime: '15m',
      issues: 2,
      score: 88,
      rank: 4,
      color: 'slate'
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
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Staff Performance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Productivity & quality metrics
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['Today', 'Week', 'Month'].map((p) =>
            <button
              key={p}
              onClick={() => setPeriod(p.toLowerCase())}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${period === p.toLowerCase() ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>

              {p}
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Top Performer Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white mb-8 shadow-lg shadow-purple-500/30 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-1">
                Top Performer
              </div>
              <div className="text-xl font-bold">Alex Taylor</div>
              <div className="text-sm text-purple-100">
                98% Efficiency Score
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Leaderboard
        </h2>
        <div className="space-y-3">
          {technicians.map((tech, index) =>
            <motion.div
              key={tech.id}
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
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-slate-100 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>

                {tech.rank}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">
                    {tech.name}
                  </h3>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {tech.score} pts
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {tech.checklists}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tech.avgTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {tech.issues}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
