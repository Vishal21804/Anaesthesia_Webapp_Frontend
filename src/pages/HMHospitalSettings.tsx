import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Key,
  ChevronDown,
  ChevronUp,
  Save,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';
import toast from 'react-hot-toast';

export function HMHospitalSettings() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [hospitalName, setHospitalName] = useState('');
  const [resetTime, setResetTime] = useState('');
  const [atPassword, setAtPassword] = useState('');
  const [bmetPassword, setBmetPassword] = useState('');

  // Password Visibility State
  const [showAtPassword, setShowAtPassword] = useState(false);
  const [showBmetPassword, setShowBmetPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const res = await api.get('/hospital/settings');
      if (res.data) {
        setHospitalName(res.data.hospital_name || '');
        setResetTime(res.data.reset_time ? res.data.reset_time.substring(0, 5) : '');
        setAtPassword(res.data.default_at_password || '');
        setBmetPassword(res.data.default_bmet_password || '');
      }
    } catch (error) {
      console.error('Error fetching hospital settings:', error);
    } finally {
      setFetching(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const hospitalId = user?.hospital_id || 1;

      const formattedTime = resetTime.length === 5 ? `${resetTime}:00` : resetTime;

      // Update Hospital Name & Time (Query Params)
      const resHospital = await api.put('/api/hospital/update', null, {
        params: {
          hospital_name: hospitalName,
          machine_reset_time: formattedTime
        }
      });

      // Update Passwords & Time (JSON Body)
      const payload = {
        hospital_id: hospitalId,
        reset_time: formattedTime,
        default_at_password: atPassword,
        default_bmet_password: bmetPassword
      };
      const resSettings = await api.put('/hospital/settings', payload);

      if (resHospital.data?.status !== false && resSettings.data?.status !== false) {
        toast.success(resHospital.data?.message || 'Settings updated successfully');
      } else {
        toast.error('Failed to fully update settings');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: 'general',
      title: 'Hospital Details',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Machine Reset time
            </label>
            <div className="relative">
              <input
                type="time"
                value={resetTime}
                onChange={(e) => setResetTime(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all [::-webkit-calendar-picker-indicator]:opacity-0" />
              <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none">
                <Clock className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'passwords',
      title: 'Default Passwords',
      icon: Key,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Default Password for Technicians (AT)
            </label>
            <div className="relative">
              <input
                type={showAtPassword ? "text" : "password"}
                value={atPassword}
                onChange={(e) => setAtPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              <button
                type="button"
                onClick={() => setShowAtPassword(!showAtPassword)}
                className="absolute inset-y-0 right-0 p-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors">
                {showAtPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              New technicians will use this password on their first login.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Default Password for BMET
            </label>
            <div className="relative">
              <input
                type={showBmetPassword ? "text" : "password"}
                value={bmetPassword}
                onChange={(e) => setBmetPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              <button
                type="button"
                onClick={() => setShowBmetPassword(!showBmetPassword)}
                className="absolute inset-y-0 right-0 p-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors">
                {showBmetPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              New BMET staff will use this password on their first login.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Hospital Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage hospital details & defaults
            </p>
          </div>
        </header>

        {fetching ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {sections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;
              return (
                <div
                  key={section.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {section.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="p-4 pt-0 border-t border-slate-50 dark:border-slate-800">
                          <div className="mt-4">{section.content}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70 mt-4">
              {loading ? (
                <span className="animate-pulse">Saving Settings...</span>
              ) : (
                <>
                  Save All Changes <Save className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <BottomNavigation role="management" />
    </div>
  );
}
