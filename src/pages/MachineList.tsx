import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader,
    Search,
    AlertCircle
} from 'lucide-react';
import { BottomNavigation } from "../components/BottomNavigation";
import { getChecklistMachines } from "../services/checklist";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const getRelativeTime = (dateString: string) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

const MachineListCard = ({ machine, isCompleted, onClick }: any) => {
  return (
    <div
      onClick={!isCompleted ? onClick : undefined}
      className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4 transition-all ${!isCompleted ? 'active:scale-[0.98] cursor-pointer hover:shadow-md' : 'opacity-70 pointer-events-none'}`}
    >
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-2 text-base">
            {machine.machine_name || machine.name}
          </h3>

          {/* Badge / Arrow toggle based on completion */}
          {isCompleted ? (
            (machine.status?.toLowerCase() === "working" || machine.status?.toLowerCase() === "checked") ? (
              <span className="text-[12px] font-[600] px-[10px] py-[4px] rounded-[20px] bg-[#e6f7ef] text-[#18a957]">
                WORKING
              </span>
            ) : (machine.status?.toLowerCase() === "not_working" || machine.status?.toLowerCase() === "not working" || machine.status?.toLowerCase() === "broken") ? (
              <span className="text-[12px] font-[600] px-[10px] py-[4px] rounded-[20px] bg-[#fdeaea] text-[#e53935]">
                NOT WORKING
              </span>
            ) : null
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <p className="text-xs text-slate-400 font-medium">
            {machine.machine_type || 'Anesthesia Workstation'}
          </p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            SN: {machine.serial_number}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <Loader className="w-3 h-3" />
          <span>Last checked: {getRelativeTime(machine.last_checked)}</span>
        </div>
      </div>
    </div>
  );
};

export function MachineList() {
  const navigate = useNavigate();
  const { otId } = useParams();

  const [pendingMachines, setPendingMachines] = useState<any[]>([]);
  const [completedMachines, setCompletedMachines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [otName, setOtName] = useState<string>("Machines");



  useEffect(() => {

    const fetchMachines = async () => {
      try {
        setLoading(true);

        const response = await getChecklistMachines(user.id, Number(otId));

        const pending = response?.pending ?? [];
        const completed = response?.completed ?? [];

        setPendingMachines(pending);
        setCompletedMachines(completed);

        // Set OT name
        if (pending.length > 0 && pending[0].ot_name) {
          setOtName(pending[0].ot_name);
        } else if (completed.length > 0 && completed[0].ot_name) {
          setOtName(completed[0].ot_name);
        }

      } catch (err) {
        console.error("Machine fetch error:", err);
        setError("Failed to fetch machines.");
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [otId]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-10 h-10 text-health-primary animate-spin mb-4" />
        <p className="text-slate-500">Loading machines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="mt-4 text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-health-primary text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

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
              {otName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {totalMachines} Machines Available
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

        {totalMachines === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 font-medium">No machines assigned to this OT</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* PENDING MACHINES FIRST */}
            {filteredPending.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                  Pending Machines
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

            {/* COMPLETED MACHINES SECOND */}
            {filteredCompleted.length > 0 && (
              <div className={filteredPending.length > 0 ? "pt-2" : ""}>
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

          </div>
        )}
      </div>

      <BottomNavigation role="technician" />
    </div>
  );
}
