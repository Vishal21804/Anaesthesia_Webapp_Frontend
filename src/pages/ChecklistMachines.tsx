import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Loader,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { getChecklistMachines } from '../services/checklist';

// Custom Machine Card Component
const MachineListCard = ({ machine, isCompleted, onClick }: any) => {
    return (
        <div
            onClick={!isCompleted ? onClick : undefined}
            className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4 transition-all ${!isCompleted ? 'active:scale-[0.98] cursor-pointer hover:shadow-md' : 'opacity-80 cursor-not-allowed'}`}
        >

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-2 text-base">
                        {machine.machine_name || machine.name}
                    </h3>

                    {isCompleted && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide flex-shrink-0 ${machine.status?.toLowerCase() === 'working' || machine.status?.toLowerCase() === 'checked'
                            ? 'text-emerald-600 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'text-rose-600 border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                            }`}>
                            {(machine.status === 'Checked' ? 'Working' : machine.status) || 'Working'}
                        </span>
                    )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                    {machine.machine_type || 'Anesthesia Workstation'} • {machine.ot_name}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Loader className="w-3.5 h-3.5" />
                    <span>Last checked : {machine.last_checked ? new Date(machine.last_checked).toLocaleString() : 'Never checked'}</span>
                </div>
            </div>
        </div>
    );
};

export function ChecklistMachines() {
    const navigate = useNavigate();
    const { otId } = useParams();

    const [pendingMachines, setPendingMachines] = useState<any[]>([]);
    const [completedMachines, setCompletedMachines] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadMachines();
    }, [otId]);

    const loadMachines = async () => {
        try {
            setLoading(true);
            const res = await getChecklistMachines(user.id, Number(otId));

            const pending = (res.pending || []).map((m: any) => ({ ...m, isCompleted: false }));
            const completed = (res.completed || []).map((m: any) => ({ ...m, isCompleted: true }));

            setPendingMachines(pending);
            setCompletedMachines(completed);

        } catch (err) {
            console.error("Machine fetch failed", err);
            setPendingMachines([]);
            setCompletedMachines([]);
        } finally {
            setLoading(false);
        }
    };

    const totalMachines = pendingMachines.length + completedMachines.length;
    const completedCount = completedMachines.length;
    const progressPercent = totalMachines > 0 ? (completedCount / totalMachines) * 100 : 0;

    const filteredPending = pendingMachines.filter(m =>
        (m.machine_name || m.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCompleted = completedMachines.filter(m =>
        (m.machine_name || m.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
            style={{
                paddingTop: 'var(--safe-area-top)',
                paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
            }}>

            <div className="max-w-md  px-6 pt-8">
                {/* Header */}
                <header className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Assign
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {totalMachines} Machines
                        </p>
                    </div>
                </header>

                <div className="relative mb-6 text-slate-400">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search machines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-health-primary/20 focus:border-health-primary transition-all shadow-sm"
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-slate-800 dark:text-slate-100">Progress</h2>
                        <span className="font-bold text-health-primary">
                            {completedCount} of {totalMachines} machines
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-health-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 text-health-primary animate-spin mb-4" />
                        <p className="text-slate-500">Loading machines...</p>
                    </div>
                ) : totalMachines === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-slate-500 font-medium">No machines assigned to this OT</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredCompleted.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                                    Completed Machines
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {filteredCompleted.map((machine, index) => (
                                        <motion.div
                                            key={`completed-${machine.id}`}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}>
                                            <MachineListCard
                                                machine={machine}
                                                isCompleted={true}
                                                onClick={() => { }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredPending.length > 0 && (
                            <div className={filteredCompleted.length > 0 ? "pt-2" : ""}>
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                                    {filteredCompleted.length > 0 ? "Pending Machines" : "Machines Available"}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {filteredPending.map((machine, index) => (
                                        <motion.div
                                            key={`pending-${machine.id}`}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}>
                                            <MachineListCard
                                                machine={machine}
                                                isCompleted={false}
                                                onClick={() => navigate(`/technician/inspect/${otId}/${machine.id}`)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNavigation role="technician" />
        </div>
    );
}
