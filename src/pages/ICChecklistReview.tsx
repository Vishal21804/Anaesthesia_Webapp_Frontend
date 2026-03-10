import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  ChevronRight } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function ICChecklistReview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');
  const submissions = [
  {
    id: 'sub-1',
    machine: 'Drager Fabius GS',
    ot: 'OT-1',
    tech: 'Alex Taylor',
    time: '10 mins ago',
    status: 'pending',
    items: 12,
    passed: 12
  },
  {
    id: 'sub-2',
    machine: 'GE Datex-Ohmeda',
    ot: 'OT-1',
    tech: 'Alex Taylor',
    time: '25 mins ago',
    status: 'pending',
    items: 12,
    passed: 11
  },
  {
    id: 'sub-3',
    machine: 'Mindray WATO EX-65',
    ot: 'OT-2',
    tech: 'Maria Garcia',
    time: '1 hour ago',
    status: 'approved',
    items: 12,
    passed: 12
  },
  {
    id: 'sub-4',
    machine: 'Philips IntelliVue',
    ot: 'OT-2',
    tech: 'Maria Garcia',
    time: '2 hours ago',
    status: 'rejected',
    items: 10,
    passed: 8
  }];

  const filteredSubmissions =
  filter === 'all' ?
  submissions :
  submissions.filter((s) => s.status === filter);
  const tabs = [
  {
    id: 'all',
    label: 'All'
  },
  {
    id: 'pending',
    label: 'Pending'
  },
  {
    id: 'approved',
    label: 'Approved'
  },
  {
    id: 'rejected',
    label: 'Rejected'
  }];

  return (
    <div
      className="min-h-[917px] bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Checklist Review
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search machine or tech..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 text-sm" />

          </div>
          <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`
                px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
                ${filter === tab.id ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'}
              `}>

              {tab.label}
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredSubmissions.map((sub, index) =>
          <motion.button
            key={sub.id}
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: index * 0.05
            }}
            onClick={() => navigate('/incharge/approve-reject')}
            className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-left hover:shadow-md transition-all">

              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                    {sub.machine}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {sub.ot}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {sub.tech}
                    </div>
                  </div>
                </div>
                <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${sub.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' : sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>

                  {sub.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs">
                  <span
                  className={`font-bold ${sub.passed === sub.items ? 'text-emerald-600' : 'text-amber-600'}`}>

                    {sub.passed}/{sub.items} Passed
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sub.time}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
            </motion.button>
          )}
        </div>
      </div>

      <BottomNavigation role="incharge" />
    </div>);

}