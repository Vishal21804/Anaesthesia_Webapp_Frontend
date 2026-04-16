import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
export function IssueFilterSearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filterOptions = {
    status: ['Pending', 'In Progress', 'Resolved', 'Escalated'],
    priority: ['Critical', 'High', 'Medium', 'Low'],
    location: ['OT-1', 'OT-2', 'OT-3', 'ICU', 'Emergency'],
    type: ['Mechanical', 'Electrical', 'Software', 'Calibration']
  };
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
    prev.includes(filter) ?
    prev.filter((f) => f !== filter) :
    [...prev, filter]
    );
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
            Filter & Search
          </h1>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by machine, issue ID, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />

        </div>

        {selectedFilters.length > 0 &&
        <motion.div
          initial={{
            y: -10,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="flex flex-wrap gap-2 mb-6">

            {selectedFilters.map((filter) =>
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-health-primary text-white text-sm font-bold rounded-lg hover:bg-teal-600 transition-colors">

                {filter}
                <X className="w-3 h-3" />
              </button>
          )}
            <button
            onClick={() => setSelectedFilters([])}
            className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-slate-700 dark:hover:text-slate-200">

              Clear All
            </button>
          </motion.div>
        }

        <div className="space-y-6">
          {Object.entries(filterOptions).map(([category, options]) =>
          <div key={category}>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {options.map((option) =>
              <button
                key={option}
                onClick={() => toggleFilter(option)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedFilters.includes(option) ? 'bg-health-primary text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>

                    {option}
                  </button>
              )}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20 transition-colors">
          <div className="max-w-md ">
            <button
              onClick={() => navigate('/bmet/issues')}
              className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95">

              Apply Filters ({selectedFilters.length})
            </button>
          </div>
        </div>
      </div>
    </div>);

}
