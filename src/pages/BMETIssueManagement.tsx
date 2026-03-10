import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ChevronRight } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { IssueCard } from '../components/IssueCard';
import { OTCard } from '../components/OTCard';
import { mockIssues, mockOTs } from '../data/mockData';
import { motion } from 'framer-motion';
export function BMETIssueManagement() {
  const navigate = useNavigate();
  // Filter OTs with active issues
  const otsWithIssues = mockOTs.filter((ot) => ot.activeIssues > 0);
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/bmet/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Issue Management
          </h1>
        </header>

        {/* OT Cards Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Operation Theatres
            </h2>
            <button
              onClick={() => navigate('/bmet/ot-overview')}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">

              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {otsWithIssues.map((ot, index) =>
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
              }}>

                <OTCard
                ot={ot}
                onClick={() => navigate(`/bmet/ot-issues/${ot.id}`)} />

              </motion.div>
            )}
          </div>
        </section>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />

          </div>
          <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* All Issues Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            All Issues
          </h2>
        </div>

        <div className="space-y-4">
          {mockIssues.map((issue, index) =>
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


              {/* Quick Actions */}
              <div className="flex gap-2 mt-2 pl-1">
                <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  Mark Under Maintenance
                </button>
                <button className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                  Resolve Issue
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="bmet" />
    </div>);

}