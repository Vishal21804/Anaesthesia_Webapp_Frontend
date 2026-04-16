import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPinOff,
  AlertTriangle,
  CheckCircle,
  FileText } from
'lucide-react';
import { motion } from 'framer-motion';
import { mockMachines, mockOTs } from '../data/mockData';
import { useAppData } from '../contexts/AppDataContext';
import { ConfigurationWarningReason } from '../types';
const MISMATCH_REASONS: Array<{
  value: ConfigurationWarningReason;
  label: string;
  description: string;
}> = [
{
  value: 'machine_not_present',
  label: 'Machine Not Present',
  description: 'Machine is not physically located in this OT'
},
{
  value: 'wrong_ot_assignment',
  label: 'Wrong OT Assignment',
  description: 'Machine is assigned to incorrect operation theatre'
},
{
  value: 'duplicate_machine',
  label: 'Duplicate Machine',
  description: 'This machine entry appears to be a duplicate'
}];

export function OTMismatchReport() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { addConfigWarning, addNotification, addAuditEntry } = useAppData();
  const machine = mockMachines.find((m) => m.id === machineId);
  const currentOT = mockOTs.find((ot) => ot.id === machine?.otId);
  const [selectedReason, setSelectedReason] =
  useState<ConfigurationWarningReason | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  if (!machine) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-slate-400  mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Machine Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-health-primary text-white font-bold py-3 px-6 rounded-xl">

            Go Back
          </button>
        </div>
      </div>);

  }
  const handleSubmit = () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      // Add configuration warning
      const warning = addConfigWarning({
        machineId: machine.id,
        machineName: machine.name,
        serialNumber: machine.serialNumber,
        reportedOT: currentOT?.name || machine.otId.toUpperCase(),
        reason: selectedReason,
        notes: notes.trim() || undefined,
        reportedBy: 'Alex Taylor' // In real app, get from auth context
      });
      // Add notification for HM
      addNotification({
        type: 'config_warning',
        title: 'OT Mismatch Reported',
        message: `${machine.name} - ${MISMATCH_REASONS.find((r) => r.value === selectedReason)?.label}`,
        targetRole: 'management',
        relatedId: warning.id,
        relatedType: 'config_warning'
      });
      // Add audit entry
      addAuditEntry({
        action: 'config_warning_reported',
        performedBy: 'Alex Taylor',
        performedByRole: 'technician',
        targetType: 'config_warning',
        targetId: warning.id,
        targetName: machine.name,
        details: MISMATCH_REASONS.find((r) => r.value === selectedReason)?.
        label
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };
  if (isSubmitted) {
    return (
      <div
        className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors"
        style={{
          paddingTop: 'var(--safe-area-top)',
          paddingBottom: 'var(--safe-area-bottom)'
        }}>

        <motion.div
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          transition={{
            type: 'spring',
            duration: 0.6
          }}
          className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">

          <CheckCircle className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">

          Report Submitted
        </motion.h1>

        <motion.p
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">

          Your OT mismatch report has been sent to Hospital Management for
          review.
        </motion.p>

        <motion.p
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          className="text-sm text-slate-500 dark:text-slate-500 mb-8">

          This does not affect checklist or compliance status.
        </motion.p>

        <motion.button
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.5
          }}
          onClick={() => navigate(`/technician/machine/${machine.id}`)}
          className="bg-health-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95">

          Back to Machine Details
        </motion.button>
      </div>);

  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      <div className="max-w-md  px-6 pt-8 pb-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Report OT Mismatch
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configuration issue only
            </p>
          </div>
        </header>

        {/* Warning Banner */}
        <motion.div
          initial={{
            y: 10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 mb-6">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPinOff className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">
                Configuration Warning Only
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
                Use this form only for location/assignment issues. Machine
                failures must be reported through the safety checklist.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Machine Info (Read-only) */}
        <motion.div
          initial={{
            y: 10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 mb-6">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Machine Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Machine Name
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {machine.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Serial Number
              </span>
              <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100">
                {machine.serialNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Current OT
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {currentOT?.name || machine.otId.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Reason Selection */}
        <motion.div
          initial={{
            y: 10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="mb-6">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Select Reason *
          </h3>
          <div className="space-y-3">
            {MISMATCH_REASONS.map((reason) =>
            <button
              key={reason.value}
              onClick={() => setSelectedReason(reason.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedReason === reason.value ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-600' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'}`}>

                <div className="flex items-center gap-3">
                  <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedReason === reason.value ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-slate-600'}`}>

                    {selectedReason === reason.value &&
                  <div className="w-2 h-2 rounded-full bg-white" />
                  }
                  </div>
                  <div>
                    <p
                    className={`font-bold text-sm ${selectedReason === reason.value ? 'text-amber-800 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}`}>

                      {reason.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>

        {/* Optional Notes */}
        <motion.div
          initial={{
            y: 10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="mb-8">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Additional Notes (Optional)
          </h3>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional context..."
              rows={3}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none transition-colors" />

          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{
            y: 10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          onClick={handleSubmit}
          disabled={!selectedReason || isSubmitting}
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${selectedReason && !isSubmitting ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}>

          {isSubmitting ?
          <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </> :

          <>
              <MapPinOff className="w-5 h-5" />
              Submit Report to Management
            </>
          }
        </motion.button>

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
          This report will be sent to Hospital Management only.
        </p>
      </div>
    </div>);

}
