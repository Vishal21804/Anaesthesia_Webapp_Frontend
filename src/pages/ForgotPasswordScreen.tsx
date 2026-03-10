import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate(`/password-reset-email-sent?email=${encodeURIComponent(email)}`);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
      <div className="max-w-md mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors inline-flex">

          <ArrowLeft className="w-6 h-6" />
        </button>

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
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter your email address and we'll send you instructions to reset
            your password
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

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              required />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
            <span className="animate-pulse">Sending...</span> :

            <>
                Send Reset Link <Send className="w-5 h-5" />
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
          className="mt-8 bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4">

          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold">Note:</span> If you don't receive an
            email within 5 minutes, check your spam folder or contact your
            administrator.
          </p>
        </motion.div>
      </div>
    </div>);

}