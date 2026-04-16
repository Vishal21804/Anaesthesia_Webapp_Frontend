import React from 'react';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Issue } from '../types';
import { motion } from 'framer-motion';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.98
      }}
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all">

      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-2">
          <StatusBadge status={issue.priority} type="priority" />
          <StatusBadge status={issue.status} type="issue" />
        </div>
        <span className="text-xs text-slate-400 font-mono">ID-{issue.id}</span>
      </div>

      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mt-2">
        {issue.machine_name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
        {issue.type}: {issue.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-700">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{issue.ot_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(issue.reported_at).toLocaleDateString()}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-500" />
      </div>
    </motion.div>);

}
