import React from 'react';
import { UserRole } from '../types';
interface RoleBadgeProps {
  role: UserRole;
}
export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleConfig = () => {
    switch (role) {
      case 'technician':
        return {
          label: 'Anaesthesia Tech',
          classes:
          'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50'
        };
      case 'bmet':
        return {
          label: 'BMET Specialist',
          classes:
          'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'
        };
      case 'incharge':
        return {
          label: 'In-Charge',
          classes:
          'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50'
        };
      case 'management':
        return {
          label: 'Hospital Admin',
          classes:
          'bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50'
        };
      default:
        return {
          label: 'Staff',
          classes:
          'bg-slate-50 text-slate-700 border border-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
        };
    }
  };
  const config = getRoleConfig();
  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
      ${config.classes}
    `}>

      {config.label}
    </span>);

}
