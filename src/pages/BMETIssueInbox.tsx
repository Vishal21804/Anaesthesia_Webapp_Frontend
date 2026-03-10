import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Inbox,
  Filter,
  Clock,
  AlertTriangle,
  ChevronRight,
  SortAsc } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../contexts/AppDataContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusBadge } from '../components/StatusBadge';
type SortOption = 'priority' | 'severity' | 'time';
export function BMETIssueInbox() {
  const navigate = useNavigate();
  const { issues } = useAppData();
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [showSortMenu, setShowSortMenu] = useState(false);
  // Filter unresolved issues
  const unresolvedIssues = useMemo(() => {
    return issues.filter((i) => i.status !== 'resolved');
  }, [issues]);
  // Sort issues
  const sortedIssues = useMemo(() => {
    const sorted = [...unresolvedIssues];
    switch (sortBy) {
      case 'priority':
        const priorityOrder = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3
        };
        sorted.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case 'severity':
        sorted.sort((a, b) => {
          const sevA = a.severity === 'critical' ? 0 : 1;
          const sevB = b.severity === 'critical' ? 0 : 1;
          return sevA - sevB;
        });
        break;
      case 'time':
        sorted.sort(
          (a, b) =>
          new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
        );
        break;
    }
    return sorted;
  }, [unresolvedIssues, sortBy]);
  const sortOptions: {
    value: SortOption;
    label: string;
  }[] = [
  {
    value: 'priority',
    label: 'Priority'
  },
  {
    value: 'severity',
    label: 'Severity'
  },
  {
    value: 'time',
    label: 'Time Reported'
  }];

  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/bmet/dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Issue Inbox
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unresolvedIssues.length} unresolved issues
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        {/* Sort Control */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">

            <SortAsc className="w-4 h-4" />
            Sort by: {sortOptions.find((o) => o.value === sortBy)?.label}
          </button>

          <AnimatePresence>
            {showSortMenu &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10">

                {sortOptions.map((option) =>
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setShowSortMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${sortBy === option.value ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>

                    {option.label}
                  </button>
              )}
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Issue List */}
      <div className="px-5 py-4 space-y-3">
        {sortedIssues.map((issue, index) =>
        <motion.button
          key={issue.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05
          }}
          onClick={() => navigate(`/bmet/issue/${issue.id}`)}
          className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-left hover:shadow-md transition-all">

            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">
                  {issue.machineName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {issue.otName} • {issue.type}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {issue.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={issue.priority} type="priority" />
              <StatusBadge status={issue.status} type="issue" />
              {issue.severity && <SeverityBadge severity={issue.severity} />}
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Reported {issue.reportedAt}</span>
            </div>
          </motion.button>
        )}

        {sortedIssues.length === 0 &&
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No pending issues
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              All issues have been resolved
            </p>
          </div>
        }
      </div>

      <BottomNavigation role="bmet" />
    </div>);

}