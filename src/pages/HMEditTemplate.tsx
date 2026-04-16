import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Plus,
  GripVertical,
  Trash2,
  AlertCircle,
  Save } from
'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMEditTemplate() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [items, setItems] = useState([
  {
    id: '1',
    label: 'Verify backup power supply (UPS)',
    critical: true
  },
  {
    id: '2',
    label: 'Check high-pressure system',
    critical: true
  },
  {
    id: '3',
    label: 'Verify low-pressure system integrity',
    critical: false
  },
  {
    id: '4',
    label: 'Calibrate Oxygen sensor',
    critical: true
  },
  {
    id: '5',
    label: 'Check breathing circuit for leaks',
    critical: false
  }]
  );
  const [loading, setLoading] = useState(false);
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/management/checklist-templates');
    }, 1500);
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
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Anesthesia Workstation
              </h1>
              <Edit2 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Editing Template v1.2
            </p>
          </div>
        </header>

        {/* Template Info */}
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              Total Items: {items.length}
            </span>
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              Critical: {items.filter((i) => i.critical).length}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-20">
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="space-y-3">

            {items.map((item) =>
            <Reorder.Item key={item.id} value={item}>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {item.label}
                    </p>
                    {item.critical &&
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded mt-1">
                        <AlertCircle className="w-3 h-3" /> Critical
                      </span>
                  }
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-purple-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            )}
          </Reorder.Group>

          <button
            onClick={() => navigate('/management/add-checklist-item')}
            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

            <Plus className="w-5 h-5" /> Add New Item
          </button>
        </div>

        {/* Fixed Save Button */}
        <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-health-bg via-health-bg to-transparent dark:from-slate-950 dark:via-slate-950 z-10">
          <div className="max-w-md ">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

              {loading ?
              <span className="animate-pulse">Saving...</span> :

              <>
                  Save Changes <Save className="w-5 h-5" />
                </>
              }
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
