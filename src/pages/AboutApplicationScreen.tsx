import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
export function AboutApplicationScreen() {
  const navigate = useNavigate();
  const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Comprehensive safety checklists for all equipment'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless communication between technicians and BMET'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant notifications for critical equipment issues'
  },
  {
    icon: Heart,
    title: 'Patient Care',
    description: 'Ensuring equipment reliability for better outcomes'
  }];

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
            About
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
          className="bg-gradient-to-br from-health-primary to-teal-600 rounded-3xl p-8 text-white text-center mb-8 shadow-lg">

          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center  mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">OT Safety Checklist</h2>
          <p className="text-teal-50 mb-4">Version 1.0.0</p>
          <p className="text-sm text-teal-50">
            Professional equipment management system for healthcare facilities
          </p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
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
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-health-secondary dark:bg-slate-800 rounded-xl flex items-center justify-center text-health-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>

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
            delay: 0.4
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Developed with ❤️ for healthcare professionals
          </p>
          <p className="text-xs text-slate-400">
            © 2024 Hospital Management System. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>);

}