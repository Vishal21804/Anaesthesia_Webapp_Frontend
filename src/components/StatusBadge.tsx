import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { MachineStatus, IssueStatus, IssuePriority } from '../types';
interface StatusBadgeProps {
  status: MachineStatus | IssueStatus | IssuePriority;
  type?: 'machine' | 'issue' | 'priority';
  size?: 'sm' | 'md' | 'lg';
}
export function StatusBadge({
  status,
  type = 'machine',
  size = 'sm'
}: StatusBadgeProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-3 py-1.5 text-xs';
      default:
        return 'px-2.5 py-1 text-[10px]';
    }
  };
  const getMachineConfig = (s: string) => {
    switch (s) {
      case 'working':
        return {
          color:
          'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
          icon: CheckCircle,
          label: 'Working'
        };
      case 'broken':
        return {
          color:
          'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
          icon: XCircle,
          label: 'Not Working'
        };
      default:
        return {
          color:
          'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: CheckCircle,
          label: s
        };
    }
  };
  const getIssueConfig = (s: string) => {
    switch (s) {
      case 'resolved':
        return {
          color:
          'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
          label: 'Resolved'
        };
      case 'in-progress':
        return {
          color:
          'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
          label: 'In Progress'
        };
      case 'pending':
        return {
          color:
          'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-900/50',
          label: 'Pending'
        };
      case 'escalated':
        return {
          color:
          'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
          label: 'Escalated'
        };
      default:
        return {
          color:
          'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          label: s
        };
    }
  };
  const getPriorityConfig = (s: string) => {
    switch (s) {
      case 'critical':
        return {
          color:
          'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
          label: 'Critical'
        };
      case 'high':
        return {
          color:
          'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50',
          label: 'High'
        };
      case 'medium':
        return {
          color:
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-900/50',
          label: 'Medium'
        };
      case 'low':
        return {
          color:
          'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
          label: 'Low'
        };
      default:
        return {
          color:
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          label: s
        };
    }
  };
  let config;
  if (type === 'machine') config = getMachineConfig(status);else
  if (type === 'priority') config = getPriorityConfig(status);else
  config = getIssueConfig(status);
  const Icon = config.icon;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold border uppercase tracking-wide
        ${getSizeClasses()}
        ${config.color}
      `}>

      {Icon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />}
      {config.label}
    </span>);

}