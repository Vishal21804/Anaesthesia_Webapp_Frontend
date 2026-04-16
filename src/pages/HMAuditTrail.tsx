import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Wrench,
  MapPin
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { useAppData } from '../contexts/AppDataContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { AuditEntry } from '../types';
export function HMAuditTrail() {
  const navigate = useNavigate();
  const { auditTrail } = useAppData();
  const [filterType, setFilterType] = useState<string>('all');
  // Mock audit entries if none exist
  const displayEntries: AuditEntry[] =
    auditTrail.length > 0 ?
      auditTrail :
      [
        {
          id: 'audit-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'checklist_completed',
          performedBy: 'Alex Taylor',
          performedByRole: 'technician',
          targetType: 'machine',
          targetId: 'm-1',
          targetName: 'Drager Fabius GS',
          details: 'All 12 items passed'
        },
        {
          id: 'audit-2',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: 'issue_reported',
          performedBy: 'Alex Taylor',
          performedByRole: 'technician',
          targetType: 'issue',
          targetId: 'ISS-004',
          targetName: 'GE Datex-Ohmeda',
          details: 'O2 sensor calibration required'
        },
        {
          id: 'audit-3',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          action: 'issue_resolved',
          performedBy: 'David Chen',
          performedByRole: 'bmet',
          targetType: 'issue',
          targetId: 'ISS-003',
          targetName: 'Drager Fabius GS',
          details: 'Display replaced'
        },
        {
          id: 'audit-4',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          action: 'user_enabled',
          performedBy: 'Sarah Connor',
          performedByRole: 'management',
          targetType: 'user',
          targetId: 'user-3',
          targetName: 'Maria Garcia'
        },
        {
          id: 'audit-5',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          action: 'priority_changed',
          performedBy: 'Sarah Connor',
          performedByRole: 'management',
          targetType: 'machine',
          targetId: 'm-8',
          targetName: 'Maquet Flow-i',
          previousValue: 'medium',
          newValue: 'high'
        }];

  const filteredEntries =
    filterType === 'all' ?
      displayEntries :
      displayEntries.filter((e) => e.action.includes(filterType));
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'checklist_completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'issue_reported':
      case 'issue_resolved':
        return <AlertTriangle className="w-5 h-5" />;
      case 'user_enabled':
        return <UserCheck className="w-5 h-5" />;
      case 'user_disabled':
        return <UserX className="w-5 h-5" />;
      case 'machine_added':
      case 'machine_deactivated':
        return <Wrench className="w-5 h-5" />;
      case 'ot_assigned':
        return <MapPin className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };
  const getActionColor = (action: string) => {
    if (
      action.includes('completed') ||
      action.includes('resolved') ||
      action.includes('enabled')) {
      return 'emerald';
    }
    if (action.includes('reported') || action.includes('disabled')) {
      return 'rose';
    }
    return 'blue';
  };
  const getActionLabel = (action: string) => {
    return action.
      split('_').
      map((w) => w.charAt(0).toUpperCase() + w.slice(1)).
      join(' ');
  };
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Audit Trail
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System activity log
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'checklist', 'issue', 'user', 'machine'].map((type) =>
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterType === type ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>

              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )}
        </div>
      </div>

      {/* Audit Entries */}
      <div className="px-5 py-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4">
            {filteredEntries.map((entry, index) => {
              const color = getActionColor(entry.action);
              return (
                <motion.div
                  key={entry.id}
                  initial={{
                    opacity: 0,
                    x: -20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  className="relative pl-12">

                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3 w-5 h-5 rounded-full flex items-center justify-center ${color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : color === 'rose' ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>

                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : color === 'rose' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>

                          {getActionIcon(entry.action)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                            {getActionLabel(entry.action)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {entry.targetName}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>

                    {entry.details &&
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {entry.details}
                      </p>
                    }

                    {entry.previousValue && entry.newValue &&
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 line-through">
                          {entry.previousValue}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {entry.newValue}
                        </span>
                      </div>
                    }

                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 dark:text-slate-500">
                      <span>by {entry.performedBy}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {entry.performedByRole}
                      </span>
                    </div>
                  </div>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}