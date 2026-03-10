import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../contexts/AppDataContext';
export function OfflineIndicator() {
  const { isOnline, pendingSyncCount } = useAppData();
  return (
    <AnimatePresence>
      {!isOnline &&
      <motion.div
        initial={{
          y: -50,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        exit={{
          y: -50,
          opacity: 0
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium"
        style={{
          paddingTop: 'calc(var(--safe-area-top) + 0.5rem)'
        }}>

          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
          {pendingSyncCount > 0 &&
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {pendingSyncCount} pending sync
            </span>
        }
        </motion.div>
      }

      {isOnline && pendingSyncCount > 0 &&
      <motion.div
        initial={{
          y: -50,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        exit={{
          y: -50,
          opacity: 0
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium"
        style={{
          paddingTop: 'calc(var(--safe-area-top) + 0.5rem)'
        }}>

          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Syncing {pendingSyncCount} items...</span>
        </motion.div>
      }
    </AnimatePresence>);

}