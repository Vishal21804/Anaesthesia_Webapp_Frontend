import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Save, LayoutGrid, Loader, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';
import { getOTDetails, updateOT } from '../services/ot';
import { getOTMachines } from '../services/machine';
export function HMEditOT() {
  const navigate = useNavigate();
  const { id: otId } = useParams();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('General');
  const [otCode, setOtCode] = useState('');
  const [status, setStatus] = useState('active');

  const [assignedMachines, setAssignedMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [serialUpdate, setSerialUpdate] = useState('');
  const [updatingSerial, setUpdatingSerial] = useState(false);

  React.useEffect(() => {
    const fetchOT = async () => {
      try {
        setInitialLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const otIdNum = parseInt(otId || "0", 10);

        const [detailRes, machinesRes] = await Promise.all([
          getOTDetails(otIdNum, user.id),
          getOTMachines(otIdNum, user.id)
        ]);

        if (detailRes.status && detailRes.data) {
          const ot = detailRes.data;
          if (ot) {
            setName(ot.ot_name || '');
            setOtCode(ot.ot_code || ot.ot_code || '');
            setStatus(ot.status || 'active');
            setType(ot.ot_type || 'General');
          } else {
            setError("OT not found");
          }
        }

        // machinesRes from getOTMachines contains { status: boolean, data: any[] }
        setAssignedMachines(machinesRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load OT details.");
      } finally {
        setInitialLoading(false);
      }
    };
    if (otId) fetchOT();
  }, [otId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const otIdNum = parseInt(otId || "0", 10);

      const data = await updateOT(otIdNum, {
        ot_name: name,
        ot_code: otCode,
        ot_type: type,
        status: status
      }, user.id);

      if (data.status) {
        alert("OT updated successfully");
        navigate('/management/ot');
      } else {
        alert(data.message || "Failed to update OT");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Update OT failed:", err);
      alert("Server error while updating OT");
      setLoading(false);
    }
  };

  const handleUpdateSerial = async () => {
    if (!selectedMachine) return;
    setUpdatingSerial(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await api.put(`/api/machine/update/${selectedMachine.id}`, {
        serial_number: serialUpdate
      }, {
        params: { creator_id: user.id }
      });

      if (res.data?.status) {
        alert("Serial number updated");
        setAssignedMachines(prev => prev.map(m =>
          m.id === selectedMachine.id ? { ...m, serial_number: serialUpdate } : m
        ));
        setShowSerialModal(false);
      } else {
        alert(res.data?.message || "Update failed");
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update serial");
    } finally {
      setUpdatingSerial(false);
    }
  };

  const openSerialModal = (machine: any) => {
    setSelectedMachine(machine);
    setSerialUpdate(machine.serial_number || '');
    setShowSerialModal(true);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center text-left">
        <Loader className="animate-spin text-purple-600 w-8 h-8" />
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/management/ot')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Edit OT Details
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update configuration
            </p>
          </div>
        </header>

        <motion.form
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          onSubmit={handleSave}
          className="space-y-6">

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                OT Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OT Code
              </label>
              <input
                type="text"
                value={otCode}
                onChange={(e) => setOtCode(e.target.value)}
                placeholder="e.g., OT-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                OT Type
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 appearance-none">

                  <option value="General">General Surgery</option>
                  <option value="Cardiac">Cardiac</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Neuro">Neuro</option>
                  <option value="Ophthal">Ophthal</option>
                </select>
              </div>
            </div>


          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Assigned Machines
              </h2>
              <button
                type="button"
                onClick={() => navigate(`/management/ot-assign-machine/${otId}`)}
                className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider hover:text-purple-700 transition-colors">

                + ASSIGN
              </button>
            </div>

            <div className="space-y-3">
              {assignedMachines.map((machine) =>
                <div
                  key={machine.id}
                  onClick={() => openSerialModal(machine)}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm cursor-pointer hover:border-purple-500 transition-all">

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {machine.machine_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {machine.machine_type || "Machine"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                      SN: {machine.serial_number || "Not set"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSerialModal(machine);
                      }}
                      className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:text-purple-700 transition-colors">

                      Update SN
                    </button>
                  </div>
                </div>
              )}

              {assignedMachines.length === 0 &&
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No machines assigned to this OT
                  </p>
                </div>
              }
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
              <span className="animate-pulse">Saving Changes...</span> :

              <>
                Save Changes <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>

      <BottomNavigation role="management" />

      {/* Serial Update Modal */}
      <AnimatePresence>
        {showSerialModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500" />

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Update Serial Number
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Enter the physical serial number for <span className="font-bold text-slate-700 dark:text-slate-300">{selectedMachine?.machine_name}</span>.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={serialUpdate}
                    onChange={(e) => setSerialUpdate(e.target.value)}
                    placeholder="e.g. SN-2024-001"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-800 dark:text-slate-100 font-mono transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowSerialModal(false)}
                    className="flex-1 px-4 py-4 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSerial}
                    disabled={updatingSerial || !serialUpdate.trim()}
                    className="flex-1 px-4 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updatingSerial ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>);

}
