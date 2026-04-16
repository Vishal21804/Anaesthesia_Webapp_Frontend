import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Save, Layers } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { addMachine } from '../services/machine';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMAddMachine() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [machineTypes, setMachineTypes] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const creator = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await api.get('/api/machine/types', { params: { creator_id: creator.id } });
        if (res.data?.status) {
          setMachineTypes(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch machine types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await addMachine({
        machine_name: name,
        machine_type_id: Number(type)
      }, user.id);
      navigate('/management/machines');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add machine. Please try again.");
    } finally {
      setLoading(false);
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
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Add Machine
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Register new equipment
            </p>
          </div>
        </header>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSave}
          className="space-y-6">

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Machine Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Drager Fabius GS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Machine Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 appearance-none"
                  required>

                  <option value="">Select Type</option>
                  {machineTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.type_name}</option>
                  ))}
                </select>
              </div>
            </div>


          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
              <span className="animate-pulse">Adding Machine...</span> :

              <>
                Add Machine <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>

      <BottomNavigation role="management" />
    </div>);

}