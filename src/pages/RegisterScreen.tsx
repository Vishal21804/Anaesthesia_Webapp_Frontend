import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Briefcase, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
export function RegisterScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('technician');
  const [loading, setLoading] = useState(false);
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate(
        role === 'technician' ? '/technician/dashboard' : '/bmet/dashboard'
      );
    }, 1500);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)'
      }}>

      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Join the safety checklist system
          </p>
        </motion.div>

        <motion.form
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.1
          }}
          onSubmit={handleRegister}
          className="space-y-5">

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                required />

            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                required />

            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                required />

            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'technician' ? 'border-health-blue bg-blue-50 dark:bg-blue-950/30 text-health-blue dark:text-blue-400' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}>

                  <Briefcase className="w-6 h-6" />
                  <span className="text-xs font-bold">Anaesthesia Tech</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('bmet')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'bmet' ? 'border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}>

                  <Activity className="w-6 h-6" />
                  <span className="text-xs font-bold">BMET Specialist</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70 mt-4">

            {loading ?
            <span className="animate-pulse">Creating Account...</span> :

            <>
                Register <ArrowRight className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>

        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="mt-8 text-center">

          <p className="text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-health-primary font-bold hover:text-teal-700 dark:hover:text-teal-400">

              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>);

}