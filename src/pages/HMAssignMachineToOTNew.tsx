import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Search, Filter, Loader } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
// No machine service needed as we use api directly
import api from '../services/api';
import { toast } from 'react-hot-toast';
export function HMAssignMachineToOTNew() {
  const navigate = useNavigate();
  const { otId: id } = useParams();
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serial prompt states
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [assignQueue, setAssignQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [serial, setSerial] = useState("");

  React.useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await api.get('/api/machine/templates', {
          params: { creator_id: user.id }
        });
        setMachines(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch machines.');
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  const filteredMachines = React.useMemo(() => {
    if (!Array.isArray(machines)) return [];
    return machines.filter(
      (m: any) =>
      ((m.machine_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.serial_number || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [machines, searchQuery]);
  const toggleSelection = (id: string) => {
    setSelectedMachineIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };
  const startAssignment = () => {
    setAssignQueue(selectedMachineIds);
    setCurrentIndex(0);
    setSerial("");
    setShowSerialModal(true);
  };

  const handleAssign = async () => {
    if (!serial || serial.trim() === "") {
      toast.error("Serial number is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const templateId = assignQueue[currentIndex];

      await api.post(`/api/machine/assign`, null, {
        params: {
          creator_id: user.id,
          ot_id: Number(id),
          template_id: templateId,
          serial_number: serial.trim()
        }
      });

      // next item
      if (currentIndex < assignQueue.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSerial("");
        setIsSubmitting(false);
      } else {
        toast.success("All machines assigned successfully");
        setShowSerialModal(false);
        setAssignQueue([]);
        setSelectedMachineIds([]);
        navigate(`/management/ot`);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Assign failed";

      const errorStr = typeof message === 'string' ? message : "Assign failed";
      setError(errorStr);
      toast.error(errorStr);
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Assign Machines
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select machines to add to OT
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

          </div>
          <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-600 hover:border-purple-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Machine List with Checkboxes */}
        <div className="space-y-3 mb-24">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-left border border-red-100 mb-4">
              <p className="text-sm font-bold">{typeof error === "string" ? error : "Something went wrong"}</p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            filteredMachines.map((machine, index) => {
              const machineIdStr = machine.id.toString();
              const isSelected = selectedMachineIds.includes(machineIdStr);
              return (
                <motion.button
                  key={machineIdStr}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleSelection(machineIdStr)}
                  className={`w-full text-left rounded-2xl p-4 border transition-all relative overflow-hidden ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-1 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300 dark:border-slate-600'}`}>

                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">
                        {machine.machine_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {machine.machine_type || "Machine"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                          {machine.serial_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>);
            })
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md  z-20 lg:left-72 mx-auto">
          <button
            onClick={startAssignment}
            disabled={selectedMachineIds.length === 0 || isSubmitting}
            className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-start px-8 gap-2 transition-all ${selectedMachineIds.length > 0 ? 'bg-purple-600 text-white shadow-purple-600/30 hover:bg-purple-700 active:scale-95' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}>

            {isSubmitting ?
              <span className="animate-pulse">Processing...</span> :

              `Assign ${selectedMachineIds.length} Machine${selectedMachineIds.length !== 1 ? 's' : ''}`
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSerialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 flex flex-col shadow-2xl"
            >
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Check className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold text-left mb-2 text-slate-800 dark:text-slate-100">
                Enter Serial Number
              </h2>
              <p className="text-left text-sm text-slate-500 mb-8">
                Machine {currentIndex + 1} of {assignQueue.length}:<br />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {machines.find(m => m.id.toString() === assignQueue[currentIndex])?.machine_name}
                </span>
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Enter Serial Number..."
                    autoFocus
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-800 dark:text-slate-100 font-mono text-left"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleAssign}
                    disabled={isSubmitting || !serial.trim()}
                    className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-start px-6 gap-2 shadow-lg ${serial.trim() && !isSubmitting
                      ? "bg-purple-600 text-white shadow-purple-600/30 hover:bg-purple-700 active:scale-95"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    {isSubmitting ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      "Assign Machine"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (!isSubmitting) {
                        setShowSerialModal(false);
                        setAssignQueue([]);
                        setCurrentIndex(0);
                      }
                    }}
                    className="w-full py-2 px-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors text-left"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation role="management" />
    </div>);

}
