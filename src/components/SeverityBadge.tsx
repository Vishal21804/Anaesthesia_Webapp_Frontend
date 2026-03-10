import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { IssueSeverity } from '../types';
interface SeverityBadgeProps {
  severity: IssueSeverity;
  size?: 'sm' | 'md';
}
export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const isCritical = severity === 'critical';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full ${sizeClasses[size]} ${isCritical ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500'}`}>

      {isCritical ?
      <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> :

      <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      }
      {isCritical ? 'Critical' : 'Minor'}
    </span>);

}