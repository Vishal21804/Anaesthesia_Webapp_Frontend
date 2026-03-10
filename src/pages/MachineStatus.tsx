import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { inspectMachine } from '../services/machine';

export function MachineStatus() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [loading, setLoading] = useState(false);

  const handleStatusSelect = async (status: 'Working' | 'Not Working' | 'attention') => {
    if (!machineId) return;

    const numericMachineId = parseInt(machineId, 10);

    if (status === 'Working') {
      setLoading(true);
      try {
        await inspectMachine({ machine_id: numericMachineId, status: 'Working' });
        navigate('/technician/dashboard');
      } catch (error) {
        alert('Failed to update machine status. Please try again.');
        setLoading(false);
      }
    } else {
      // For "Needs Attention" and "Not Working", navigate to a page to add more details.
      // The API call will be made from that page.
      navigate(`/technician/report/${machineId}`);
    }
  };

  return (
    <div className="min-h-screen bg-health-bg flex flex-col justify-center p-6">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10">

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Checklist Complete
          </h1>
          <p className="text-slate-500">
            What is the final status of this machine?
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader className="w-8 h-8 text-health-primary animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleStatusSelect('Working')}
            disabled={loading}
            className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left disabled:opacity-50">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Working Properly
                </h3>
                <p className="text-sm text-slate-500">Safe for operation</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleStatusSelect('attention')}
            disabled={loading}
            className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-amber-500 hover:bg-amber-50 transition-all group text-left disabled:opacity-50">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Needs Attention
                </h3>
                <p className="text-sm text-slate-500">Minor issues detected</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleStatusSelect('Not Working')}
            disabled={loading}
            className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-rose-500 hover:bg-rose-50 transition-all group text-left disabled:opacity-50">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Not Working
                </h3>
                <p className="text-sm text-slate-500">
                  Critical failure, do not use
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>);
}