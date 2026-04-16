import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export function ChecklistHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || localStorage.getItem("user_id");

      const res = await api.get(`/api/history/machines`, {
        params: { creator_id: userId }
      });

      if (res.data.status) {
        setHistory(res.data.data || []);
      } else {
        setError("Failed to fetch history data.");
      }
    } catch (err) {
      console.error("History fetch error:", err);
      setError("An error occurred while fetching history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDateTime = (date: string) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).replace(',', ' •');
  };

  const filteredData = useMemo(() => {
    let data = history;
    if (activeFilter !== "All") {
      data = data.filter(item => item.status === activeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item =>
        (item.machine_name || '').toLowerCase().includes(query) ||
        (item.serial_number || '').toLowerCase().includes(query)
      );
    }
    return data;
  }, [history, activeFilter, searchQuery]);

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-5 pt-6">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-soft text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Inspection records • Last 7 Days
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative my-6">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-12 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft focus:ring-2 focus:ring-teal-500/20 focus:border-health-primary outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
          {["All", "Working", "Not Working", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${activeFilter === f
                ? "bg-health-primary text-white border-health-primary shadow-health-primary/30"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-health-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-rose-500 font-medium">{error}</div>
          ) : (
            <div className="space-y-4">
              {filteredData.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <AlertCircle className="w-12 h-12 text-slate-200  mb-3" />
                  <p className="text-slate-400 font-medium">No records found</p>
                </motion.div>
              ) : (
                filteredData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-soft border border-slate-50 dark:border-slate-800 relative group overflow-hidden"
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1 min-w-0 pr-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">
                          {item.machine_name}
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">
                          {item.machine_type || "Anesthesia Workstation"}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${item.status === "Working"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50"
                        : item.status === "Not Working"
                          ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50"
                          : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50"
                        }`}>
                        {item.status === "Not Working" ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-y-4 mb-6">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-slate-400">Serial Number</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.serial_number || "-"}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-slate-400">Location</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.ot_name || "-"}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-slate-400">Inspection Date</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {item.checked_at ? formatDateTime(item.checked_at) : "-"}
                        </span>
                      </div>
                    </div>

                    {/* Footer - Checked by & View Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="text-slate-400">Checked by:</span>{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {item.checked_by || "-"}
                        </span>
                      </p>
                      <button
                        onClick={() => navigate(`/technician/inspection/${item.id}`)}
                        className="flex items-center gap-1 text-health-primary font-bold text-sm hover:opacity-80 transition-opacity"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      <BottomNavigation role="technician" />
    </div>
  );
}
