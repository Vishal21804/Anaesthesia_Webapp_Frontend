import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Wrench, Save, Layers, Trash2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { updateMachineTemplate } from '../services/machine';
import api from '../services/api';
export function HMEditMachine() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Form state
  const [machineName, setMachineName] = useState('');
  const [machineType, setMachineType] = useState('');
  const [machineTypes, setMachineTypes] = useState<any[]>([]);


  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const creator = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await api.get('/api/machine/types', { params: { creator_id: creator.id } });
        if (res.data?.status) setMachineTypes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        setIsLoading(true);
        // 1. Try to get from location state
        let machine = location.state?.machine;

        // 2. Fallback to fetching templates list and finding by ID
        if (!machine && id) {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          const res = await api.get('/api/machine/templates', {
            params: { creator_id: user.id }
          });
          const list = res.data?.data || [];
          machine = list.find((m: any) => m.id.toString() === id);
        }

        if (machine) {
          setMachineName(machine.machine_name || machine.name || '');
          setMachineType(String(machine.machine_type_id || ''));
        } else {
          setError("Machine template not found.");
        }
      } catch (err: any) {
        setError("Failed to load machine details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachine();
  }, [id, location.state]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const machineIdNum = parseInt(id || "0", 10);
      await updateMachineTemplate(machineIdNum, {
        machine_name: machineName,
        machine_type_id: Number(machineType)
      }, user.id);
      navigate('/management/machines');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update machine. Please try again.");
      setLoading(false);
    }
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      // In a real app, you would call an API or context method here
      navigate('/management/machines');
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center text-left">
        <Loader className="animate-spin text-purple-600 w-8 h-8" />
      </div>);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/management/machines')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg">
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
                Edit Machine Template
              </h1>
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
                    <option key={type.id} value={type.id}>
                      {type.type_name}
                    </option>
                  )}
                </select>
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