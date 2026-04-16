import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight } from
'lucide-react';
import { motion } from 'framer-motion';
import { mockMachines } from '../data/mockData';
export function SessionDetailsScreen() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  // Get machine to access otId
  const machine = mockMachines.find((m) => m.id === machineId);
  const sessionDetails = {
    machine: 'Drager Fabius GS',
    serialNumber: 'SN-2023-001',
    location: 'OT-1, Main Building',
    lastChecked: '2 days ago',
    technician: 'Alex Taylor',
    estimatedTime: '15-20 minutes',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  if (!machine) {
    return <div>Machine not found</div>;
  }
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
            Session Details
          </h1>
        </header>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {sessionDetails.machine}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {sessionDetails.serialNumber}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Location
                </p>
                <p className="font-bold">{sessionDetails.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="font-bold">{sessionDetails.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Estimated Time
                </p>
                <p className="font-bold">{sessionDetails.estimatedTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Technician
                </p>
                <p className="font-bold">{sessionDetails.technician}</p>
              </div>
            </div>
          </div>
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
            delay: 0.1
          }}
          className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4 mb-6">

          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold">Important:</span> Ensure the machine is
            in standby mode before starting the safety checklist.
          </p>
        </motion.div>

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
            delay: 0.2
          }}
          onClick={() =>
          navigate(`/technician/checklist/${machine.otId}/${machineId}`)
          }
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

          Start Checklist <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>);

}