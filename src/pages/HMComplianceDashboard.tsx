import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart3
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { mockOTs, mockMachines } from '../data/mockData';
import { BottomNavigation } from '../components/BottomNavigation';
import { ComplianceMetrics } from '../types';
export function HMComplianceDashboard() {
  const navigate = useNavigate();
  // Calculate compliance metrics per OT
  const complianceData: ComplianceMetrics[] = useMemo(() => {
    return mockOTs.map((ot) => {
      const otMachines = mockMachines.filter((m) => m.otId === ot.id);
      const totalMachines = otMachines.length;
      // Simulate checked today (random for demo)
      const checkedToday = Math.floor(
        totalMachines * (0.5 + Math.random() * 0.5)
      );
      const overdueCount = Math.max(
        0,
        totalMachines - checkedToday - Math.floor(Math.random() * 2)
      );
      const compliancePercentage =
        totalMachines > 0 ? Math.round(checkedToday / totalMachines * 100) : 0;
      return {
        otId: ot.id,
        otName: ot.name,
        totalMachines,
        checkedToday,
        overdueCount,
        compliancePercentage
      };
    });
  }, []);
  const overallCompliance = useMemo(() => {
    const total = complianceData.reduce((sum, c) => sum + c.totalMachines, 0);
    const checked = complianceData.reduce((sum, c) => sum + c.checkedToday, 0);
    return total > 0 ? Math.round(checked / total * 100) : 0;
  }, [complianceData]);
  const totalOverdue = complianceData.reduce(
    (sum, c) => sum + c.overdueCount,
    0
  );
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'emerald';
    if (percentage >= 70) return 'amber';
    return 'rose';
  };
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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Compliance Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Safety check compliance overview
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Overall Stats */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white mb-5">

          <h2 className="text-lg font-bold mb-4">Overall Compliance</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold mb-1">
                {overallCompliance}%
              </div>
              <div className="text-xs text-purple-100">Compliance Rate</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold mb-1">
                {mockMachines.length}
              </div>
              <div className="text-xs text-purple-100">Total Machines</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold mb-1 text-amber-300">
                {totalOverdue}
              </div>
              <div className="text-xs text-purple-100">Overdue</div>
            </div>
          </div>
        </motion.div>

        {/* OT Compliance Cards */}
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
          By Operation Theatre
        </h2>
        <div className="space-y-3">
          {complianceData.map((ot, index) => {
            const color = getComplianceColor(ot.compliancePercentage);
            return (
              <motion.div
                key={ot.otId}
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
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {ot.otName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ot.totalMachines} machines
                    </p>
                  </div>
                  <div
                    className={`text-2xl font-bold ${color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : color === 'amber' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-400'}`}>

                    {ot.compliancePercentage}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${ot.compliancePercentage}%`
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1
                    }}
                    className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`} />

                </div>

                {/* Stats Row */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {ot.checkedToday} checked
                    </span>
                  </div>
                  {ot.overdueCount > 0 &&
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {ot.overdueCount} overdue
                      </span>
                    </div>
                  }
                </div>
              </motion.div>);

          })}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}