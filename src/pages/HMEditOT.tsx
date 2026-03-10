import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  FileText,
  Save,
  LayoutGrid,
  Activity,
  MinusCircle,
  Check } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockOTs, mockMachines } from '../data/mockData';
// Mock machine types for the assign sheet
const availableMachineTypes = [
{
  id: 'mt-1',
  name: 'Anaesthesia Drug'
},
{
  id: 'mt-2',
  name: 'Dragon'
},
{
  id: 'mt-3',
  name: 'Oxygen Pipe'
},
{
  id: 'mt-4',
  name: 'Suction Machine'
},
{
  id: 'mt-5',
  name: 'Pulse Oximeter'
}];

export function HMEditOT() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const ot = mockOTs.find((o) => o.id === otId);
  const [loading, setLoading] = useState(false);
  // Form state
  const [name, setName] = useState(ot?.name || '');
  const [type, setType] = useState('General');
  const [status, setStatus] = useState('active');
  const [otCode, setOtCode] = useState('');
  const [locationFloor, setLocationFloor] = useState('');
  // Get machines assigned to this OT
  const initialAssignedMachines = mockMachines.filter(
    (m) => m.assignedOTIds?.includes(otId || '') || m.otId === otId
  );
  const [assignedMachines, setAssignedMachines] = useState(
    initialAssignedMachines
  );
  // Bottom sheet state
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [selectedMachineTypes, setSelectedMachineTypes] = useState<string[]>([]);
  const [isSerialNumberSheetOpen, setIsSerialNumberSheetOpen] = useState(false);
  const [currentMachineToAssign, setCurrentMachineToAssign] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [machineQueue, setMachineQueue] = useState<
    {
      id: string;
      name: string;
    }[]>(
    []);
  const handleRemoveMachine = (machineId: string) => {
    setAssignedMachines((prev) => prev.filter((m) => m.id !== machineId));
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/management/management-page');
    }, 1500);
  };
  const toggleMachineTypeSelection = (machineTypeId: string) => {
    setSelectedMachineTypes((prev) =>
    prev.includes(machineTypeId) ?
    prev.filter((id) => id !== machineTypeId) :
    [...prev, machineTypeId]
    );
  };
  const handleAssignSelectedMachines = () => {
    if (selectedMachineTypes.length === 0) return;
    // Get the selected machine types
    const selectedMachines = availableMachineTypes.filter((mt) =>
    selectedMachineTypes.includes(mt.id)
    );
    // Set up the queue for serial number entry
    setMachineQueue(selectedMachines);
    setCurrentMachineToAssign(selectedMachines[0]);
    setSerialNumber('');
    setIsAssignSheetOpen(false);
    setIsSerialNumberSheetOpen(true);
  };
  const handleAssignMachineWithSerial = () => {
    if (!currentMachineToAssign || !serialNumber.trim()) return;
    // Add the machine to assigned machines
    const newMachine = {
      id: `new-${Date.now()}`,
      name: currentMachineToAssign.name,
      model: currentMachineToAssign.name,
      serialNumber: serialNumber,
      otId: otId || '',
      assignedOTIds: [otId || ''],
      status: 'working' as const,
      lastChecked: 'Just now',
      nextMaintenance: '2024-12-01'
    };
    setAssignedMachines((prev) => [...prev, newMachine]);
    // Move to next machine in queue or close
    const remainingQueue = machineQueue.slice(1);
    if (remainingQueue.length > 0) {
      setMachineQueue(remainingQueue);
      setCurrentMachineToAssign(remainingQueue[0]);
      setSerialNumber('');
    } else {
      setIsSerialNumberSheetOpen(false);
      setCurrentMachineToAssign(null);
      setMachineQueue([]);
      setSelectedMachineTypes([]);
      setSerialNumber('');
    }
  };
  const handleAddNewMachine = () => {
    setIsAssignSheetOpen(false);
    navigate('/management/add-machine');
  };
  if (!ot) return null;
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location/Floor
              </label>
              <input
                type="text"
                value={locationFloor}
                onChange={(e) => setLocationFloor(e.target.value)}
                placeholder="e.g., 2nd Floor, Block A"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Additional notes..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none" />

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
                onClick={() => setIsAssignSheetOpen(true)}
                className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider hover:text-purple-700 transition-colors">

                + ASSIGN
              </button>
            </div>

            <div className="space-y-3">
              {assignedMachines.map((machine) =>
              <div
                key={machine.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {machine.model}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                      SN: {machine.serialNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                    type="button"
                    onClick={() => navigate(`/hm-edit-machine/${machine.id}`)}
                    className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:text-purple-700 transition-colors">

                      Edit
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

      {/* Machine Selection Bottom Sheet (Step 1) */}
      <AnimatePresence>
        {isAssignSheetOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsAssignSheetOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <motion.div
            initial={{
              y: '100%'
            }}
            animate={{
              y: 0
            }}
            exit={{
              y: '100%'
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 shadow-xl max-w-[412px] mx-auto border-t border-slate-100 dark:border-slate-800">

              <div className="p-6">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center mb-6">
                  Assign Machine
                </h2>

                {/* Machine List */}
                <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6">
                  {availableMachineTypes.map((machineType) => {
                  const isSelected = selectedMachineTypes.includes(
                    machineType.id
                  );
                  return (
                    <button
                      key={machineType.id}
                      type="button"
                      onClick={() =>
                      toggleMachineTypeSelection(machineType.id)
                      }
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>

                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="flex-1 text-left font-medium text-slate-800 dark:text-slate-100">
                          {machineType.name}
                        </span>
                        {isSelected &&
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                      }
                      </button>);

                })}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                  type="button"
                  onClick={handleAssignSelectedMachines}
                  disabled={selectedMachineTypes.length === 0}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${selectedMachineTypes.length > 0 ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}>

                    ASSIGN SELECTED MACHINES
                  </button>
                  <button
                  type="button"
                  onClick={handleAddNewMachine}
                  className="w-full py-4 rounded-xl font-bold text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all active:scale-95">

                    + ADD NEW MACHINE
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Serial Number Entry Bottom Sheet (Step 2) */}
      <AnimatePresence>
        {isSerialNumberSheetOpen && currentMachineToAssign &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => {
              setIsSerialNumberSheetOpen(false);
              setCurrentMachineToAssign(null);
              setMachineQueue([]);
              setSelectedMachineTypes([]);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <motion.div
            initial={{
              y: '100%'
            }}
            animate={{
              y: 0
            }}
            exit={{
              y: '100%'
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 shadow-xl max-w-[412px] mx-auto border-t border-slate-100 dark:border-slate-800">

              <div className="p-6">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Assign {currentMachineToAssign.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Enter serial number for {currentMachineToAssign.name}
                </p>

                {/* Serial Number Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. SN-2024-001"
                  className="w-full px-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

                </div>

                {/* Queue indicator */}
                {machineQueue.length > 1 &&
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center">
                    {machineQueue.length - 1} more machine
                    {machineQueue.length > 2 ? 's' : ''} to assign
                  </p>
              }

                {/* Assign Button */}
                <button
                type="button"
                onClick={handleAssignMachineWithSerial}
                disabled={!serialNumber.trim()}
                className={`w-full py-4 rounded-xl font-bold transition-all ${serialNumber.trim() ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}>

                  Assign Machine
                </button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}