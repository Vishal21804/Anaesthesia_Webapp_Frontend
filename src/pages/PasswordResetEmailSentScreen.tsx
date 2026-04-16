import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
export function PasswordResetEmailSentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
  new URLSearchParams(location.search).get('email') || 'your email';
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
      <div className="max-w-md  w-full text-center">
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400  mb-6">

          <Mail className="w-10 h-10" />
        </motion.div>

        <motion.h1
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
          className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">

          Check Your Email
        </motion.h1>

        <motion.p
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="text-slate-600 dark:text-slate-300 mb-2">

          We've sent password reset instructions to:
        </motion.p>

        <motion.p
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="text-health-primary font-bold mb-8">

          {email}
        </motion.p>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">

          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            What's Next?
          </h3>
          <ol className="text-left text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold text-health-primary">1.</span>
              <span>Check your email inbox (and spam folder)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-health-primary">2.</span>
              <span>Click the reset link in the email</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-health-primary">3.</span>
              <span>Create a new secure password</span>
            </li>
          </ol>
        </motion.div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.5
          }}
          className="space-y-3">

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

            Back to Login <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">

            <RefreshCw className="w-5 h-5" />
            Resend Email
          </button>
        </motion.div>
      </div>
    </div>);

}
