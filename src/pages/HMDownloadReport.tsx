import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Machine {
    id: number;
    machine_name: string;
    machine_type: string;
    serial_number: string;
    status: string;
}

interface OT {
    id: number;
    ot_name: string;
    machines_assigned: number;
    machines?: Machine[];
    expanded?: boolean;
    loading?: boolean;
}

export function HMDownloadReport() {
    const navigate = useNavigate();
    const [ots, setOts] = useState<OT[]>([]);
    const [loading, setLoading] = useState(true);

    // Set of selected machine IDs
    const [selectedMachines, setSelectedMachines] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchOTs();
    }, []);

    const fetchOTs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/ot/list');
            if (res.data?.status) {
                setOts(res.data.data.map((ot: any) => ({ ...ot, expanded: false, machines: [], loading: false })));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch Operation Theatres');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (index: number) => {
        const newOts = [...ots];
        const ot = newOts[index];
        ot.expanded = !ot.expanded;

        // Fetch machines if expanding and not fetched yet
        if (ot.expanded && (!ot.machines || ot.machines.length === 0)) {
            try {
                ot.loading = true;
                setOts([...newOts]);
                const res = await api.get(`/api/ot/${ot.id}/machines`);
                if (res.data?.status) {
                    ot.machines = res.data.data;
                }
            } catch (error) {
                toast.error(`Failed to fetch machines for ${ot.ot_name}`);
            } finally {
                ot.loading = false;
            }
        }
        setOts([...newOts]);
    };

    const handleMachineToggle = (machineId: number) => {
        const newSelected = new Set(selectedMachines);
        if (newSelected.has(machineId)) {
            newSelected.delete(machineId);
        } else {
            newSelected.add(machineId);
        }
        setSelectedMachines(newSelected);
    };

    const handleSelectAll = (otIndex: number) => {
        const ot = ots[otIndex];
        if (!ot.machines) return;

        const newSelected = new Set(selectedMachines);
        const allSelected = ot.machines.length > 0 && ot.machines.every(m => newSelected.has(m.id));

        if (allSelected) {
            ot.machines.forEach(m => newSelected.delete(m.id));
        } else {
            ot.machines.forEach(m => newSelected.add(m.id));
        }
        setSelectedMachines(newSelected);
    };

    const handleNext = () => {
        if (selectedMachines.size === 0) {
            toast.error('Please select at least one machine');
            return;
        }
        const machineIds = Array.from(selectedMachines);
        navigate('/management/download-report-date', { state: { machineIds } });
    };

    return (
        <div
            className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24"
            style={{ paddingTop: 'var(--safe-area-top)' }}>

            {/* Header Sticky Container */}
            <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 px-5 pt-6 pb-4 border-b border-transparent">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            Download Report
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Select machines to generate report
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-5 pt-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    ots.map((ot, idx) => (
                        <div
                            key={ot.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                        >
                            {/* Card Header */}
                            <button
                                onClick={() => toggleExpand(idx)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                            {ot.ot_name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {ot.machines_assigned} machines
                                        </p>
                                    </div>
                                </div>
                                {ot.expanded ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>

                            {/* Card Body - Expanded */}
                            <AnimatePresence>
                                {ot.expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {ot.loading ? (
                                                <div className="flex justify-center py-4">
                                                    <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 pt-2">
                                                    {/* Select All */}
                                                    {(ot.machines && ot.machines.length > 0) ? (
                                                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                            <input
                                                                type="checkbox"
                                                                checked={ot.machines.every(m => selectedMachines.has(m.id))}
                                                                onChange={() => handleSelectAll(idx)}
                                                                className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                            />
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                                Select All
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-slate-500 text-center py-2">No machines found.</p>
                                                    )}

                                                    {/* Machines List */}
                                                    {ot.machines?.map((machine) => (
                                                        <div key={machine.id} className="flex items-start gap-3 py-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMachines.has(machine.id)}
                                                                onChange={() => handleMachineToggle(machine.id)}
                                                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                                                                    {machine.machine_name}
                                                                </h4>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                                    {machine.machine_type}
                                                                </p>
                                                            </div>
                                                            <div className="text-xs font-bold pt-1 uppercase">
                                                                {machine.status === 'Working' ? (
                                                                    <span className="text-emerald-500">OK</span>
                                                                ) : (
                                                                    <span className="text-rose-500">ISSUE</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>

            {/* Fixed Bottom Next Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
                <button
                    onClick={handleNext}
                    className="w-full block bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-all active:scale-95 text-center"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
