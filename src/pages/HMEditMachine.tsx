import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wrench, Hash, Save, Layers, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines } from '../data/mockData';
export function HMEditMachine() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Form state
  const [machineName, setMachineName] = useState('');
  const [machineType, setMachineType] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const machineTypes = [
  {
    value: 'anesthesia',
    label: 'Anesthesia Workstation'
  },
  {
    value: 'monitor',
    label: 'Patient Monitor'
  },
  {
    value: 'ventilator',
    label: 'Ventilator'
  },
  {
    value: 'defibrillator',
    label: 'Defibrillator'
  },
  {
    value: 'pump',
    label: 'Infusion Pump'
  }];

  useEffect(() => {
    // Load machine data from mockMachines
    const machine = mockMachines.find((m) => m.id === id);
    if (machine) {
      setMachineName(machine.name);
      setMachineType(
        machine.model.toLowerCase().includes('anesthesia') ?
        'anesthesia' :
        machine.model.toLowerCase().includes('monitor') ?
        'monitor' :
        machine.model.toLowerCase().includes('ventilator') ?
        'ventilator' :
        machine.model.toLowerCase().includes('defibrillator') ?
        'defibrillator' :
        'pump'
      );
      setSerialNumber(machine.serialNumber);
    }
    setIsLoading(false);
  }, [id]);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/management/machines');
    }, 1500);
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      // In a real app, you would call an API or context method here
      navigate('/management/machines');
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>);

  }
  const machine = mockMachines.find((m) => m.id === id);
  if (!machine) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Machine not found</p>
      </div>);

  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/management/machines')}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Edit Machine
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update equipment details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-full shadow-sm text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            aria-label="Delete machine">

            <Trash2 className="w-5 h-5" />
          </button>
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
            {/* Machine Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Machine Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  placeholder="e.g. Drager Fabius GS"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            {/* Machine Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Machine Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={machineType}
                  onChange={(e) => setMachineType(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 appearance-none"
                  required>

                  <option value="">Select Type</option>
                  {machineTypes.map((type) =>
                  <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Serial Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. SN-2024-001"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-mono"
                  required />

              </div>
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
    </div>);

}