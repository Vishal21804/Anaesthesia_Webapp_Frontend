import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const requirements = [
  {
    label: 'At least 8 characters',
    met: password.length >= 8
  },
  {
    label: 'Contains uppercase letter',
    met: /[A-Z]/.test(password)
  },
  {
    label: 'Contains lowercase letter',
    met: /[a-z]/.test(password)
  },
  {
    label: 'Contains number',
    met: /[0-9]/.test(password)
  },
  {
    label: 'Passwords match',
    met: password === confirmPassword && password.length > 0
  }];

  const allRequirementsMet = requirements.every((r) => r.met);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequirementsMet) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/password-reset-success');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
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
            Create New Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Choose a strong password to secure your account
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
          onSubmit={handleSubmit}
          className="space-y-6">

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                required />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">

                {showPassword ?
                <EyeOff className="w-5 h-5" /> :

                <Eye className="w-5 h-5" />
                }
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                required />

            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
              Password Requirements
            </h3>
            <div className="space-y-2">
              {requirements.map((req, index) =>
              <div key={index} className="flex items-center gap-2 text-sm">
                  {req.met ?
                <CheckCircle className="w-4 h-4 text-emerald-500" /> :

                <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                }
                  <span
                  className={
                  req.met ?
                  'text-emerald-600 dark:text-emerald-400' :
                  'text-slate-500 dark:text-slate-400'
                  }>

                    {req.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !allRequirementsMet}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

            {loading ?
            <span className="animate-pulse">Resetting Password...</span> :

            'Reset Password'
            }
          </button>
        </motion.form>
      </div>
    </div>);

}