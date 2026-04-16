import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Circle,
  ChevronDown,
  ChevronUp } from
'lucide-react';
import { ChecklistItemStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
interface ChecklistItemProps {
  item: {
    id: string;
    label: string;
    status: ChecklistItemStatus;
    notes?: string;
  };
  onStatusChange: (id: string, status: ChecklistItemStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  disabled?: boolean;
}
export function ChecklistItem({
  item,
  onStatusChange,
  onNotesChange,
  disabled = false
}: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Auto-expand and focus when marked as not-working
  useEffect(() => {
    if (item.status === 'not-working' && !disabled) {
      setIsExpanded(true);
    }
  }, [item.status, disabled]);
  const toggleExpand = () => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };
  const handleStatusClick = (status: ChecklistItemStatus) => {
    if (!disabled) {
      onStatusChange(item.id, status);
      // Don't auto-expand for 'working' status
      if (status === 'working') {
        setIsExpanded(false);
      }
    }
  };
  // Status-based card edge color
  const getBorderColor = () => {
    switch (item.status) {
      case 'working':
        return 'border-l-emerald-500';
      case 'not-working':
        return 'border-l-rose-500';
      default:
        return 'border-l-slate-200 dark:border-l-slate-700';
    }
  };
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border-l-4 border-y border-r border-slate-100 dark:border-slate-700 overflow-hidden transition-all ${getBorderColor()} ${disabled ? 'opacity-50' : ''}`}>

      {/* Collapsed State - Title + Inline Status Icons */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Checklist Item Title */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
              {item.label}
            </p>
          </div>

          {/* Inline Status Selection - Round Icon Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleStatusClick('working')}
              disabled={disabled}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.status === 'working' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400'} ${disabled ? 'cursor-not-allowed' : ''}`}
              title="Working">

              <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <button
              onClick={() => handleStatusClick('not-working')}
              disabled={disabled}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.status === 'not-working' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400'} ${disabled ? 'cursor-not-allowed' : ''}`}
              title="Not Working">

              <XCircle className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Expand/Collapse Arrow */}
          <button
            onClick={toggleExpand}
            disabled={disabled}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${disabled ? 'cursor-not-allowed' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>

            {isExpanded ?
            <ChevronUp className="w-5 h-5" /> :

            <ChevronDown className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {/* Expanded State - Notes Only */}
      <AnimatePresence>
        {isExpanded && !disabled &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="overflow-hidden">

            <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700">
              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                  Notes{' '}
                  {item.status === 'not-working' &&
                <span className="text-rose-500">*</span>
                }
                </label>
                <textarea
                value={item.notes || ''}
                onChange={(e) => onNotesChange(item.id, e.target.value)}
                placeholder="Add notes or issues observed..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-primary/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none"
                rows={3}
                autoFocus={item.status === 'not-working'} />

              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
