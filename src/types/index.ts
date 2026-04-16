export type Role = "HM" | "AT" | "BMET" | "incharge" | "technician";
export type UserRole = Role | 'management' | 'admin' | 'bmet';


export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  hospital_id: number;
  profile_pic: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  user: User;
  message?: string;
}

// Only two statuses: working and broken (not working)
export type MachineStatus = 'working' | 'broken';

// Machine Priority attribute
export type MachinePriority = 'high' | 'medium' | 'low';

// Issue Severity (metadata only, not a status)
export type IssueSeverity = 'critical' | 'minor';

export interface Machine {
  id: number;
  machine_name: string;
  serial_number: string;
  machine_type: string;
  status: MachineStatus;
  assigned_ots: number[];
}

export interface OT {
  id: number;
  ot_name: string;
  location: string;
  machines_assigned: number;
  issues_count: number;
  status: string;
  machine_count?: number;
}

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus =
  'pending' |
  'in-progress' |
  'resolved' |
  'escalated' |
  'under-maintenance';

export interface Issue {
  id: number;
  machine_name: string;
  ot_name: string;
  type: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  reported_at: string;
}

export type ChecklistItemStatus = 'not-checked' | 'working' | 'not-working';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  notes?: string;
  severity?: IssueSeverity;
  photoUrl?: string;
  voiceNote?: string;
}

// Checklist Session for time tracking
export interface ChecklistSession {
  id: string;
  machineId: string;
  machineName: string;
  otId: string;
  otName: string;
  technicianId: string;
  technicianName: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  status: 'in-progress' | 'completed' | 'paused';
  items: ChecklistItem[];
  isOffline?: boolean;
  syncStatus?: 'synced' | 'pending' | 'failed';
}

export interface ChecklistHistory {
  id: number;
  machine_name: string;
  machine_type: string;
  serial_number: string;
  status: 'working' | 'issues' | 'resolved' | 'pending';
  date: string;
  checked_by: string;
}

// Configuration Warning - OT Mismatch Reports (HM only)
export type ConfigurationWarningReason =
  'machine_not_present' |
  'wrong_ot_assignment' |
  'duplicate_machine';

export type ConfigurationWarningStatus = 'open' | 'acknowledged' | 'resolved';

export interface ConfigurationWarning {
  id: string;
  machineId: string;
  machineName: string;
  serialNumber: string;
  reportedOT: string;
  reason: ConfigurationWarningReason;
  notes?: string;
  reportedBy: string;
  reportedAt: string;
  status: ConfigurationWarningStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: 'ot_corrected' | 'machine_deactivated' | 'other';
  resolutionNotes?: string;
}

// Audit Trail Entry
export interface AuditEntry {
  id: string;
  timestamp: string;
  action:
  'checklist_completed' |
  'issue_reported' |
  'issue_resolved' |
  'priority_changed' |
  'user_enabled' |
  'user_disabled' |
  'ot_assigned' |
  'machine_added' |
  'machine_deactivated' |
  'config_warning_reported' |
  'config_warning_resolved';
  performedBy: string;
  performedByRole: Role;
  targetType: 'machine' | 'issue' | 'user' | 'checklist' | 'config_warning';
  targetId: string;
  targetName: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
}

// Notification
export interface Notification {
  id: string;
  type:
  'issue_acknowledged' |
  'issue_assigned' |
  'overdue_check' |
  'issue_resolved' |
  'access_granted' |
  'access_revoked' |
  'config_warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRole: Role;
  targetUserId?: string;
  relatedId?: string;
  relatedType?: 'issue' | 'machine' | 'checklist' | 'config_warning';
}

// Compliance Metrics
export interface ComplianceMetrics {
  otId: string;
  otName: string;
  totalMachines: number;
  checkedToday: number;
  overdueCount: number;
  compliancePercentage: number;
}

// Checklist Submission for In-Charge Review
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ChecklistSubmission {
  id: string;
  machineId: string;
  machineName: string;
  otId: string;
  otName: string;
  technicianId: string;
  technicianName: string;
  submittedAt: string;
  status: SubmissionStatus;
  itemsPassed: number;
  itemsFailed: number;
  totalItems: number;
  issuesReported: number;
  duration: number; // in minutes
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  overrideReason?: string;
  notes?: string;
}

// Checklist Template
export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  category: string; // e.g., 'Anesthesia Workstation', 'Patient Monitor'
  itemCount: number;
  criticalItemCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Checklist Template Item
export interface ChecklistTemplateItem {
  id: string;
  templateId: string;
  label: string;
  category: 'pre-use' | 'during-use' | 'post-use';
  isCritical: boolean;
  helpText?: string;
  order: number;
}

// OT Room for Management
export interface OTRoom {
  id: string;
  name: string;
  code: string;
  location?: string;
  description?: string;
  machineCount: number;
  isActive: boolean;
  createdAt: string;
}

// Repair Status for BMET
export type RepairStatus = 'under-repair' | 'repaired' | 'not-repairable';

export interface RepairRecord {
  id: string;
  issueId: string;
  machineId: string;
  machineName: string;
  status: RepairStatus;
  partsReplaced?: string;
  timeSpent?: number; // in minutes
  notes?: string;
  technicianId: string;
  technicianName: string;
  startedAt: string;
  completedAt?: string;
}

// Machine Timeline Event for BMET
export type TimelineEventType =
  'checklist_completed' |
  'issue_reported' |
  'repair_started' |
  'repair_completed' |
  'status_changed' |
  'maintenance_scheduled';

export interface MachineTimelineEvent {
  id: string;
  machineId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  metadata?: Record<string, any>;
}