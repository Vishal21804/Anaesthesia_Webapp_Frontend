import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  CheckCircle2,
  Loader
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';
import { Issue } from '../types';
import { motion } from 'framer-motion';

export function IssueDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bmetNotes, setBmetNotes] = useState('');

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) {
        setError("Issue ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("URL TEST:", user.id);

        const res = await api.get(`/api/issues/${id}`, {
          params: { creator_id: user.id }
        });

        if (res.data.status) {
          setIssue(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch issue details.");
        }
      } catch (err: any) {
        console.error("Fetch error:", err.response || err);
        setError("Failed to fetch issue details.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleUpdateStatus = async (status: 'in-progress' | 'resolved') => {
    if (!issue) return;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await api.put(`/api/issues/${issue.id}/status`, {
        status: status,
        notes: bmetNotes
      }, {
        params: { creator_id: user.id }
      });

      if (res.data.status) {
        if (status === 'resolved') {
          navigate('/bmet-dashboard');
        } else {
          // Refetch
          const detailRes = await api.get(`/api/issues/${issue.id}`, {
            params: { creator_id: user.id }
          });
          setIssue(detailRes.data.data);
        }
      }
    } catch (error) {
      alert(`Failed to update issue status.`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" /></div>;
  }

  if (error || !issue) {
    return <div className="text-center p-10 text-red-500">{error || "Issue not found"}</div>;
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-5 pt-6">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Issue Details
            </h1>
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
              ID-{issue.id}
            </p>
          </div>
        </header>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 mb-4">

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {issue.machine_name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {issue.type} Issue
              </p>
            </div>
            <StatusBadge status={issue.status} type="issue" size="md" />
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            <StatusBadge status={issue.priority} type="priority" />
            {/* SeverityBadge could be added here if data is available */}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {issue.description}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{issue.ot_name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(issue.reported_at).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 mb-4">

          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            Maintenance Notes
          </h3>
          <textarea
            value={bmetNotes}
            onChange={(e) => setBmetNotes(e.target.value)}
            placeholder="Add internal maintenance notes..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border"
            rows={3} />
        </motion.div>

        <div className="space-y-3">
          {issue.status !== 'resolved' && (
            <>
              {issue.status === 'pending' && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpdateStatus('in-progress')}
                  className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg">
                  <Wrench className="w-5 h-5" />
                  Mark Under Maintenance
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpdateStatus('resolved')}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                Mark as Resolved
              </motion.button>
            </>
          )}
          {issue.status === 'resolved' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400  mb-2" />
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                Issue Resolved
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation role="bmet" />
    </div>);
}
