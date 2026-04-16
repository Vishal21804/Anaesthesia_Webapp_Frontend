import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Shield, Bell, Book } from 'lucide-react';
import { motion } from 'framer-motion';
export function RegistrationSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role') || 'technician';
  const nextSteps = [
  {
    icon: Shield,
    title: 'Complete Your Profile',
    description: 'Add your department and contact information'
  },
  {
    icon: Bell,
    title: 'Set Up Notifications',
    description: 'Configure alerts for critical equipment issues'
  },
  {
    icon: Book,
    title: 'Review Safety Guidelines',
    description: 'Familiarize yourself with safety protocols'
  }];

  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center p-6 transition-colors">
      <div className="max-w-md  w-full">
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="text-center mb-8">

          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400  mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Welcome Aboard!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Your account has been created successfully
          </p>
        </motion.div>

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
            delay: 0.1
          }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">

          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Next Steps
          </h2>

          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
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
                    delay: 0.2 + index * 0.1
                  }}
                  className="flex items-start gap-3">

                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-health-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>);

            })}
          </div>
        </motion.div>

        <motion.button
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.5
          }}
          onClick={() =>
          navigate(
            role === 'technician' ?
            '/technician/dashboard' :
            '/bmet/dashboard'
          )
          }
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95">

          Get Started <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.6
          }}
          className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">

          You can complete these steps later from your profile
        </motion.p>
      </div>
    </div>);

}
