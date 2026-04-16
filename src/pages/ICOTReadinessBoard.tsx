import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function ICOTReadinessBoard() {
  const navigate = useNavigate();
  const ots = [
  {
    id: 'ot-1',
    name: 'Operation Theatre 1',
    status: 'ready',
    checked: 4,
    total: 4,
    lastUpdate: '10 mins ago'
  },
  {
    id: 'ot-2',
    name: 'Operation Theatre 2',
    status: 'ready',
    checked: 3,
    total: 3,
    lastUpdate: '25 mins ago'
  },
  {
    id: 'ot-3',
    name: 'Operation Theatre 3',
    status: 'partial',
    checked: 2,
    total: 5,
    lastUpdate: '1 hour ago'
  },
  {
    id: 'icu',
    name: 'ICU Ward',
    status: 'not-ready',
    checked: 4,
    total: 8,
    lastUpdate: '2 hours ago'
  }];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return {
          color:
          'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          label: 'Ready'
        };
      case 'partial':
        return {
          color:
          'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
          label: 'In Progress'
        };
      default:
        return {
          color:
          'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50',
          icon: XCircle,
          iconColor: 'text-rose-600 dark:text-rose-400',
          label: 'Not Ready'
        };
    }
  };
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
            OT Readiness Board
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ots.map((ot, index) => {
            const config = getStatusConfig(ot.status);
            const Icon = config.icon;
            return (
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
                className={`rounded-2xl p-5 border ${config.color}`}>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                      {ot.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      Updated {ot.lastUpdate}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.color} border-0`}>

                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    <span className={`text-xs font-bold ${config.iconColor}`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {ot.checked}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      /{ot.total} Machines
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${ot.status === 'ready' ? 'bg-emerald-500' : ot.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{
                        width: `${ot.checked / ot.total * 100}%`
                      }} />

                  </div>
                </div>
              </motion.div>);

          })}
        </div>
      </div>

      <BottomNavigation role="incharge" />
    </div>);

}
