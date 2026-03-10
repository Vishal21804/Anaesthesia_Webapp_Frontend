import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  XCircle,
  AlertCircle,
  CheckCircle,
  User,
  Wrench,
  CheckCircle2 } from
'lucide-react';
import { motion } from 'framer-motion';
import { mockMachines } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
interface InspectionData {
  machineId: string;
  machineName: string;
  otName: string;
  date: string;
  time: string;
  status: 'working' | 'broken' | 'resolved';
  failedItems: Array<{
    id: string;
    label: string;
    notes: string;
  }>;
  lifecycle?: {
    checkedBy: string;
    issueReportedAt?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    maintenanceNotes?: string;
  };
}
export function MachineInspectionDetail() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const location = useLocation();
  // Get inspection data from location state or reconstruct from sessionStorage
  const inspectionData: InspectionData | null =
  location.state?.inspection ||
  (() => {
    const machine = mockMachines.find((m) => m.id === machineId);
    if (!machine) return null;
    const saved = sessionStorage.getItem(`checklist-${machineId}`);
    if (!saved) return null;
    const items = JSON.parse(saved);
    const failedItems = items.
    filter((item: any) => item.status === 'not-working').
    map((item: any) => ({
      id: item.id,
      label: item.label,
      notes: item.notes || 'No notes provided'
    }));
    const hasFailures = failedItems.length > 0;
    return {
      machineId: machine.id,
      machineName: machine.name,
      otName: machine.otId.toUpperCase(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: hasFailures ? 'broken' : 'working',
      failedItems,
      lifecycle: {
        checkedBy: 'Alex Taylor'
      }
    };
  })();
  // Determine display status based on lifecycle
  const getDisplayStatus = (): 'working' | 'broken' | 'resolved' => {
    if (!inspectionData) return 'working';
    // If resolved, show resolved status
    if (inspectionData.lifecycle?.resolvedAt) {
      return 'resolved';
    }
    // Otherwise use the original status
    return inspectionData.status === 'broken' ? 'broken' : 'working';
  };
  const displayStatus = inspectionData ? getDisplayStatus() : 'working';
  // Custom status badge for resolved state
  const renderStatusBadge = () => {
    if (displayStatus === 'resolved') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved
        </div>);

    }
    return (
      <StatusBadge
        status={displayStatus === 'broken' ? 'broken' : 'working'}
        type="machine"
        size="md" />);


  };
  if (!inspectionData) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Inspection Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Unable to load inspection details
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-health-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-teal-600 transition-all">

            Go Back
          </button>
        </div>
      </div>);

  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Inspection Details
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Safety checklist report
            </p>
          </div>
        </header>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">

          {/* Machine Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {inspectionData.machineName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {inspectionData.otName}
              </p>
            </div>
            {renderStatusBadge()}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {inspectionData.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Time
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {inspectionData.time}
                </p>
              </div>
            </div>
          </div>

          {/* Lifecycle Timeline */}
          {inspectionData.lifecycle &&
          <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                Inspection Lifecycle
              </h3>

              <div className="relative pl-4 space-y-4">
                {/* Timeline line */}
                <div className="absolute left-1.5 top-1 bottom-1 w-0.5 bg-slate-200 dark:bg-slate-700" />

                {/* Checklist completed */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-2.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Checklist Completed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {inspectionData.date} • {inspectionData.time}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Checked by:{' '}
                        <span className="font-semibold">
                          {inspectionData.lifecycle.checkedBy}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Issue reported */}
                {inspectionData.lifecycle.issueReportedAt &&
              <div className="relative flex items-start gap-3">
                    <div className="absolute -left-2.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Issue Reported
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {inspectionData.lifecycle.issueReportedAt}
                      </p>
                      {inspectionData.failedItems.length > 0 &&
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                          "{inspectionData.failedItems[0].label}"
                        </p>
                  }
                    </div>
                  </div>
              }

                {/* Resolved */}
                {inspectionData.lifecycle.resolvedAt &&
              <div className="relative flex items-start gap-3">
                    <div className="absolute -left-2.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Resolved
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {inspectionData.lifecycle.resolvedAt}
                      </p>
                      {inspectionData.lifecycle.resolvedBy &&
                  <div className="flex items-center gap-1.5 mt-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Resolved by:{' '}
                            <span className="font-semibold">
                              {inspectionData.lifecycle.resolvedBy}
                            </span>
                          </span>
                        </div>
                  }
                      {inspectionData.lifecycle.maintenanceNotes &&
                  <div className="mt-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Wrench className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                              Resolution Notes
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {inspectionData.lifecycle.maintenanceNotes}
                          </p>
                        </div>
                  }
                    </div>
                  </div>
              }
              </div>
            </div>
          }

          {/* Failed Items List (if any) */}
          {inspectionData.failedItems.length > 0 ?
          <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                Issues Found ({inspectionData.failedItems.length})
              </h3>
              <div className="space-y-3">
                {inspectionData.failedItems.map((item, index) =>
              <motion.div
                key={item.id}
                initial={{
                  x: -20,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-xl p-4">

                    <div className="flex items-start gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {item.notes}
                        </p>
                      </div>
                    </div>
                  </motion.div>
              )}
              </div>
            </div> :

          <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                All Checks Passed
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No issues were found during this inspection
              </p>
            </div>
          }
        </motion.div>
      </div>
    </div>);

}