import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  MapPinOff,
  ChevronDown,
  ChevronRight,
  List,
  AlertCircle as AlertIcon,
  Home,
  FileText,
  Lock,
  RefreshCw,
  Loader
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { getMachineList, inspectMachine } from '../services/machine';
import { getOtList } from '../services/ot';
import { Machine, OT } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
type StatusSelection = 'working' | 'not-working' | null;
type FailureSeverity = 'critical' | 'high' | 'moderate' | 'low';
type MachineCheckStatus = 'completed' | 'pending' | 'fault';
export function MachineDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [ot, setOt] = useState<OT | null>(null);
  const [otMachines, setOtMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Machine ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [allMachines, allOts] = await Promise.all([getMachineList(), getOtList()]);
        
        const currentMachineId = parseInt(id, 10);
        const currentMachine = allMachines.find((m: Machine) => m.id === currentMachineId);

        if (currentMachine) {
          setMachine(currentMachine);
          const currentOt = allOts.find((o: OT) => currentMachine.assigned_ots.includes(o.id));
          setOt(currentOt || null);
          if (currentOt) {
            const machinesInOt = allMachines.filter((m: Machine) => m.assigned_ots.includes(currentOt.id));
            setOtMachines(machinesInOt);
          }
        } else {
          setError('Machine not found.');
        }
      } catch (err) {
        setError('Failed to fetch machine details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getMachineCheckStatus = (machineId: number): MachineCheckStatus => {
    const checklistData = sessionStorage.getItem(`checklist-${machineId}`);
    if (!checklistData) return 'pending';
    try {
      const items = JSON.parse(checklistData);
      const hasNotWorking = items.some((item: any) => item.status === 'not-working');
      const allChecked = items.every((item: any) => item.status !== 'not-checked');
      return allChecked ? (hasNotWorking ? 'fault' : 'completed') : 'pending';
    } catch {
      return 'pending';
    }
  };
  
  const checkIfSubmitted = (): boolean => {
    if (!machine) return false;
    const checklistData = sessionStorage.getItem(`checklist-${machine.id}`);
    if (!checklistData) return false;
    try {
      const items = JSON.parse(checklistData);
      return items.every((item: any) => item.status !== 'not-checked');
    } catch {
      return false;
    }
  };

  const isOTInspectionComplete = useMemo(() => {
    return otMachines.every((m) => getMachineCheckStatus(m.id) !== 'pending');
  }, [otMachines]);
  
  // CRITICAL: Always start with null status for deliberate selection
  // Status is NEVER pre-selected - technician must always make a deliberate choice
  const [selectedStatus, setSelectedStatus] = useState<StatusSelection>(null);
  const [isSubmitted, setIsSubmitted] = useState(() => checkIfSubmitted());
  const [wasEdited, setWasEdited] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  // Reset status when machine ID changes (navigation between machines)
  useEffect(() => {
    // CRITICAL: Always reset to null - force deliberate selection
    setSelectedStatus(null);
    setIsSubmitted(checkIfSubmitted());
    setWasEdited(false);
  }, [id, machine]);
  // State for issue sheet
  const [isIssueSheetOpen, setIsIssueSheetOpen] = useState(false);
  const [issueType, setIssueType] = useState('Power Failure');
  const [failureSeverity, setFailureSeverity] =
  useState<FailureSeverity>('high');
  const [issueRemark, setIssueRemark] = useState('');
  // State for all machines sheet
  const [isMachineListOpen, setIsMachineListOpen] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
  }>({
    visible: false,
    message: ''
  });
  const issueTypes = [
  'Power Failure',
  'Gas Supply Issue',
  'Sensor Fault',
  'Leakage',
  'Alarm Failure',
  'Other'];

  const severityOptions: Array<{
    value: FailureSeverity;
    label: string;
  }> = [
  {
    value: 'critical',
    label: 'Critical'
  },
  {
    value: 'high',
    label: 'High'
  },
  {
    value: 'moderate',
    label: 'Moderate'
  },
  {
    value: 'low',
    label: 'Low'
  }];

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const statuses = otMachines.map((m) => getMachineCheckStatus(m.id));
    const completed = statuses.filter(
      (s) => s === 'completed' || s === 'fault'
    ).length;
    const currentIndex = otMachines.findIndex((m) => m.id === machine.id) + 1;
    return {
      current: currentIndex,
      total: otMachines.length,
      completed,
      pending: otMachines.length - completed
    };
  }, [otMachines, machine.id]);
  // Find next PENDING machine (skip completed and fault)
  const getNextPendingMachine = () => {
    const currentIndex = otMachines.findIndex((m) => m.id === machine.id);
    for (let i = currentIndex + 1; i < otMachines.length; i++) {
      if (getMachineCheckStatus(otMachines[i].id) === 'pending') {
        return otMachines[i];
      }
    }
    for (let i = 0; i < currentIndex; i++) {
      if (getMachineCheckStatus(otMachines[i].id) === 'pending') {
        return otMachines[i];
      }
    }
    return null;
  };
  const saveChecklistStatus = (status: 'Working' | 'Not Working', notes: string = '') => {
    if (!machine) return;
    const completedItems = [{ id: 'status', status, notes }]; // Simplified
    sessionStorage.setItem(`checklist-${machine.id}`, JSON.stringify(completedItems));
  };

  const navigateToNextMachine = () => {
    const nextMachine = getNextPendingMachine();
    if (nextMachine) {
      navigate(`/technician/machine/${nextMachine.id}`);
    } else {
      setShowCompletion(true);
    }
  };

  const handleSelectStatus = (status: StatusSelection) => {
    if (isOTInspectionComplete && isSubmitted) return;
    setSelectedStatus(status);
    if (isSubmitted) {
      setWasEdited(true);
    }
  };

  const handleEnableEdit = () => {
    if (isOTInspectionComplete) return;
    setIsSubmitted(false);
    setWasEdited(true);
  };

  const handleSubmitStatus = async () => {
    if (!selectedStatus || !machine) return;

    if (selectedStatus === 'Working') {
      try {
        await inspectMachine({ machine_id: machine.id, status: 'Working' });
        saveChecklistStatus('Working');
        setIsSubmitted(true);
        setToast({ visible: true, message: wasEdited ? 'Status updated' : 'Machine status recorded' });
        setTimeout(() => setToast({ visible: false, message: '' }), 1200);
        if (!wasEdited) {
          setTimeout(() => navigateToNextMachine(), 1500);
        }
        setWasEdited(false);
      } catch (error) {
        setToast({ visible: true, message: 'Failed to submit status.'});
        setTimeout(() => setToast({ visible: false, message: '' }), 1200);
      }
    } else {
      setIsIssueSheetOpen(true);
    }
  };

  const handleSubmitIssue = async () => {
    if (!machine) return;
    try {
        await inspectMachine({
            machine_id: machine.id,
            status: 'Not Working',
            remarks: `${issueType}: ${issueRemark}`,
            priority: failureSeverity
        });
        saveChecklistStatus('Not Working', `${issueType}: ${issueRemark}`);
        setIsIssueSheetOpen(false);
        setIsSubmitted(true);
        setToast({ visible: true, message: wasEdited ? 'Status updated' : 'Issue reported.' });
        setTimeout(() => setToast({ visible: false, message: '' }), 1200);
        if (!wasEdited) {
          setTimeout(() => navigateToNextMachine(), 1500);
        }
        setWasEdited(false);
    } catch (error) {
        setToast({ visible: true, message: 'Failed to report issue.' });
        setTimeout(() => setToast({ visible: false, message: '' }), 1200);
    }
  };
  const handleNextMachine = () => {
    if (isSubmitted) {
      navigateToNextMachine();
    }
  };
  const handleSelectMachine = (machineId: string) => {
    if (isSubmitted || machineId === machine.id) {
      setIsMachineListOpen(false);
      if (machineId !== machine.id) {
        navigate(`/technician/machine/${machineId}`);
      }
    }
  };
    // Completion Screen
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
          <Loader className="w-8 h-8 text-health-primary animate-spin" />
          <p className="ml-2 text-slate-500">Loading Machine Details...</p>
        </div>
      );
    }
  
    if (error || !machine || !ot) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
          <AlertIcon className="w-12 h-12 text-red-500" />
          <p className="mt-4 text-red-500">{error || 'Could not load machine details.'}</p>
          <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-health-primary text-white rounded-lg">
              Go Back
          </button>
        </div>
      );
    }
    
    if (showCompletion) {
      return (
        <div
          className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6"
          style={{
            paddingTop: 'var(--safe-area-top)',
            paddingBottom: 'var(--safe-area-bottom)'
          }}>
  
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            className="text-center max-w-sm">
  
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Inspection Complete
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              All machines in {ot.ot_name} have been successfully
              checked.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/technician/machines/${ot.id}`)}
                className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
  
                <Home className="w-5 h-5" />
                Return to OT Dashboard
              </button>
              <button
                onClick={() => navigate('/technician/history')}
                className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all">
  
                <FileText className="w-5 h-5" />
                View Summary
              </button>
            </div>
          </motion.div>
        </div>);
  
    }
    return (
      <div
        className="min-h-screen bg-health-bg dark:bg-slate-950 overflow-y-auto"
        style={{
          paddingTop: 'var(--safe-area-top)',
          paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
        }}>
  
        <div className="max-w-md lg:max-w-6xl mx-auto px-6 lg:px-8 pt-8">
          {/* Header */}
          <header className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/technician/machines/${ot.id}`)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
  
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Machine Details
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {progressStats.completed} / {progressStats.total} Checked
              </p>
            </div>
            <div className="bg-health-secondary dark:bg-teal-950/30 px-3 py-1.5 rounded-lg">
              <span className="text-sm font-bold text-health-primary dark:text-teal-400">
                {progressStats.current} of {progressStats.total}
              </span>
            </div>
          </header>
  
          {/* Desktop: two-column layout. Mobile: single column */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Left column: Machine info */}
            <motion.div
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 lg:mb-0 transition-colors lg:self-start">
  
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {machine.machine_name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {machine.machine_type} • {ot.ot_name}
                </p>
              </div>
  
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-slate-50 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Serial Number
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                    {machine.serial_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {machine.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {ot.ot_name}
                  </p>
                </div>
              </div>
  
              {/* Quick action buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => navigate(`/technician/ot-mismatch/${machine.id}`)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border-2 border-amber-200 dark:border-amber-800/50 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:border-amber-300 dark:hover:border-amber-700">
  
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500">
                    <MapPinOff className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm text-center">
                    Report OT Mismatch
                  </span>
                </button>
  
                <button
                  onClick={() =>
                  navigate(`/technician/machine-history/${machine.id}`)
                  }
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:shadow-md transition-all">
  
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <History className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    View History
                  </span>
                </button>
              </div>
            </motion.div>
  
            {/* Right column: Status selection */}
            <motion.div
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.1
              }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors lg:self-start">
  
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Machine Status
                </p>
                {isOTInspectionComplete && isSubmitted &&
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">
                      Locked
                    </span>
                  </div>
                }
                {wasEdited && !isOTInspectionComplete &&
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">
                      Editing
                    </span>
                  </div>
                }
              </div>
  
              {!selectedStatus && !isSubmitted &&
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-4">
                  <p className="text-xs text-blue-700 dark:text-blue-400 text-center font-medium">
                    Select a status below to record this machine's inspection
                    result
                  </p>
                </div>
              }
  
              <div className="space-y-3">
                {/* Working Properly Card */}
                <button
                  onClick={() => handleSelectStatus('Working')}
                  disabled={isOTInspectionComplete && isSubmitted}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${selectedStatus === 'Working' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'} ${isOTInspectionComplete && isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}>
  
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400`}>
  
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        Working
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Machine passed inspection
                      </p>
                    </div>
                  </div>
                </button>
  
                {/* Not Working Card */}
                <button
                  onClick={() => handleSelectStatus('Not Working')}
                  disabled={isOTInspectionComplete && isSubmitted}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${selectedStatus === 'Not Working' ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'} ${isOTInspectionComplete && isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}`}>
  
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400`}>
  
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        Not Working
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Fault recorded, do not use
                      </p>
                    </div>
                  </div>
                </button>
  
                {isOTInspectionComplete && isSubmitted &&
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Inspection completed. Contact supervisor for changes.
                    </p>
                  </div>
                }
  
                {!isOTInspectionComplete &&
                <button
                  onClick={
                  isSubmitted && !wasEdited ?
                  handleEnableEdit :
                  handleSubmitStatus
                  }
                  disabled={!selectedStatus && !isSubmitted}
                  className={`w-full font-bold py-4 rounded-xl transition-all mt-4 ${isSubmitted && !wasEdited ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700' : selectedStatus ? 'bg-health-primary text-white shadow-lg shadow-health-primary/30 hover:bg-teal-600 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}>
  
                    {isSubmitted && !wasEdited ?
                  'Edit Status' :
                  wasEdited ?
                  'Update Status' :
                  'Submit Status'}
                  </button>
                }
  
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setIsMachineListOpen(true)}
                    className="flex-1 font-bold py-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 shadow-sm transition-all">
  
                    <List className="w-5 h-5" />
                    All
                  </button>
                  <button
                    onClick={handleNextMachine}
                    disabled={!isSubmitted}
                    className={`flex-[2] font-bold py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${isSubmitted ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'}`}>
  
                    Next Machine
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
  
        <BottomNavigation role="technician" />
  
        {/* Issue Report Bottom Sheet */}
        <AnimatePresence>
          {isIssueSheetOpen &&
          <>
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
              onClick={() => setIsIssueSheetOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
  
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
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 p-6 shadow-xl max-w-[412px] mx-auto border-t border-slate-100 dark:border-slate-800">
  
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  Report Machine Issue
                </h2>
                <div className="space-y-4 mb-6">
                   {/* ... form content ... */}
                </div>
                <button
                onClick={handleSubmitIssue}
                className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95">
  
                  Submit Issue
                </button>
              </motion.div>
            </>
          }
        </AnimatePresence>
  
        {/* All Machines Bottom Sheet */}
        <AnimatePresence>
          {isMachineListOpen &&
          <>
            {/* ... bottom sheet content ... */}
          </>
          }
        </AnimatePresence>
  
        {/* Toast Notification */}
        <AnimatePresence>
          {toast.visible &&
          <motion.div
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
              y: 10
            }}
            className="fixed bottom-24 left-6 right-6 z-50 max-w-[364px] mx-auto">
  
              <div className="px-4 py-3 rounded-xl bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-white/90">{toast.message}</p>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>);
  }