import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
export function PasswordResetSuccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">

        <CheckCircle className="w-10 h-10" />
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
        className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">

        Password Reset Complete
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
        className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">

        Your password has been successfully reset. You can now log in with your
        new password.
      </motion.p>

      <motion.button
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
        onClick={() => navigate('/login')}
        className="w-full max-w-xs bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

        Continue to Login <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>);

}
