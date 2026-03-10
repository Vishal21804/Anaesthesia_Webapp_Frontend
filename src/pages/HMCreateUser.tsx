import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  Check,
  CheckCircle,
  Layers } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { useUserManagement } from '../contexts/UserManagementContext';
export function HMCreateUser() {
  const navigate = useNavigate();
  const { addUser } = useUserManagement();
  const [role, setRole] = useState('technician');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Module access state
  const [modules, setModules] = useState({
    otManagement: true,
    machineManagement: true,
    reports: false,
    checklists: true
  });
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      addUser({
        name,
        email,
        role: role as any,
        enabled: true,
        assignedOTs: [],
        joinDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/management/user-access');
      }, 1500);
    }, 1500);
  };
  if (success) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center items-center p-6">
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg text-center max-w-sm w-full border border-slate-100 dark:border-slate-800">

          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            User Created!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            The new account has been successfully set up.
          </p>
        </motion.div>
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
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Create New User
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add a new staff member
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
          onSubmit={handleCreate}
          className="space-y-6">

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
              Select Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
              {
                id: 'technician',
                label: 'Technician',
                short: 'AT'
              },
              {
                id: 'bmet',
                label: 'Biomedical',
                short: 'BME'
              },
              {
                id: 'incharge',
                label: 'In-Charge',
                short: 'IC'
              }].
              map((r) =>
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === r.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>

                  <span className="text-lg font-bold">{r.short}</span>
                  <span className="text-[10px] font-medium">{r.label}</span>
                </button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. sarah@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Temporary Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  defaultValue="Hospital@123"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-mono"
                  readOnly />

              </div>
              <p className="text-xs text-slate-400 mt-2 ml-1">
                User will be prompted to change this on first login.
              </p>
            </div>
          </div>

          {/* Module Access */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
              Initial Module Access
            </label>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {[
              {
                id: 'otManagement',
                label: 'OT Management'
              },
              {
                id: 'machineManagement',
                label: 'Machine Management'
              },
              {
                id: 'reports',
                label: 'Reports & Analytics'
              },
              {
                id: 'checklists',
                label: 'Safety Checklists'
              }].
              map((module, index) =>
              <div
                key={module.id}
                className={`p-4 flex items-center justify-between ${index !== 3 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>

                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {module.label}
                    </span>
                  </div>
                  <button
                  type="button"
                  onClick={() =>
                  setModules((prev) => ({
                    ...prev,
                    [module.id]: !prev[module.id as keyof typeof modules]
                  }))
                  }
                  className={`w-10 h-6 rounded-full transition-colors relative ${modules[module.id as keyof typeof modules] ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}>

                    <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${modules[module.id as keyof typeof modules] ? 'left-5' : 'left-1'}`} />

                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Permissions Preview */}
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Access Level:{' '}
                {role === 'incharge' ?
                'In-Charge' :
                role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
            <ul className="space-y-1">
              {[
              'View assigned dashboards',
              'Submit reports & checklists',
              'Access notifications'].
              map((item, i) =>
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-purple-600/80 dark:text-purple-400/80">

                  <Check className="w-3 h-3" />
                  {item}
                </li>
              )}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
            <span className="animate-pulse">Creating User...</span> :

            'Create Account'
            }
          </button>
        </motion.form>
      </div>

      <BottomNavigation role="management" />
    </div>);

}