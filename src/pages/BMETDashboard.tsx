import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { useEffect, useState } from 'react';
import { getBMETDashboard } from '../services/dashboard';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Wrench,
  Inbox,
  Clock } from
'lucide-react';
import { motion } from 'framer-motion';
import { IssueCard } from '../components/IssueCard';
export function BMETDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
  critical_issues: 0,
  pending_repairs: 0,
  resolved_today: 0
});
useEffect(() => {

  const userString = localStorage.getItem('user');

  if (!userString) {
    navigate('/login');
    return;
  }

  const user = JSON.parse(userString);

  const loadDashboard = async () => {
    try {
      const data = await getBMETDashboard(user.id);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch BMET dashboard');
    }
  };

  loadDashboard();

}, [navigate]);
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6">
        <ProfileHeader name="David Chen" role="bmet" notificationCount={5} />

        <motion.section
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="mt-2 mb-6">

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-5 text-white shadow-lg shadow-blue-200/50 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-slate-600/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-900/10 dark:bg-slate-900/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1">Maintenance Hub</h2>
              <p className="text-blue-50 dark:text-slate-300 text-sm mb-5 opacity-90">
                Equipment status overview
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Pending
                    </span>
                  </div>
                 <p className="text-2xl font-bold">{stats.critical_issues}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Issues
                  </p>
                </div>

                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Active
                    </span>
                  </div>
                 <p className="text-2xl font-bold">{stats.pending_repairs}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Repairs
                  </p>
                </div>

                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Done
                    </span>
                  </div>
                 <p className="text-2xl font-bold">{stats.resolved_today}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{
                scale: 0.95
              }}
              onClick={() => navigate('/bmet/inbox')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2.5 hover:shadow-md transition-all">

              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
                <Inbox className="w-6 h-6" />
                {pendingCount > 0 &&
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  </div>
                }
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                Issue Inbox
              </span>
            </motion.button>

            <motion.button
              whileTap={{
                scale: 0.95
              }}
              onClick={() => navigate('/bmet/history')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2.5 hover:shadow-md transition-all">

              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                History
              </span>
            </motion.button>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Priority Attention
            </h2>
            <button
              onClick={() => navigate('/bmet/issues')}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">

              See All <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {priorityIssues.slice(0, 3).map((issue, index) =>
            <motion.div
              key={issue.id}
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
              }}>

                <IssueCard
                issue={issue}
                onClick={() => navigate(`/bmet/issue/${issue.id}`)} />

              </motion.div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Updates
            </h2>
            <button
              onClick={() => navigate('/bmet/history')}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">

              History <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-50 dark:border-slate-700">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Philips IntelliVue Repaired
                </p>
                <p className="text-xs text-slate-400">
                  Software update completed • 2h ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Drager Fabius Inspection
                </p>
                <p className="text-xs text-slate-400">
                  Routine maintenance • 4h ago
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation role="bmet" />
    </div>);

}