import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
export function CustomProblemEntryScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/technician/problem-severity/${machineId}`);
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Custom Problem
          </h1>
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
          onSubmit={handleSubmit}
          className="space-y-6">

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Problem Title
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none focus:border-health-primary focus:ring-1 focus:ring-health-primary text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe the problem in detail, including when it occurs and any relevant observations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none focus:border-health-primary focus:ring-1 focus:ring-health-primary resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>
          </div>

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
              delay: 0.1
            }}
            className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4">

            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-bold">Tip:</span> Be as specific as
              possible. Include error codes, unusual sounds, or visual
              indicators.
            </p>
          </motion.div>

          <button
            type="submit"
            disabled={!title || !description}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

            <FileText className="w-5 h-5" />
            Continue
          </button>
        </motion.form>
      </div>
    </div>);

}