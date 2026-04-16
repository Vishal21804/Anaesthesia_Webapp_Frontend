import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Calendar } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines } from '../data/mockData';
export function BMETMachineTimeline() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const machine =
  mockMachines.find((m) => m.id === machineId) || mockMachines[0];
  const [filter, setFilter] = useState('all');
  // Mock timeline data
  const timelineEvents = [
  {
    id: 1,
    type: 'repair',
    title: 'Screen Replacement',
    description: 'Replaced faulty LCD panel and calibrated touch sensor.',
    date: 'Today, 10:30 AM',
    user: 'David Chen (BMET)',
    icon: Wrench,
    color: 'blue'
  },
  {
    id: 2,
    type: 'issue',
    title: 'Display Flickering',
    description: 'Screen showing artifacts and flickering intermittently.',
    date: 'Yesterday, 2:15 PM',
    user: 'Alex Taylor (AT)',
    icon: AlertTriangle,
    color: 'amber'
  },
  {
    id: 3,
    type: 'check',
    title: 'Daily Safety Check',
    description: 'Routine inspection completed successfully.',
    date: 'Yesterday, 7:45 AM',
    user: 'Alex Taylor (AT)',
    icon: CheckCircle2,
    color: 'emerald'
  },
  {
    id: 4,
    type: 'check',
    title: 'Daily Safety Check',
    description: 'Routine inspection completed successfully.',
    date: 'May 10, 7:50 AM',
    user: 'Maria Garcia (AT)',
    icon: CheckCircle2,
    color: 'emerald'
  }];

  const filteredEvents =
  filter === 'all' ?
  timelineEvents :
  timelineEvents.filter((e) => e.type === filter);
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Machine History
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {machine.name}
              </p>
            </div>
          </div>

          {/* Machine Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Model
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-100">
                  {machine.model}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Serial No.
                </p>
                <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
                  {machine.serialNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {['all', 'check', 'issue', 'repair'].map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'}`}>

                {f === 'all' ? 'All Events' : f + 's'}
              </button>
            )}
          </div>
        </header>

        {/* Timeline */}
        <div className="relative pl-4 pb-8">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-6">
            {filteredEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{
                    x: -20,
                    opacity: 0
                  }}
                  animate={{
                    x: 0,
                    opacity: 1
                  }}
                  transition={{
                    delay: index * 0.1
                  }}
                  className="relative pl-8">

                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center z-10 ${event.color === 'blue' ? 'bg-blue-500 text-white' : event.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>

                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {event.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {event.user.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {event.user}
                      </span>
                    </div>
                  </div>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      <BottomNavigation role="bmet" />
    </div>);

}
