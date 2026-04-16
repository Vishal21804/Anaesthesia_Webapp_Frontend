import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPinOff,
  CheckCircle2,
  Clock,
  Eye,
  Settings,
  XCircle,
  ChevronRight,
  Filter
} from
  'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { useAppData } from '../contexts/AppDataContext';
import { ConfigurationWarning, ConfigurationWarningStatus } from '../types';
const REASON_LABELS: Record<string, string> = {
  machine_not_present: 'Machine Not Present',
  wrong_ot_assignment: 'Wrong OT Assignment',
  duplicate_machine: 'Duplicate Machine'
};
const STATUS_CONFIG: Record<
  ConfigurationWarningStatus,
  {
    label: string;
    color: string;
    icon: any;
  }> =
{
  open: {
    label: 'Open',
    color: 'amber',
    icon: Clock
  },
  acknowledged: {
    label: 'Acknowledged',
    color: 'blue',
    icon: Eye
  },
  resolved: {
    label: 'Resolved',
    color: 'emerald',
    icon: CheckCircle2
  }
};
export function HMConfigurationWarnings() {
  const navigate = useNavigate();
  const { configWarnings, updateConfigWarning, addAuditEntry } = useAppData();
  const [filterStatus, setFilterStatus] = useState<
    ConfigurationWarningStatus | 'all'>(
      'all');
  const [selectedWarning, setSelectedWarning] =
    useState<ConfigurationWarning | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const filteredWarnings =
    filterStatus === 'all' ?
      configWarnings :
      configWarnings.filter((w) => w.status === filterStatus);
  const sortedWarnings = [...filteredWarnings].sort((a, b) => {
    // Open first, then acknowledged, then resolved
    const statusOrder = {
      open: 0,
      acknowledged: 1,
      resolved: 2
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });
  const counts = {
    all: configWarnings.length,
    open: configWarnings.filter((w) => w.status === 'open').length,
    acknowledged: configWarnings.filter((w) => w.status === 'acknowledged').
      length,
    resolved: configWarnings.filter((w) => w.status === 'resolved').length
  };
  const handleAcknowledge = (warning: ConfigurationWarning) => {
    updateConfigWarning(warning.id, {
      status: 'acknowledged',
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: 'Sarah Connor' // In real app, get from auth
    });
    addAuditEntry({
      action: 'config_warning_resolved',
      performedBy: 'Sarah Connor',
      performedByRole: 'management',
      targetType: 'config_warning',
      targetId: warning.id,
      targetName: warning.machineName,
      details: 'Warning acknowledged'
    });
    setShowActionModal(false);
    setSelectedWarning(null);
  };
  const handleResolve = (
    warning: ConfigurationWarning,
    resolution: 'ot_corrected' | 'machine_deactivated' | 'other') => {
    updateConfigWarning(warning.id, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Sarah Connor',
      resolution
    });
    addAuditEntry({
      action: 'config_warning_resolved',
      performedBy: 'Sarah Connor',
      performedByRole: 'management',
      targetType: 'config_warning',
      targetId: warning.id,
      targetName: warning.machineName,
      details:
        resolution === 'ot_corrected' ?
          'OT assignment corrected' :
          resolution === 'machine_deactivated' ?
            'Machine deactivated' :
            'Resolved'
    });
    setShowActionModal(false);
    setSelectedWarning(null);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  const getStatusBadge = (status: ConfigurationWarningStatus) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    const colorClasses = {
      amber:
        'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
      blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
      emerald:
        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
    };
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${colorClasses[config.color as keyof typeof colorClasses]}`}>

        <Icon className="w-3 h-3" />
        {config.label}
      </div>);

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
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Configuration Warnings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              OT mismatch reports from technicians
            </p>
          </div>
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500">
            <MapPinOff className="w-5 h-5" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'open', 'acknowledged', 'resolved'] as const).map(
            (status) =>
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>

                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {counts[status]})
              </button>

          )}
        </div>
      </div>

      {/* Warnings List */}
      <div className="px-5 py-4">
        {sortedWarnings.length === 0 ?
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-center py-12">

            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center  mb-4">
              <MapPinOff className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
              No Warnings Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filterStatus === 'all' ?
                'No configuration warnings have been reported.' :
                `No ${filterStatus} warnings.`}
            </p>
          </motion.div> :

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedWarnings.map((warning, index) =>
                <motion.div
                  key={warning.id}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">

                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">
                        {warning.machineName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {warning.serialNumber}
                      </p>
                    </div>
                    {getStatusBadge(warning.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500">
                        Reason
                      </span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        {REASON_LABELS[warning.reason]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500">
                        Reported OT
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {warning.reportedOT}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500">
                        Reported By
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {warning.reportedBy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500">
                        Reported At
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatDate(warning.reportedAt)}
                      </span>
                    </div>
                    {warning.notes &&
                      <div className="pt-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Notes:
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
                          "{warning.notes}"
                        </p>
                      </div>
                    }
                  </div>

                  {/* Actions */}
                  {warning.status !== 'resolved' &&
                    <button
                      onClick={() => {
                        setSelectedWarning(warning);
                        setShowActionModal(true);
                      }}
                      className="w-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors">

                      <Settings className="w-4 h-4" />
                      Take Action
                    </button>
                  }

                  {warning.status === 'resolved' && warning.resolution &&
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                          Resolved
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {warning.resolution === 'ot_corrected' &&
                          'OT assignment corrected'}
                        {warning.resolution === 'machine_deactivated' &&
                          'Machine deactivated'}
                        {warning.resolution === 'other' && 'Marked as resolved'}
                        {warning.resolvedBy && ` by ${warning.resolvedBy}`}
                      </p>
                    </div>
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedWarning &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowActionModal(false)}>

            <motion.div
              initial={{
                y: '100%'
              }}
              animate={{
                y: 0
              }}
              exit={{
                y: '100%'
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl p-6"
              style={{
                paddingBottom: 'calc(var(--safe-area-bottom) + 1.5rem)'
              }}>

              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full  mb-6" />

              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Take Action
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {selectedWarning.machineName} -{' '}
                {REASON_LABELS[selectedWarning.reason]}
              </p>

              <div className="space-y-3">
                {selectedWarning.status === 'open' &&
                  <button
                    onClick={() => handleAcknowledge(selectedWarning)}
                    className="w-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">

                    <Eye className="w-5 h-5" />
                    Acknowledge Warning
                  </button>
                }

                <button
                  onClick={() => handleResolve(selectedWarning, 'ot_corrected')}
                  className="w-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors">

                  <CheckCircle2 className="w-5 h-5" />
                  Correct OT Assignment
                </button>

                <button
                  onClick={() =>
                    handleResolve(selectedWarning, 'machine_deactivated')
                  }
                  className="w-full bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors">

                  <XCircle className="w-5 h-5" />
                  Deactivate Machine
                </button>

                <button
                  onClick={() => handleResolve(selectedWarning, 'other')}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">

                  Mark as Resolved
                </button>
              </div>

              <button
                onClick={() => setShowActionModal(false)}
                className="w-full mt-4 text-slate-500 dark:text-slate-400 font-semibold py-3">

                Cancel
              </button>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      <BottomNavigation role="management" />
    </div>);

}