import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '../contexts/RoleContext';
export function LogoutConfirmationScreen() {
  const navigate = useNavigate();
  const { clearRole } = useRole();
  const handleLogout = () => {
    // Clear role and session data
    clearRole();
    sessionStorage.clear();
    navigate('/role-selection');
  };
  return (
    <div className="min-h-screen bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-colors">
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700 max-w-sm w-full">

        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400">
            <LogOut className="w-7 h-7" />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Confirm Logout
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Are you sure you want to log out? Any unsaved changes will be lost.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95">

            Yes, Log Out
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">

            Cancel
          </button>
        </div>
      </motion.div>
    </div>);

}