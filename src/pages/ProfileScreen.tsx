import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  IdCard,
  User,
  Calendar,
  Building2,
  Briefcase } from
'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
import { useRole } from '../contexts/RoleContext';
export function ProfileScreen() {
  const navigate = useNavigate();
  const { role } = useRole();
  // Determine role from context or fallback to URL detection
  const currentRole =
  role || (
  window.location.pathname.includes('bmet') ?
  'bmet' :
  window.location.pathname.includes('management') ?
  'management' :
  'technician');
  // Role-specific data
  const roleData = {
    technician: {
      name: 'Jagadeesh',
      roleLabel: 'Anaesthesia Technician',
      employeeId: 'AT-10927',
      department: 'Operation Theatre',
      email: 'jagadeesh@gmail.com',
      phone: '9594939291',
      dob: '15 March 1990',
      designation: 'Senior Technician',
      avatar:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    bmet: {
      name: 'David Chen',
      roleLabel: 'BMET Specialist',
      employeeId: 'BMET-2023-089',
      department: 'Biomedical Engineering',
      email: 'david.chen@hospital.com',
      phone: '+1 (555) 234-5678',
      dob: '22 July 1988',
      designation: 'BMET Engineer',
      avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    management: {
      name: 'Sarah Connor',
      roleLabel: 'Hospital Management',
      employeeId: 'HM-2023-012',
      department: 'Administration',
      email: 'sarah.connor@hospital.com',
      phone: '+1 (555) 345-6789',
      dob: '08 November 1985',
      designation: 'Hospital Manager',
      avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    incharge: {
      name: 'Dr. Sarah Connor',
      roleLabel: 'In-Charge',
      employeeId: 'IC-2023-015',
      department: 'Operation Theatre',
      email: 'sarah.connor@hospital.com',
      phone: '+1 (555) 456-7890',
      dob: '30 January 1982',
      designation: 'OT In-Charge',
      avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  };
  const data =
  roleData[currentRole as keyof typeof roleData] || roleData.technician;
  const contactFields = [
  {
    icon: User,
    label: 'Full Name',
    value: data.name
  },
  {
    icon: Calendar,
    label: 'Date of Birth',
    value: data.dob
  },
  {
    icon: Briefcase,
    label: 'Designation',
    value: data.designation
  },
  {
    icon: Building2,
    label: 'Department',
    value: data.department
  },
  {
    icon: IdCard,
    label: 'Employee ID',
    value: data.employeeId
  },
  {
    icon: Mail,
    label: 'Email',
    value: data.email
  },
  {
    icon: Phone,
    label: 'Phone',
    value: data.phone
  }];

  return (
    <div
      className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="w-full px-6 lg:px-8 pt-8 pb-8">
        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start max-w-5xl mx-auto">
          {/* LEFT COLUMN - Profile Card */}
          <motion.div
            initial={{
              y: 10,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-6 lg:mb-0">

            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-slate-100 dark:border-slate-700">
                <img
                  src={data.avatar}
                  alt={data.name}
                  className="w-full h-full object-cover" />

              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {data.name}
              </h1>

              {/* Role */}
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                {data.roleLabel}
              </p>

              {/* Employee ID */}
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {data.employeeId}
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{
                y: 10,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.05
              }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
                Contact Information
              </h2>

              <div className="space-y-5">
                {contactFields.map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <motion.div
                      key={field.label}
                      initial={{
                        y: 8,
                        opacity: 0
                      }}
                      animate={{
                        y: 0,
                        opacity: 1
                      }}
                      transition={{
                        delay: 0.08 + index * 0.04
                      }}
                      className="flex items-start gap-4">

                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                          {field.label}
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {field.value}
                        </p>
                      </div>
                    </motion.div>);

                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BottomNavigation role={currentRole as any} />
    </div>);

}