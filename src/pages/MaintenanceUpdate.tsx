import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockIssues } from '../data/mockData';
export function MaintenanceUpdate() {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const issue = mockIssues.find((i) => i.id === issueId) || mockIssues[0];
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/bmet/confirmation');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-health-bg pb-32">
      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Update Status</h1>
            <p className="text-xs font-mono text-slate-400">{issueId}</p>
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
          onSubmit={handleSubmit}
          className="space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">
              {issue.machineName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  New Status
                </label>
                <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-purple focus:ring-1 focus:ring-health-purple">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Action Taken
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe maintenance actions..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-purple focus:ring-1 focus:ring-health-purple resize-none"
                  required>
                </textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Parts Replaced (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. O2 Sensor, Power Cable"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-purple focus:ring-1 focus:ring-health-purple" />

              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Time Spent (Minutes)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-purple focus:ring-1 focus:ring-health-purple" />

              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-health-purple text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
            <span className="animate-pulse">Updating...</span> :

            <>
                Save Update <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>
    </div>);

}