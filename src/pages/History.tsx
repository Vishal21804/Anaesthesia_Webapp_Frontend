import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Loader,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';

export function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/history/machines`, {
                    params: { creator_id: user.id }
                });
                setHistory(res.data.data || []);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user.id]);

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
            data = data.filter(item => item.status.toLowerCase() === activeFilter.toLowerCase());
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                (item.machine_name || '').toLowerCase().includes(query) ||
                (item.serial_number || '').toLowerCase().includes(query) ||
                (item.ot_name || '').toLowerCase().includes(query)
            );
        }
        return data;
    }, [history, activeFilter, searchQuery]);

    return (
        <div
            className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors"
            style={{
                paddingTop: 'var(--safe-area-top)',
                paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
            }}
        >
            <div className="w-full px-6 pt-8">
                {/* Header */}
                <header className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 transition-all active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">History</h1>
                        <p className="text-sm text-slate-400 font-medium">Inspection records • Last 7 Days</p>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 dark:text-slate-200 font-medium"
                    />
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-6">
                    {["All", "Working", "Not Working", "Resolved"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${activeFilter === f
                                ? "bg-[#14B8A6] text-white border-[#14B8A6] shadow-sm"
                                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 shadow-sm"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 flex-col items-center">
                        <Loader className="w-10 h-10 text-teal-500 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium animate-pulse text-sm">Retrieving archive...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredData.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden p-7"
                                >
                                    {/* Card Header: Product & Status */}
                                    <div className="flex justify-between items-start mb-1">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                            {item.machine_name}
                                        </h2>

                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${item.status.toLowerCase() === 'working'
                                            ? "bg-[#F0FDFA] text-[#0D9488] border-[#CCFBF1] dark:bg-teal-950/20 dark:border-teal-900/50"
                                            : item.status.toLowerCase() === 'resolved'
                                                ? "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE] dark:bg-blue-950/20 dark:border-blue-900/50"
                                                : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50"
                                            }`}>
                                            {item.status.toLowerCase() === 'working' || item.status.toLowerCase() === 'resolved' ? (
                                                <CheckCircle size={14} className="stroke-[2.5px]" />
                                            ) : (
                                                <AlertCircle size={14} className="stroke-[2.5px]" />
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-wider">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Machine Subtype */}
                                    <p className="text-sm font-medium text-slate-400 mb-8">
                                        Anesthesia Workstation
                                    </p>

                                    {/* Data Rows */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-300 dark:text-slate-500">Serial Number</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                                {item.serial_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-300 dark:text-slate-500">Location</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                                {item.ot_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-300 dark:text-slate-500">Inspection Date</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                                {formatDateTime(item.checked_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-slate-300 dark:text-slate-500 font-semibold">
                                            Checked by: <span className="text-slate-700 dark:text-slate-200 font-bold">{item.checked_by}</span>
                                        </p>
                                        <button
                                            onClick={() => navigate(`/technician/inspection/${item.id}`)}
                                            className="flex items-center gap-1 text-[#14B8A6] font-bold text-sm hover:opacity-80 transition-opacity"
                                        >
                                            View Details
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {!loading && filteredData.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300  mb-4 border border-slate-100 dark:border-slate-700 mx-auto">
                                    <Clock size={32} />
                                </div>
                                <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg tracking-tight">No historical data</h3>
                                <p className="text-slate-400 text-xs mt-1 px-10">Archive is currently empty or no results match your filter.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNavigation role="technician" />
        </div>
    );
}
