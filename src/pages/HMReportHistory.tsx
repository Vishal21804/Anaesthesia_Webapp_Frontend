import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Activity,
  Wrench,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  MapPin,
  Download } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
type ReportType = 'ot' | 'machine';
// Mock Data Structure matching ChecklistHistory style
interface ReportSession {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  status: 'working' | 'issues' | 'resolved';
  location?: string;
  checkedBy?: string;
}
const otReports: ReportSession[] = [
{
  id: 'rep-ot-1',
  title: 'Operation Theatre 1',
  subtitle: 'Daily Safety Audit',
  date: 'Jan 28, 2025',
  time: '08:00 AM',
  status: 'working',
  location: 'Block A, Floor 2',
  checkedBy: 'Alex Taylor'
},
{
  id: 'rep-ot-2',
  title: 'Operation Theatre 2',
  subtitle: 'Daily Safety Audit',
  date: 'Jan 28, 2025',
  time: '08:15 AM',
  status: 'issues',
  location: 'Block A, Floor 2',
  checkedBy: 'Sarah Smith'
},
{
  id: 'rep-ot-3',
  title: 'ICU Ward',
  subtitle: 'Shift Handover Report',
  date: 'Jan 27, 2025',
  time: '08:00 PM',
  status: 'resolved',
  location: 'Block B, Floor 1',
  checkedBy: 'Mike Johnson'
}];

const machineReports: ReportSession[] = [
{
  id: 'rep-m-1',
  title: 'Drager Fabius GS',
  subtitle: 'Anesthesia Workstation',
  date: 'Jan 28, 2025',
  time: '07:45 AM',
  status: 'working',
  location: 'OT-1',
  checkedBy: 'Alex Taylor'
},
{
  id: 'rep-m-2',
  title: 'Maquet Flow-i',
  subtitle: 'Ventilator System',
  date: 'Jan 28, 2025',
  time: '09:30 AM',
  status: 'issues',
  location: 'OT-3',
  checkedBy: 'Sarah Smith'
},
{
  id: 'rep-m-3',
  title: 'Philips IntelliVue',
  subtitle: 'Patient Monitor',
  date: 'Jan 27, 2025',
  time: '02:15 PM',
  status: 'resolved',
  location: 'ICU-1',
  checkedBy: 'James Wilson'
}];

export function HMReportHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReportType>('ot');
  const [searchQuery, setSearchQuery] = useState('');
  const currentReports = activeTab === 'ot' ? otReports : machineReports;
  const filteredReports = currentReports.filter(
    (r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide">
            <CheckCircle className="w-3.5 h-3.5" />
            Working
          </div>);

      case 'issues':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" />
            Not Working
          </div>);

      case 'resolved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </div>);

      default:
        return null;
    }
  };
  const getBorderColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'border-emerald-100 dark:border-emerald-900/30';
      case 'issues':
        return 'border-rose-100 dark:border-rose-900/30';
      case 'resolved':
        return 'border-blue-100 dark:border-blue-900/30';
      default:
        return 'border-slate-100 dark:border-slate-700';
    }
  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Report History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Audit & Usage Logs
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

        </div>

        {/* Filter Tabs */}
        <div className="flex p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('ot')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'ot' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>

            <Activity className="w-4 h-4" />
            OT-Wise
          </button>
          <button
            onClick={() => setActiveTab('machine')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'machine' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>

            <Wrench className="w-4 h-4" />
            Machine-Wise
          </button>
        </div>

        {/* Report List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filteredReports.length === 0 ?
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="text-center py-12">

                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                  No reports found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search
                </p>
              </motion.div> :

            filteredReports.map((report, index) =>
            <motion.div
              key={report.id}
              layout
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.95
              }}
              transition={{
                delay: index * 0.05
              }}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border-2 transition-all ${getBorderColor(report.status)}`}>

                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {report.subtitle}
                      </p>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Date
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {report.date} • {report.time}
                      </span>
                    </div>
                    {report.location &&
                <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> Location
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {report.location}
                        </span>
                      </div>
                }
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Checked by:{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {report.checkedBy}
                      </span>
                    </span>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors group">
                      <Download className="w-4 h-4" />
                      Export PDF
                    </button>
                  </div>
                </motion.div>
            )
            }
          </div>
        </AnimatePresence>
      </div>

      <BottomNavigation role="management" />
    </div>);

}