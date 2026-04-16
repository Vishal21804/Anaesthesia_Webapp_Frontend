import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { addOT } from '../services/ot';
import { BottomNavigation } from '../components/BottomNavigation';
import toast from 'react-hot-toast';

const HMAddOTRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [otName, setOtName] = useState('');
  const [otCode, setOtCode] = useState('');
  const [otType, setOtType] = useState('');

  const otTypes = [
    "General Surgery",
    "Cardiac Surgery",
    "Neuro Surgery",
    "Orthopedic",
    "Emergency/Trauma",
    "ICU",
    "Pediatric"
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otName || !otCode || !otType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await addOT({
        ot_name: otName,
        ot_code: otCode,
        ot_type: otType,
      }, user.id);

      if (res.status) {
        toast.success("OT Room created successfully!");
        navigate('/management/ot');
      } else {
        toast.error(res.message || "Failed to create OT Room.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create OT Room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-none flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-100 dark:border-slate-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 letter-tight">Add OT Room</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">Create new operation theatre</p>
          </div>
        </header>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleCreate}
          className="space-y-6">

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                OT Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Operation Theatre 4"
                value={otName}
                onChange={(e) => setOtName(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 transition-all font-medium"
                required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                OT Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. OT-4"
                value={otCode}
                onChange={(e) => setOtCode(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 transition-all font-medium uppercase"
                required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                OT Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={otType}
                onChange={(e) => setOtType(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 transition-all font-medium appearance-none"
                required
              >
                <option value="" disabled>Select Type</option>
                {otTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>


          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create OT Room <Save className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>

      <BottomNavigation role="management" />
    </div>
  );
};

export default HMAddOTRoom;
