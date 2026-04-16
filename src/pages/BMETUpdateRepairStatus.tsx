import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Wrench, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getIssueDetails, updateIssue } from '../services/issues';
export function BMETUpdateRepairStatus() {
  const navigate = useNavigate();
  const { id: issueId } = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [status, setStatus] = useState('under-repair');
  const [parts, setParts] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = await getIssueDetails(Number(issueId), user.id);
        setIssue(data);
        setStatus(data.status || 'under-repair');
      } catch (err) {
        console.error("Failed to fetch issue details");
      }
    };
    if (issueId) fetchIssue();
  }, [issueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await updateIssue(Number(issueId), {
        status,
        maintenance_notes: notes,
        parts_replaced: parts,
        time_spent: timeSpent
      }, user.id);
      navigate('/bmet-dashboard');
    } catch (err) {
      console.error("Failed to update issue status");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      <div className="max-w-md  px-6 pt-8 pb-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Update Repair Status
            </h1>
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

          {/* Issue Summary */}
          {issue && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                {issue.machineName || issue.machine_name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-0">
                {issue.description}
              </p>
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
              Repair Status
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: 'under-repair',
                  label: 'Under Repair',
                  desc: 'Work in progress',
                  color: 'blue'
                },
                {
                  id: 'repaired',
                  label: 'Repaired',
                  desc: 'Issue resolved',
                  color: 'emerald'
                },
                {
                  id: 'not-repairable',
                  label: 'Not Repairable',
                  desc: 'Needs replacement',
                  color: 'rose'
                }].
                map((opt) =>
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${status === opt.id ? opt.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : opt.color === 'emerald' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-rose-500 bg-rose-50 dark:bg-rose-950/30' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>

                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold ${status === opt.id ? opt.color === 'blue' ? 'text-blue-700 dark:text-blue-400' : opt.color === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>

                        {opt.label}
                      </span>
                      {status === opt.id &&
                        <div
                          className={`w-3 h-3 rounded-full ${opt.color === 'blue' ? 'bg-blue-500' : opt.color === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                      }
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </button>
                )}
            </div>
          </div>

          {/* Details Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Parts Replaced (Optional)
              </label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={parts}
                  onChange={(e) => setParts(e.target.value)}
                  placeholder="e.g. O2 Sensor, Power Supply"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Time Spent (Minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Technician Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe the work performed..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none"
                  required />

              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
              <span className="animate-pulse">Updating...</span> :

              <>
                Update Status <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>
    </div>);

}
