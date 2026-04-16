import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Wrench,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { BottomNavigation } from '../components/BottomNavigation';

const formatDate = (value: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatTime = (value: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export function MachineInspectionDetail() {
  const navigate = useNavigate();
  const { machineId } = useParams(); // Note: This parameter is naming inspection_id contextually in routing
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInspection();
  }, [machineId]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await api.get(
        `/api/inspection/details/${machineId}?creator_id=${user.id}`
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError("Inspection details not found.");
      }
    } catch (err) {
      console.error("Failed to load inspection details", err);
      setError("Failed to load inspection details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">Loading report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-xs">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Details Missing
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
            {error || "We couldn't find the inspection details you're looking for."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'working':
        return {
          bg: 'bg-[#F0FDFA]',
          text: 'text-[#0D9488]',
          border: 'border-[#CCFBF1]',
          dot: 'bg-[#0D9488]',
          icon: <CheckCircle2 size={14} />,
          label: 'WORKING'
        };
      case 'not working':
        return {
          bg: 'bg-[#FFF1F2]',
          text: 'text-[#E11D48]',
          border: 'border-[#FECDD3]',
          dot: 'bg-[#E11D48]',
          icon: <AlertCircle size={14} />,
          label: 'NOT WORKING'
        };
      case 'resolved':
        return {
          bg: 'bg-[#EFF6FF]',
          text: 'text-[#2563EB]',
          border: 'border-[#DBEAFE]',
          dot: 'bg-[#2563EB]',
          icon: <CheckCircle2 size={14} />,
          label: 'RESOLVED'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-500',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
          icon: <Info size={14} />,
          label: status?.toUpperCase() || 'UNKNOWN'
        };
    }
  };

  const statusStyle = getStatusConfig(data.machine_status);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pb-32 text-left">
      <div className="w-full px-6 pt-10">
        {/* Header */}
        <header className="flex items-center gap-5 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-slate-400 hover:text-slate-600 transition-all active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              Inspection Details
            </h1>
            <p className="text-[14px] text-slate-400 font-medium">
              Safety checklist report
            </p>
          </div>
        </header>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800/80 mb-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-[26px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {data.machine_name}
            </h2>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {statusStyle.icon}
              <span className="text-[10px] font-black uppercase tracking-wider">{statusStyle.label}</span>
            </div>
          </div>

          <p className="text-[16px] text-slate-400 dark:text-slate-500 font-medium mb-10">
            {data.ot_name}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] dark:bg-slate-800/40 rounded-[20px] p-4 flex items-center gap-4 border border-slate-200 dark:border-slate-700/50">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-[14px] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-none text-slate-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Date</p>
                <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{formatDate(data.inspection_time)}</p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] dark:bg-slate-800/40 rounded-[20px] p-4 flex items-center gap-4 border border-slate-200 dark:border-slate-700/50">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-[14px] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-none text-slate-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Time</p>
                <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{formatTime(data.inspection_time)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
            <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-10">
              Inspection Lifecycle
            </h3>

            <div className="relative pl-8 space-y-12">
              {/* Timeline Line */}
              <div className="absolute left-[3px] top-2 bottom-6 w-[2px] bg-[#F1F5F9] dark:bg-slate-800"></div>

              {data.lifecycle.map((item: any, index: number) => {
                let dotColor = "bg-emerald-500";
                if (item.event === "Issue Reported") dotColor = "bg-orange-500";
                if (item.event === "Resolved") dotColor = "bg-blue-500";

                return (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[32.5px] top-1.5 w-[11px] h-[11px] rounded-full ${dotColor} ring-[6px] ring-white dark:ring-slate-900 z-10 shadow-sm`}></div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-[18px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                        {item.event}
                      </h4>
                      <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                        <span>{formatDate(item.time)}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span>{formatTime(item.time)}</span>
                      </div>

                      {(item.checked_by || item.resolved_by) && (
                        <div className="flex items-center gap-2.5 mt-1 text-slate-500 dark:text-slate-400">
                          <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User size={10} className="text-slate-400" />
                          </div>
                          <p className="text-[13px] font-medium">
                            <span className="text-slate-400 font-normal">
                              {item.checked_by ? 'Checked by:' : 'Resolved by:'}
                            </span>{' '}
                            <span className="text-slate-700 dark:text-slate-200 font-bold ml-1">
                              {item.checked_by || item.resolved_by}
                            </span>
                          </p>
                        </div>
                      )}

                      {item.remarks && (
                        <div className="bg-[#F8FAFC] dark:bg-slate-800/40 rounded-[18px] px-6 py-4 mt-2 border border-slate-200 dark:border-slate-700/50">
                          <p className="text-[14px] text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
                            "{item.remarks}"
                          </p>
                        </div>
                      )}

                      {item.resolution_notes && (
                        <div className="bg-[#EFF6FF] dark:bg-blue-950/20 rounded-[24px] p-6 mt-2 border border-[#DBEAFE] dark:border-blue-900/30 relative group shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white dark:bg-blue-900/40 rounded-xl flex items-center justify-center shadow-sm">
                              <Wrench size={16} className="text-blue-600 dark:text-blue-400 transition-transform group-hover:rotate-12" />
                            </div>
                            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Resolution Notes</span>
                          </div>
                          <p className="text-[15px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                            {item.resolution_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom State Visualizer */}
        <AnimatePresence>
          {data.machine_status === "Working" && data.lifecycle.length === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-[#F0FDFA] dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#CCFBF1] dark:border-teal-900/30 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                >
                  <CheckCircle2 size={40} className="text-[#0D9488]" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-teal-500/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                All Checks Passed
              </h3>
              <p className="text-slate-400 font-medium max-w-[240px]">
                No issues were found during this inspection
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation role="technician" />
    </div>
  );
}
