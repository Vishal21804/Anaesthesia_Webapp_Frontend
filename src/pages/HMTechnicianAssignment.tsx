import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  MapPin,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';

import { API_BASE_URL } from "../constants";
const API_BASE = API_BASE_URL;

const getProfileImage = (path: string | null) => {
  if (!path) return null;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_BASE}/${cleanPath}`;
};

export function HMTechnicianAssignment() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AT' | 'BMET'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const creatorId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user") || "{}").id;

        const res = await fetch(
          `${API_BASE}/api/users?creator_id=${creatorId}`
        );

        const json = await res.json();

        if (json.status) {
          const staffList = json.data || [];

          // Map backend roles to UI roles using robust inclusion checks
          const formattedStaff = staffList.map((u: any) => {
            const roleLow = (u.role || '').toLowerCase();
            let displayRole = 'Staff';

            if (roleLow.includes('anaesthesia') || roleLow === 'technician' || roleLow === 'at') {
              displayRole = 'AT';
            } else if (roleLow.includes('bio') || roleLow === 'bmet') {
              displayRole = 'BMET';
            }

            return {
              ...u,
              displayRole,
              // Backend returns assigned_ots, map it to what UI expects if needed
              assignedOTs: u.assigned_ots ? new Array(u.assigned_ots) : []
            };
          }).filter((u: any) => ['AT', 'BMET'].includes(u.displayRole));

          setStaff(formattedStaff);
        } else {
          setStaff([]);
        }
      } catch (error) {
        console.error("Failed to load staff:", error);
        setError("Failed to fetch staff.");
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredTechnicians = useMemo(() => {
    return staff.filter((tech) => {
      const matchesRole = activeFilter === 'ALL' || tech.displayRole === activeFilter;
      const matchesSearch = (tech.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [staff, activeFilter, searchQuery]);
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Technician Assignment
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage staff OT access
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />

        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {[
            {
              id: 'ALL',
              label: 'All Staff'
            },
            {
              id: 'AT',
              label: 'Anaesthesia Techs'
            },
            {
              id: 'BMET',
              label: 'Biomedical Techs'
            }].
            map((filter) =>
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as 'ALL' | 'AT' | 'BMET')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

                {filter.label}
              </button>
            )}
        </div>

        {/* Technician List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTechnicians.map((tech, index) => (
                <motion.button
                  key={tech.id}
                  initial={{
                    y: 20,
                    opacity: 0
                  }}
                  animate={{
                    y: 0,
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  onClick={() =>
                    navigate(`/management/technician-ot-assign/${tech.id}`)
                  }
                  className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all text-left group">

                  <div className="relative">
                    {getProfileImage(tech.profile_pic) ? (
                      <img
                        src={getProfileImage(tech.profile_pic)!}
                        alt={tech.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                        {tech.name?.charAt(0) || 'U'}
                      </div>
                    )}


                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">
                        {tech.name}
                      </h3>
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${tech.displayRole === 'AT' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>

                        {tech.displayRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {tech.assignedOTs?.length > 0 ?
                        `${tech.assignedOTs.length} OT${tech.assignedOTs.length > 1 ? 's' : ''} Assigned` :
                        'No OTs Assigned'}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </motion.button>
              ))}
            </AnimatePresence>
          )}

          {filteredTechnicians.length === 0 &&
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No staff found matching your criteria.
              </p>
            </div>
          }
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
