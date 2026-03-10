import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function ICMachineStatusSummary() {
  const navigate = useNavigate();
  const otStatus = [
  {
    id: 'ot-1',
    name: 'Operation Theatre 1',
    total: 4,
    ready: 3,
    attention: 1,
    notReady: 0
  },
  {
    id: 'ot-2',
    name: 'Operation Theatre 2',
    total: 3,
    ready: 3,
    attention: 0,
    notReady: 0
  },
  {
    id: 'ot-3',
    name: 'Operation Theatre 3',
    total: 5,
    ready: 2,
    attention: 1,
    notReady: 2
  },
  {
    id: 'icu',
    name: 'ICU Ward',
    total: 8,
    ready: 7,
    attention: 1,
    notReady: 0
  }];

  return (
    <div
      className="min-h-[917px] bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="px-5 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Machine Status
          </h1>
        </div>

        <div className="space-y-4">
          {otStatus.map((ot, index) =>
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
              delay: index * 0.05
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    {ot.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {ot.total} Machines Total
                  </p>
                </div>
                <button className="p-1 text-slate-300 hover:text-slate-500">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex h-2.5 rounded-full overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                <div
                className="bg-emerald-500"
                style={{
                  width: `${ot.ready / ot.total * 100}%`
                }} />

                <div
                className="bg-amber-500"
                style={{
                  width: `${ot.attention / ot.total * 100}%`
                }} />

                <div
                className="bg-rose-500"
                style={{
                  width: `${ot.notReady / ot.total * 100}%`
                }} />

              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {ot.ready}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {ot.attention}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                    <AlertTriangle className="w-3 h-3" /> Check
                  </div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {ot.notReady}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">
                    <XCircle className="w-3 h-3" /> Down
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="incharge" />
    </div>);

}