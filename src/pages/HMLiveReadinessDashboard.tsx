import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Activity
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockOTs, mockMachines } from '../data/mockData';
export function HMLiveReadinessDashboard() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  // Calculate readiness
  const otReadiness = mockOTs.map((ot) => {
    const machines = mockMachines.filter((m) => m.otId === ot.id);
    const total = machines.length;
    // Simulate random readiness for demo
    const ready = Math.floor(total * (0.6 + Math.random() * 0.4));
    const status =
      ready === total ? 'READY' : ready > total / 2 ? 'PARTIAL' : 'NOT READY';
    return {
      ...ot,
      total,
      ready,
      status,
      lastCheck: new Date(Date.now() - Math.random() * 3600000)
    };
  });
  const totalMachines = otReadiness.reduce((acc, ot) => acc + ot.total, 0);
  const totalReady = otReadiness.reduce((acc, ot) => acc + ot.ready, 0);
  const overallPercentage = Math.round(totalReady / totalMachines * 100);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400';
      case 'PARTIAL':
        return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400';
      default:
        return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400';
    }
  };
  // Circular Progress Component
  const Radius = 80;
  const Circumference = 2 * Math.PI * Radius;
  const StrokeDashoffset =
    Circumference - overallPercentage / 100 * Circumference;
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/hm-dashboard')}
              className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Live Readiness
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`}>

            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Overall Status */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={Radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800" />

              <circle
                cx="96"
                cy="96"
                r={Radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={Circumference}
                strokeDashoffset={StrokeDashoffset}
                strokeLinecap="round"
                className="text-purple-600 dark:text-purple-500 transition-all duration-1000 ease-out" />

            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                {overallPercentage}%
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Ready
              </span>
            </div>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalReady}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Machines Ready
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalMachines - totalReady}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Issues Found
              </div>
            </div>
          </div>
        </div>

        {/* OT Grid */}
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Theatre Status
        </h2>
        <div className="grid gap-4">
          {otReadiness.map((ot, index) =>
            <motion.div
              key={ot.id}
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    {ot.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last check: {ot.lastCheck.toLocaleTimeString()}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ot.status)}`}>

                  {ot.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Readiness
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {ot.ready}/{ot.total} Machines
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${ot.status === 'READY' ? 'bg-emerald-500' : ot.status === 'PARTIAL' ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{
                      width: `${ot.ready / ot.total * 100}%`
                    }} />

                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}