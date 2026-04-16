import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMIssueAnalytics() {
  const navigate = useNavigate();
  const summaryStats = [
    {
      label: 'Total Issues',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: AlertCircle,
      color: 'blue'
    },
    {
      label: 'Open Issues',
      value: '8',
      change: '-5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      label: 'Avg Resolution',
      value: '4.2h',
      change: '-1.5h',
      trend: 'down',
      icon: Clock,
      color: 'emerald'
    },
    {
      label: 'Critical',
      value: '2',
      change: '0%',
      trend: 'neutral',
      icon: AlertCircle,
      color: 'rose'
    }];

  const issuesByType = [
    {
      type: 'Mechanical',
      count: 12,
      color: 'bg-blue-500'
    },
    {
      type: 'Software',
      count: 8,
      color: 'bg-purple-500'
    },
    {
      type: 'Electrical',
      count: 5,
      color: 'bg-amber-500'
    },
    {
      type: 'Calibration',
      count: 3,
      color: 'bg-emerald-500'
    }];

  const issuesByOT = [
    {
      name: 'OT-1',
      count: 8,
      total: 15
    },
    {
      name: 'OT-2',
      count: 4,
      total: 15
    },
    {
      name: 'OT-3',
      count: 6,
      total: 15
    },
    {
      name: 'ICU',
      count: 12,
      total: 20
    }];

  const maxTypeCount = Math.max(...issuesByType.map((i) => i.count));
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
              Issue Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Performance & trends overview
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{
                  y: 20,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.05
                }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${stat.color === 'rose' ? 'text-rose-500' : stat.color === 'emerald' ? 'text-emerald-500' : stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'}`} />

                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {stat.value}
                </div>
                <div
                  className={`text-xs font-bold ${stat.trend === 'up' && stat.color !== 'rose' ? 'text-emerald-600' : stat.trend === 'down' && stat.color === 'rose' ? 'text-emerald-600' : 'text-slate-500'}`}>

                  {stat.change} from last month
                </div>
              </motion.div>);

          })}
        </div>

        {/* Issues by Type Chart */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Issues by Category
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-4 h-40">
              {issuesByType.map((item, index) =>
                <div
                  key={item.type}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end">

                  <motion.div
                    initial={{
                      height: 0
                    }}
                    animate={{
                      height: `${item.count / maxTypeCount * 100}%`
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1
                    }}
                    className={`w-full rounded-t-lg ${item.color} opacity-90`} />

                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center leading-tight">
                    {item.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Issues by OT */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Problem Areas
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            {issuesByOT.map((ot, index) =>
              <div key={ot.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {ot.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {ot.count} issues
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${ot.count / ot.total * 100}%`
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.1
                    }}
                    className="h-full bg-rose-500 rounded-full" />

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}