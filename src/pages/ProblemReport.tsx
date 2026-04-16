import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMachineDetails } from '../services/machine';
import { createIssue } from '../services/issues';
export function ProblemReport() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [issueType, setIssueType] = useState('Mechanical Failure');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = await getMachineDetails(Number(machineId), user.id);
        setMachine(data);
      } catch (err) {
        console.error("Failed to fetch machine details");
      }
    };
    if (machineId) fetchMachine();
  }, [machineId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await createIssue({
        machine_id: Number(machineId),
        issue_type: issueType,
        priority: priority,
        description: description,
        creator_id: user.id
      });
      navigate('/technician/confirmation');
    } catch (err) {
      console.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-health-bg pb-32">
      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Report Problem</h1>
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
            {machine ? (
              <>
                <h3 className="font-bold text-slate-800 mb-1">{machine.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{machine.serial_number || "No Serial"} • {machine.ot_name || "No OT"}</p>
              </>
            ) : (
              <h3 className="font-bold text-slate-800 mb-4">Loading Machine Details...</h3>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Issue Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-primary focus:ring-1 focus:ring-health-primary"
                >
                  <option>Mechanical Failure</option>
                  <option>Electrical Issue</option>
                  <option>Software Error</option>
                  <option>Calibration Needed</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="Low"
                      checked={priority === 'Low'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="peer sr-only" />
                    <div className="p-2 text-center rounded-lg border border-slate-200 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 text-sm font-medium transition-all">
                      Low
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="Medium"
                      checked={priority === 'Medium'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="peer sr-only" />
                    <div className="p-2 text-center rounded-lg border border-slate-200 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 text-sm font-medium transition-all">
                      Medium
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="High"
                      checked={priority === 'High'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="peer sr-only" />
                    <div className="p-2 text-center rounded-lg border border-slate-200 peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700 text-sm font-medium transition-all">
                      High
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-health-primary focus:ring-1 focus:ring-health-primary resize-none"
                  required>
                </textarea>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
              <span className="animate-pulse">Submitting Report...</span> :

              <>
                Submit Report <Send className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>
    </div>);

}