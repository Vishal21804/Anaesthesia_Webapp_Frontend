import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
import {
  ChecklistSession,
  AuditEntry,
  Notification,
  Issue,
  IssueSeverity,
  UserRole,
  ConfigurationWarning,
  ConfigurationWarningStatus } from
'../types';
import { mockIssues } from '../data/mockData';
interface AppDataContextType {
  // Checklist Sessions
  sessions: ChecklistSession[];
  currentSession: ChecklistSession | null;
  startSession: (
  session: Omit<ChecklistSession, 'id' | 'startTime' | 'status'>)
  => ChecklistSession;
  updateSession: (id: string, updates: Partial<ChecklistSession>) => void;
  completeSession: (id: string) => void;
  getIncompleteSession: () => ChecklistSession | null;
  // Issues with enhanced data
  issues: Issue[];
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  addIssue: (issue: Omit<Issue, 'id'>) => Issue;
  // Configuration Warnings (HM only)
  configWarnings: ConfigurationWarning[];
  addConfigWarning: (
  warning: Omit<ConfigurationWarning, 'id' | 'reportedAt' | 'status'>)
  => ConfigurationWarning;
  updateConfigWarning: (
  id: string,
  updates: Partial<ConfigurationWarning>)
  => void;
  getOpenWarningsCount: () => number;
  // Notifications
  notifications: Notification[];
  addNotification: (
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>)
  => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (role: UserRole) => number;
  // Audit Trail
  auditTrail: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  // Offline Status
  isOnline: boolean;
  pendingSyncCount: number;
}
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);
export function AppDataProvider({ children }: {children: React.ReactNode;}) {
  // Sessions
  const [sessions, setSessions] = useState<ChecklistSession[]>(() => {
    const saved = localStorage.getItem('checklistSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSession, setCurrentSession] = useState<ChecklistSession | null>(
    null
  );
  // Issues
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('appIssues');
    return saved ? JSON.parse(saved) : mockIssues;
  });
  // Configuration Warnings
  const [configWarnings, setConfigWarnings] = useState<ConfigurationWarning[]>(
    () => {
      const saved = localStorage.getItem('configWarnings');
      return saved ? JSON.parse(saved) : [];
    }
  );
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('appNotifications');
    return saved ?
    JSON.parse(saved) :
    [
    {
      id: 'notif-1',
      type: 'issue_assigned',
      title: 'New Issue Assigned',
      message: 'Critical issue reported for Maquet Flow-i in OT-3',
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: 'bmet' as UserRole
    },
    {
      id: 'notif-2',
      type: 'overdue_check',
      title: 'Overdue Safety Check',
      message: '3 machines in OT-1 have overdue safety checks',
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: 'management' as UserRole
    },
    {
      id: 'notif-3',
      type: 'issue_acknowledged',
      title: 'Issue Acknowledged',
      message: 'BMET team has acknowledged your reported issue',
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: 'technician' as UserRole
    }];

  });
  // Audit Trail
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('auditTrail');
    return saved ? JSON.parse(saved) : [];
  });
  // Online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // Persist data
  useEffect(() => {
    localStorage.setItem('checklistSessions', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem('appIssues', JSON.stringify(issues));
  }, [issues]);
  useEffect(() => {
    localStorage.setItem('configWarnings', JSON.stringify(configWarnings));
  }, [configWarnings]);
  useEffect(() => {
    localStorage.setItem('appNotifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('auditTrail', JSON.stringify(auditTrail));
  }, [auditTrail]);
  // Session functions
  const startSession = useCallback(
    (
    sessionData: Omit<ChecklistSession, 'id' | 'startTime' | 'status'>)
    : ChecklistSession => {
      const newSession: ChecklistSession = {
        ...sessionData,
        id: `session-${Date.now()}`,
        startTime: new Date().toISOString(),
        status: 'in-progress',
        syncStatus: isOnline ? 'synced' : 'pending'
      };
      setSessions((prev) => [...prev, newSession]);
      setCurrentSession(newSession);
      return newSession;
    },
    [isOnline]
  );
  const updateSession = useCallback(
    (id: string, updates: Partial<ChecklistSession>) => {
      setSessions((prev) =>
      prev.map((s) =>
      s.id === id ?
      {
        ...s,
        ...updates
      } :
      s
      )
      );
      if (currentSession?.id === id) {
        setCurrentSession((prev) =>
        prev ?
        {
          ...prev,
          ...updates
        } :
        null
        );
      }
    },
    [currentSession]
  );
  const completeSession = useCallback((id: string) => {
    const endTime = new Date().toISOString();
    setSessions((prev) =>
    prev.map((s) => {
      if (s.id === id) {
        const start = new Date(s.startTime);
        const end = new Date(endTime);
        const duration = Math.round((end.getTime() - start.getTime()) / 60000);
        return {
          ...s,
          endTime,
          duration,
          status: 'completed' as const
        };
      }
      return s;
    })
    );
    setCurrentSession(null);
  }, []);
  const getIncompleteSession = useCallback((): ChecklistSession | null => {
    return sessions.find((s) => s.status === 'in-progress') || null;
  }, [sessions]);
  // Issue functions
  const updateIssue = useCallback((id: string, updates: Partial<Issue>) => {
    setIssues((prev) =>
    prev.map((i) =>
    i.id === id ?
    {
      ...i,
      ...updates,
      updatedAt: new Date().toISOString()
    } :
    i
    )
    );
  }, []);
  const addIssue = useCallback(
    (issueData: Omit<Issue, 'id'>): Issue => {
      const newIssue: Issue = {
        ...issueData,
        id: `ISS-${String(issues.length + 1).padStart(3, '0')}`
      };
      setIssues((prev) => [...prev, newIssue]);
      return newIssue;
    },
    [issues.length]
  );
  // Configuration Warning functions
  const addConfigWarning = useCallback(
    (
    warningData: Omit<ConfigurationWarning, 'id' | 'reportedAt' | 'status'>)
    : ConfigurationWarning => {
      const newWarning: ConfigurationWarning = {
        ...warningData,
        id: `CFG-${String(configWarnings.length + 1).padStart(3, '0')}`,
        reportedAt: new Date().toISOString(),
        status: 'open'
      };
      setConfigWarnings((prev) => [...prev, newWarning]);
      return newWarning;
    },
    [configWarnings.length]
  );
  const updateConfigWarning = useCallback(
    (id: string, updates: Partial<ConfigurationWarning>) => {
      setConfigWarnings((prev) =>
      prev.map((w) =>
      w.id === id ?
      {
        ...w,
        ...updates
      } :
      w
      )
      );
    },
    []
  );
  const getOpenWarningsCount = useCallback((): number => {
    return configWarnings.filter((w) => w.status === 'open').length;
  }, [configWarnings]);
  // Notification functions
  const addNotification = useCallback(
    (notifData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: Notification = {
        ...notifData,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  }, []);
  const getUnreadCount = useCallback(
    (role: UserRole): number => {
      return notifications.filter((n) => !n.read && n.targetRole === role).
      length;
    },
    [notifications]
  );
  // Audit functions
  const addAuditEntry = useCallback(
    (entryData: Omit<AuditEntry, 'id' | 'timestamp'>) => {
      const newEntry: AuditEntry = {
        ...entryData,
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      setAuditTrail((prev) => [newEntry, ...prev]);
    },
    []
  );
  const pendingSyncCount = sessions.filter(
    (s) => s.syncStatus === 'pending'
  ).length;
  return (
    <AppDataContext.Provider
      value={{
        sessions,
        currentSession,
        startSession,
        updateSession,
        completeSession,
        getIncompleteSession,
        issues,
        updateIssue,
        addIssue,
        configWarnings,
        addConfigWarning,
        updateConfigWarning,
        getOpenWarningsCount,
        notifications,
        addNotification,
        markNotificationRead,
        getUnreadCount,
        auditTrail,
        addAuditEntry,
        isOnline,
        pendingSyncCount
      }}>

      {children}
    </AppDataContext.Provider>);

}
export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}