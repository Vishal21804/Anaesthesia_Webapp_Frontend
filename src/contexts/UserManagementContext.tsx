import React, { useEffect, useState, createContext, useContext } from 'react';
import { UserRole } from '../types';
export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  assignedOTs: string[];
  joinDate: string;
  profile_pic?: string;
  lastLogin?: string;
}
interface UserManagementContextType {
  users: ManagedUser[];
  addUser: (user: Omit<ManagedUser, 'id'>) => void;
  updateUser: (id: string, updates: Partial<ManagedUser>) => void;
  toggleUserAccess: (id: string) => void;
  assignOTs: (userId: string, otIds: string[]) => void;
  canUserLogin: (
    email: string,
    role: UserRole)
    => {
      allowed: boolean;
      reason?: string;
    };
}
const UserManagementContext = createContext<
  UserManagementContextType | undefined>(
    undefined);
export function UserManagementProvider({
  children


}: { children: React.ReactNode; }) {
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    const saved = localStorage.getItem('managedUsers');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default mock users
    return [
      {
        id: 'user-1',
        name: 'Alex Taylor',
        email: 'alex.taylor@hospital.com',
        role: 'technician' as UserRole,
        enabled: true,
        assignedOTs: ['OT-1', 'OT-2'],
        joinDate: '2023-01-15',
        lastLogin: '2024-01-28'
      },
      {
        id: 'user-2',
        name: 'David Chen',
        email: 'david.chen@hospital.com',
        role: 'bmet' as UserRole,
        enabled: true,
        assignedOTs: ['OT-1', 'OT-2', 'OT-3'],
        joinDate: '2023-03-10',
        lastLogin: '2024-01-27'
      },
      {
        id: 'user-3',
        name: 'Maria Garcia',
        email: 'maria.garcia@hospital.com',
        role: 'technician' as UserRole,
        enabled: false,
        assignedOTs: [],
        joinDate: '2023-06-20'
      },
      {
        id: 'user-4',
        name: 'James Wilson',
        email: 'james.wilson@hospital.com',
        role: 'bmet' as UserRole,
        enabled: true,
        assignedOTs: ['OT-4', 'OT-5'],
        joinDate: '2023-08-05',
        lastLogin: '2024-01-26'
      }];

  });
  useEffect(() => {
    localStorage.setItem('managedUsers', JSON.stringify(users));
  }, [users]);
  const addUser = (user: Omit<ManagedUser, 'id'>) => {
    const newUser: ManagedUser = {
      ...user,
      id: `user-${Date.now()}`
    };
    setUsers((prev) => [...prev, newUser]);
  };
  const updateUser = (id: string, updates: Partial<ManagedUser>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ?
          {
            ...user,
            ...updates
          } :
          user
      )
    );
  };
  const toggleUserAccess = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ?
          {
            ...user,
            enabled: !user.enabled
          } :
          user
      )
    );
  };
  const assignOTs = (userId: string, otIds: string[]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ?
          {
            ...user,
            assignedOTs: otIds
          } :
          user
      )
    );
  };
  const canUserLogin = (
    email: string,
    role: UserRole)
    : {
      allowed: boolean;
      reason?: string;
    } => {
    const user = users.find((u) => u.email === email && u.role === role);
    if (!user) {
      return {
        allowed: false,
        reason: 'User not found'
      };
    }
    if (!user.enabled) {
      return {
        allowed: false,
        reason:
          'Your account access is restricted. Please contact Hospital Management.'
      };
    }
    if (user.assignedOTs.length === 0) {
      return {
        allowed: false,
        reason: 'No OT assignments found. Please contact Hospital Management.'
      };
    }
    return {
      allowed: true
    };
  };
  return (
    <UserManagementContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        toggleUserAccess,
        assignOTs,
        canUserLogin
      }}>

      {children}
    </UserManagementContext.Provider>);

}
export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error(
      'useUserManagement must be used within UserManagementProvider'
    );
  }
  return context;
}
