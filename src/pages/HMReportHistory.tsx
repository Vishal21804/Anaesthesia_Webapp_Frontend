import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { getReportHistory } from '../services/machine';
// Mock Data Structure matching ChecklistHistory style


export function HMReportHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await getReportHistory(user.id);
        console.log("History Data:", response?.data);
        setHistory(response?.data || []);
      } catch (err) {
        setError('Failed to fetch report history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formattedReports = useMemo(() => {
    if (!Array.isArray(history)) {
      return [];
    }

    return history.map((item) => {
      return {
        id: item.inspection_id,
        machineId: item.machine_id,
        machineName: item.machine_name || "Unknown Machine",
        serialNumber: item.serial_number || "N/A",

        date: new Date(item.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),

        time: new Date(item.date).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit"
        }),

        status:
          item.status === "Working"
            ? "working"
            : item.status === "Not Working"
              ? "issues"
              : "resolved",

        location: item.ot_name,
        checkedBy: item.checked_by
      };
    });
  }, [history]);

  const filteredReports = useMemo(() => {
    return formattedReports.filter((r) =>
      r.machineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [formattedReports, searchQuery]);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide text-left">
            <CheckCircle className="w-3.5 h-3.5" />
            Working
          </div>);

      case 'issues':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wide text-left">
            <AlertCircle className="w-3.5 h-3.5" />
            Not Working
          </div>);

      case 'resolved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wide text-left">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </div>);

      default:
        return null;
    }
  };
  const getBorderColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'border-emerald-100 dark:border-emerald-900/30';
      case 'issues':
        return 'border-rose-100 dark:border-rose-900/30';
      case 'resolved':
        return 'border-blue-100 dark:border-blue-900/30';
      default:
        return 'border-slate-100 dark:border-slate-700';
    }
  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Report History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Audit & Usage Logs
            </p>
          </div>
          <button
            onClick={() => navigate('/management/download-report')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:text-purple-600 transition-colors">
            <Download className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

        </div>


        {/* Report List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredReports.length === 0 ?
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
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                    No reports found
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting your search
                  </p>
                </motion.div> :

                filteredReports.map((report, index) =>
                  <motion.div
                    key={report.id || `${report.machineId}-${index}`}
                    layout
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
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${getBorderColor(report.status)}`}
                    onClick={() => navigate(`/inspection-details/${report.id}`)}>

                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                          {report.machineName}
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          S/N: {report.serialNumber}
                        </p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Date
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {report.date} • {report.time}
                        </span>
                      </div>
                      {report.location &&
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Location
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {report.location}
                          </span>
                        </div>
                      }
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Checked by:{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {report.checkedBy}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                )
              }
            </AnimatePresence>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
