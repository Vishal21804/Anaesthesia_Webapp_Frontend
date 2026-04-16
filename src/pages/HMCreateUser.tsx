import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from "../services/api";
import toast from "react-hot-toast";

type Role = 'AT' | 'BMET';

export function HMCreateUser() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('AT');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');

  // Default passwords state
  const [defaultAtPassword, setDefaultAtPassword] = useState('');
  const [defaultBmetPassword, setDefaultBmetPassword] = useState('');

  useEffect(() => {
    const fetchDefaultPasswords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const creatorId = user.id;
        if (!creatorId) return;

        const response = await api.get(`/api/default-passwords?creator_id=${creatorId}`);
        if (response.data.status) {
          const { default_at_password, default_bmet_password } = response.data.data;
          setDefaultAtPassword(default_at_password || 'at@123');
          setDefaultBmetPassword(default_bmet_password || 'bmet@123');
        }
      } catch (err) {
        console.error("Failed to fetch default passwords", err);
      }
    };
    fetchDefaultPasswords();
  }, []);

  // Update password when role changes or defaults are fetched
  useEffect(() => {
    if (role === 'AT') {
      setPassword(defaultAtPassword || 'at@123');
    } else {
      setPassword(defaultBmetPassword || 'bmet@123');
    }
  }, [role, defaultAtPassword, defaultBmetPassword]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !employeeId || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const creatorId = user.id;

      // Note: The backend endpoint provided is /create_user?creator_id=...
      const res = await api.post(`/create_user?creator_id=${creatorId}`, {
        name,
        email,
        password,
        role,
        employee_id: employeeId,
        dob: dob || null
      });

      if (res.data.status) {
        setSuccess(true);
        toast.success("User created successfully!");
        setTimeout(() => {
          navigate('/management/user-access');
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to create user");
      }
    } catch (err: any) {
      console.error("Failed to create user:", err);
      toast.error(err.response?.data?.detail || "Creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl text-left max-w-sm w-full border border-slate-100 dark:border-slate-800"
        >
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-8 text-emerald-500 shadow-inner ring-4 ring-emerald-500/10">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Successfully Created!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Staff account is now active</p>
          <div className="w-12 h-1 bg-emerald-500 rounded-full animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 6rem)'
      }}
    >
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
            <h1 className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 letter-tight">Create New User</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">Add a new staff member</p>
          </div>
        </header>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">
              Select Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('AT')}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm text-left transition-all duration-300 ${role === 'AT'
                  ? 'border-purple-600 bg-white text-purple-600 shadow-md ring-4 ring-purple-600/5'
                  : 'border-white dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 shadow-sm'
                  }`}
              >
                Anaesthesia Technician
              </button>
              <button
                type="button"
                onClick={() => setRole('BMET')}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm text-left transition-all duration-300 ${role === 'BMET'
                  ? 'border-purple-600 bg-white text-purple-600 shadow-md ring-4 ring-purple-600/5'
                  : 'border-white dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 shadow-sm'
                  }`}
              >
                BioMedical Technician
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. sarah@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. EMP12345"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                Temporary Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-5 pr-14 py-4 bg-white dark:bg-slate-900 rounded-[1.25rem] border border-white dark:border-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-slate-700 dark:text-slate-200 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 ml-1 font-medium italic">
                User will be prompted to change this on first login.
              </p>
            </div>
          </div>

          {/* Access Info Card */}
          <div className="bg-[#FAF5FF] dark:bg-purple-950/20 rounded-[1.5rem] p-6 border border-[#F3E8FF] dark:border-purple-900/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Access Level: {role === 'AT' ? 'Anaesthesia Technician' : 'BioMedical Technician'}
              </span>
            </div>
            <ul className="space-y-2.5 ml-1">
              {[
                'View assigned dashboards',
                'Submit reports & checklists',
                'Access notifications'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-purple-500/80 dark:text-purple-400/80">
                  <Check className="w-3.5 h-3.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>

      <BottomNavigation role="management" />
    </div>
  );
}
