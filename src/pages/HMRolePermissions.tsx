import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
export function HMRolePermissions() {
  const navigate = useNavigate();
  // Mock state for permissions
  const [atPermissions, setAtPermissions] = useState({
    checklistVisibility: true,
    issueReporting: true,
    restrictOTs: false
  });
  const [bmetPermissions, setBmetPermissions] = useState({
    maintenanceAccess: true,
    issueResolution: true,
    restrictCategories: false
  });
  const handleSave = () => {
    // In real app, save to backend
    navigate('/hm-dashboard');
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Role & Permissions
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
          className="space-y-6">

          {/* AT Permissions Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-health-primary rounded-full" />
              AT Permissions
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Checklist Visibility
                  </p>
                  <p className="text-xs text-slate-500">
                    Allow viewing checklists
                  </p>
                </div>
                <button
                  onClick={() =>
                    setAtPermissions({
                      ...atPermissions,
                      checklistVisibility: !atPermissions.checklistVisibility
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${atPermissions.checklistVisibility ? 'bg-health-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${atPermissions.checklistVisibility ? 'left-6' : 'left-1'}`} />

                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Issue Reporting
                  </p>
                  <p className="text-xs text-slate-500">
                    Allow reporting problems
                  </p>
                </div>
                <button
                  onClick={() =>
                    setAtPermissions({
                      ...atPermissions,
                      issueReporting: !atPermissions.issueReporting
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${atPermissions.issueReporting ? 'bg-health-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${atPermissions.issueReporting ? 'left-6' : 'left-1'}`} />

                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Restrict OTs
                  </p>
                  <p className="text-xs text-slate-500">
                    Limit access to assigned OT
                  </p>
                </div>
                <button
                  onClick={() =>
                    setAtPermissions({
                      ...atPermissions,
                      restrictOTs: !atPermissions.restrictOTs
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${atPermissions.restrictOTs ? 'bg-health-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${atPermissions.restrictOTs ? 'left-6' : 'left-1'}`} />

                </button>
              </div>
            </div>
          </div>

          {/* BMET Permissions Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full" />
              BMET Permissions
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Maintenance Access
                  </p>
                  <p className="text-xs text-slate-500">
                    Allow equipment maintenance
                  </p>
                </div>
                <button
                  onClick={() =>
                    setBmetPermissions({
                      ...bmetPermissions,
                      maintenanceAccess: !bmetPermissions.maintenanceAccess
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${bmetPermissions.maintenanceAccess ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${bmetPermissions.maintenanceAccess ? 'left-6' : 'left-1'}`} />

                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Issue Resolution
                  </p>
                  <p className="text-xs text-slate-500">Allow closing issues</p>
                </div>
                <button
                  onClick={() =>
                    setBmetPermissions({
                      ...bmetPermissions,
                      issueResolution: !bmetPermissions.issueResolution
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${bmetPermissions.issueResolution ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${bmetPermissions.issueResolution ? 'left-6' : 'left-1'}`} />

                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                    Restrict Categories
                  </p>
                  <p className="text-xs text-slate-500">
                    Limit by equipment type
                  </p>
                </div>
                <button
                  onClick={() =>
                    setBmetPermissions({
                      ...bmetPermissions,
                      restrictCategories: !bmetPermissions.restrictCategories
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative ${bmetPermissions.restrictCategories ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>

                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${bmetPermissions.restrictCategories ? 'left-6' : 'left-1'}`} />

                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{
              scale: 0.98
            }}
            onClick={handleSave}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all mt-8">

            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </motion.div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
