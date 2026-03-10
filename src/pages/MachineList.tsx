import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Filter, Loader, AlertCircle } from "lucide-react";
import { MachineCard } from "../components/MachineCard";
import { BottomNavigation } from "../components/BottomNavigation";
import { getMachineList } from "../services/machine";
import { getOtList } from "../services/ot";
import { Machine, OT } from "../types";
import { motion } from "framer-motion";

export function MachineList() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [ot, setOt] = useState<OT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ots, allMachines] = await Promise.all([
          getOtList(),
          getMachineList(),
        ]);

        const currentOtId = parseInt(otId || "", 10);
        const currentOt = ots.find((o: OT) => o.id === currentOtId);

        if (currentOt) {
          setOt(currentOt);
          const machinesForOt = allMachines.filter((m: Machine) =>
            m.assigned_ots.includes(currentOt.id),
          );
          setMachines(machinesForOt);
        } else {
          setError("OT not found.");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (otId) {
      fetchData();
    }
  }, [otId]);

  // This logic remains as it is, but might need rework with checklist APIs
  const getMachineCheckStatus = (machineId: number) => {
    const checklistData = sessionStorage.getItem(`checklist-${machineId}`);
    if (!checklistData) return "pending";
    try {
      const items = JSON.parse(checklistData);
      const allChecked = items.every(
        (item: any) => item.status !== "not-checked",
      );
      return allChecked ? "completed" : "pending";
    } catch {
      return "pending";
    }
  };

  const filteredMachines = machines.filter((m) =>
    m.machine_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const completedMachinesCount = filteredMachines.filter(
    (m) => getMachineCheckStatus(m.id) === "completed",
  ).length;

  const progressPercentage =
    filteredMachines.length > 0
      ? (completedMachinesCount / filteredMachines.length) * 100
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-8 h-8 text-health-primary animate-spin" />
        <p className="ml-2 text-slate-500">Loading Machines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <AlertCircle className="w-12 h-12 text-red-500" />
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
        paddingTop: "var(--safe-area-top)",
        paddingBottom: "calc(var(--safe-area-bottom) + 8rem)",
      }}
    >
      <div className="max-w-md lg:max-w-6xl mx-auto px-6 lg:px-8 pt-8">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {ot?.ot_name || "Machines"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredMachines.length} Machines Available
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-health-primary hover:border-health-primary transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Progress Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
              Progress
            </h3>
            <span className="font-bold text-health-primary dark:text-teal-400">
              {completedMachinesCount} of {filteredMachines.length}
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-health-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </motion.div>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          {searchQuery ? "Search Results" : "Pending Machines"}
        </h2>

        {/* Machine cards — 1 col full width */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMachines.length > 0 ? (
            filteredMachines.map((machine, index) => (
              <motion.div
                key={machine.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.07 }}
              >
                <MachineCard
                  machine={machine}
                  role="technician"
                  onClick={() => navigate(`/technician/machine/${machine.id}`)}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No machines found.</p>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation role="technician" />
    </div>
  );
}
