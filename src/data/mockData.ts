import { Machine, OT, Issue, ChecklistItem } from '../types';

export const mockOTs: OT[] = [
{ id: 'ot-1', name: 'Operation Theatre 1', machineCount: 4, activeIssues: 0 },
{ id: 'ot-2', name: 'Operation Theatre 2', machineCount: 3, activeIssues: 1 },
{ id: 'ot-3', name: 'Operation Theatre 3', machineCount: 5, activeIssues: 2 },
{ id: 'icu', name: 'ICU Ward', machineCount: 8, activeIssues: 0 },
{ id: 'rec', name: 'Recovery Ward', machineCount: 6, activeIssues: 1 }];


export const mockMachines: Machine[] = [
// Operation Theatre 1 - 4 machines
{
  id: 'm-1',
  name: 'Drager Fabius GS',
  model: 'Anesthesia Workstation',
  serialNumber: 'SN-2023-001',
  otId: 'ot-1',
  assignedOTIds: ['ot-1', 'ot-2'], // Demo multi-assignment
  status: 'working',
  priority: 'high',
  lastChecked: '2 hours ago',
  nextMaintenance: '2024-06-15'
},
{
  id: 'm-2',
  name: 'GE Datex-Ohmeda',
  model: 'Avance CS2',
  serialNumber: 'SN-2023-042',
  otId: 'ot-1',
  assignedOTIds: ['ot-1'],
  status: 'broken',
  priority: 'high',
  lastChecked: 'Yesterday',
  nextMaintenance: '2024-05-20'
},
{
  id: 'm-3',
  name: 'Mindray WATO EX-65',
  model: 'Anesthesia System',
  serialNumber: 'SN-2023-078',
  otId: 'ot-1',
  assignedOTIds: ['ot-1'],
  status: 'working',
  priority: 'medium',
  lastChecked: '5 hours ago',
  nextMaintenance: '2024-07-10'
},
{
  id: 'm-4',
  name: 'Philips IntelliVue MP70',
  model: 'Patient Monitor',
  serialNumber: 'SN-2022-189',
  otId: 'ot-1',
  assignedOTIds: ['ot-1'],
  status: 'working',
  priority: 'medium',
  lastChecked: '3 hours ago',
  nextMaintenance: '2024-06-25'
},

// Operation Theatre 2 - 3 machines
{
  id: 'm-5',
  name: 'Philips IntelliVue',
  model: 'MX800 Monitor',
  serialNumber: 'SN-2022-156',
  otId: 'ot-2',
  assignedOTIds: ['ot-2', 'ot-3'], // Demo multi-assignment
  status: 'working',
  priority: 'low',
  lastChecked: '4 hours ago',
  nextMaintenance: '2024-07-01'
},
{
  id: 'm-6',
  name: 'GE Aisys CS2',
  model: 'Anesthesia Delivery',
  serialNumber: 'SN-2023-134',
  otId: 'ot-2',
  assignedOTIds: ['ot-2'],
  status: 'broken',
  priority: 'high',
  lastChecked: '6 hours ago',
  nextMaintenance: '2024-06-18'
},
{
  id: 'm-7',
  name: 'Drager Perseus A500',
  model: 'Anesthesia Workstation',
  serialNumber: 'SN-2023-201',
  otId: 'ot-2',
  assignedOTIds: ['ot-2'],
  status: 'working',
  priority: 'medium',
  lastChecked: '1 hour ago',
  nextMaintenance: '2024-08-05'
},

// Operation Theatre 3 - 5 machines
{
  id: 'm-8',
  name: 'Maquet Flow-i',
  model: 'C20',
  serialNumber: 'SN-2023-089',
  otId: 'ot-3',
  assignedOTIds: ['ot-3'],
  status: 'broken',
  priority: 'high',
  lastChecked: '1 day ago',
  nextMaintenance: 'Overdue'
},
{
  id: 'm-9',
  name: 'Mindray BeneVision N22',
  model: 'Patient Monitor',
  serialNumber: 'SN-2023-167',
  otId: 'ot-3',
  assignedOTIds: ['ot-3'],
  status: 'working',
  priority: 'low',
  lastChecked: '2 hours ago',
  nextMaintenance: '2024-07-20'
},
{
  id: 'm-10',
  name: 'Philips Avalon FM50',
  model: 'Fetal Monitor',
  serialNumber: 'SN-2022-245',
  otId: 'ot-3',
  assignedOTIds: ['ot-3'],
  status: 'broken',
  priority: 'medium',
  lastChecked: '8 hours ago',
  nextMaintenance: '2024-06-12'
},
{
  id: 'm-11',
  name: 'GE Carescape B850',
  model: 'Patient Monitor',
  serialNumber: 'SN-2023-298',
  otId: 'ot-3',
  assignedOTIds: ['ot-3'],
  status: 'working',
  priority: 'medium',
  lastChecked: '4 hours ago',
  nextMaintenance: '2024-07-30'
},
{
  id: 'm-12',
  name: 'Drager Primus',
  model: 'Anesthesia Workstation',
  serialNumber: 'SN-2022-312',
  otId: 'ot-3',
  assignedOTIds: ['ot-3'],
  status: 'working',
  priority: 'low',
  lastChecked: '7 hours ago',
  nextMaintenance: '2024-06-28'
},

// ICU Ward - 8 machines
{
  id: 'm-13',
  name: 'Philips IntelliVue MX450',
  model: 'Patient Monitor',
  serialNumber: 'SN-2023-401',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'high',
  lastChecked: '1 hour ago',
  nextMaintenance: '2024-08-15'
},
{
  id: 'm-14',
  name: 'Drager Evita V800',
  model: 'Ventilator',
  serialNumber: 'SN-2023-445',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'high',
  lastChecked: '3 hours ago',
  nextMaintenance: '2024-07-22'
},
{
  id: 'm-15',
  name: 'GE Engstrom Carestation',
  model: 'Ventilator',
  serialNumber: 'SN-2022-478',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'broken',
  priority: 'high',
  lastChecked: '5 hours ago',
  nextMaintenance: '2024-06-20'
},
{
  id: 'm-16',
  name: 'Mindray SV300',
  model: 'Ventilator',
  serialNumber: 'SN-2023-512',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'medium',
  lastChecked: '2 hours ago',
  nextMaintenance: '2024-08-01'
},
{
  id: 'm-17',
  name: 'Philips IntelliVue MP5',
  model: 'Patient Monitor',
  serialNumber: 'SN-2023-556',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'medium',
  lastChecked: '4 hours ago',
  nextMaintenance: '2024-07-18'
},
{
  id: 'm-18',
  name: 'Drager Savina 300',
  model: 'Ventilator',
  serialNumber: 'SN-2022-589',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'low',
  lastChecked: '6 hours ago',
  nextMaintenance: '2024-06-30'
},
{
  id: 'm-19',
  name: 'GE Dash 4000',
  model: 'Patient Monitor',
  serialNumber: 'SN-2023-623',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'broken',
  priority: 'medium',
  lastChecked: '9 hours ago',
  nextMaintenance: '2024-06-15'
},
{
  id: 'm-20',
  name: 'Mindray BeneHeart D6',
  model: 'Defibrillator',
  serialNumber: 'SN-2023-667',
  otId: 'icu',
  assignedOTIds: ['icu'],
  status: 'working',
  priority: 'high',
  lastChecked: '1 hour ago',
  nextMaintenance: '2024-08-10'
},

// Recovery Ward - 6 machines
{
  id: 'm-21',
  name: 'Philips SureSigns VM6',
  model: 'Vital Signs Monitor',
  serialNumber: 'SN-2023-701',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'working',
  priority: 'low',
  lastChecked: '2 hours ago',
  nextMaintenance: '2024-07-25'
},
{
  id: 'm-22',
  name: 'GE Dinamap ProCare',
  model: 'Vital Signs Monitor',
  serialNumber: 'SN-2022-734',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'working',
  priority: 'low',
  lastChecked: '5 hours ago',
  nextMaintenance: '2024-06-22'
},
{
  id: 'm-23',
  name: 'Mindray VS-900',
  model: 'Vital Signs Monitor',
  serialNumber: 'SN-2023-778',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'broken',
  priority: 'medium',
  lastChecked: '7 hours ago',
  nextMaintenance: '2024-06-18'
},
{
  id: 'm-24',
  name: 'Drager Oxylog 3000',
  model: 'Transport Ventilator',
  serialNumber: 'SN-2023-812',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'working',
  priority: 'medium',
  lastChecked: '3 hours ago',
  nextMaintenance: '2024-07-28'
},
{
  id: 'm-25',
  name: 'Philips IntelliVue MP2',
  model: 'Portable Monitor',
  serialNumber: 'SN-2022-845',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'working',
  priority: 'low',
  lastChecked: '4 hours ago',
  nextMaintenance: '2024-08-05'
},
{
  id: 'm-26',
  name: 'GE Carescape VC150',
  model: 'Vital Signs Monitor',
  serialNumber: 'SN-2023-889',
  otId: 'rec',
  assignedOTIds: ['rec'],
  status: 'working',
  priority: 'low',
  lastChecked: '6 hours ago',
  nextMaintenance: '2024-07-12'
}];


export const mockIssues: Issue[] = [
{
  id: 'ISS-001',
  machineId: 'm-8',
  machineName: 'Maquet Flow-i',
  otName: 'OT-3',
  type: 'Mechanical',
  description: 'Gas mixer failure alarm persistent',
  priority: 'critical',
  status: 'in-progress',
  reportedBy: 'John Doe',
  reportedAt: '2024-05-10 09:30',
  updatedAt: '2024-05-10 10:15'
},
{
  id: 'ISS-002',
  machineId: 'm-2',
  machineName: 'GE Datex-Ohmeda',
  otName: 'OT-1',
  type: 'Calibration',
  description: 'O2 sensor calibration required',
  priority: 'medium',
  status: 'pending',
  reportedBy: 'Sarah Smith',
  reportedAt: '2024-05-11 08:00'
},
{
  id: 'ISS-003',
  machineId: 'm-1',
  machineName: 'Drager Fabius GS',
  otName: 'OT-1',
  type: 'Software',
  description: 'Display flickering intermittently',
  priority: 'low',
  status: 'resolved',
  reportedBy: 'Mike Johnson',
  reportedAt: '2024-05-09 14:20',
  updatedAt: '2024-05-09 16:00'
}];


export const checklistItems: ChecklistItem[] = [
{
  id: 'c-1',
  label: 'Verify backup power supply (UPS)',
  status: 'not-checked'
},
{
  id: 'c-2',
  label: 'Check high-pressure system & cylinder contents',
  status: 'not-checked'
},
{
  id: 'c-3',
  label: 'Verify low-pressure system integrity',
  status: 'not-checked'
},
{ id: 'c-4', label: 'Calibrate Oxygen sensor', status: 'not-checked' },
{
  id: 'c-5',
  label: 'Check breathing circuit for leaks',
  status: 'not-checked'
},
{
  id: 'c-6',
  label: 'Verify ventilator function & settings',
  status: 'not-checked'
},
{
  id: 'c-7',
  label: 'Test alarm systems (High/Low pressure, O2)',
  status: 'not-checked'
},
{
  id: 'c-8',
  label: 'Check scavenger system function',
  status: 'not-checked'
},
{
  id: 'c-9',
  label: 'Verify suction apparatus pressure',
  status: 'not-checked'
},
{
  id: 'c-10',
  label: 'Check vaporizer filling & locking mechanism',
  status: 'not-checked'
},
{ id: 'c-11', label: 'Verify CO2 absorbent status', status: 'not-checked' },
{
  id: 'c-12',
  label: 'Final visual inspection of all connections',
  status: 'not-checked'
}];


// Helper functions for sequential navigation
export function getMachinesByOT(otId: string): Machine[] {
  return mockMachines.filter((m) => m.otId === otId);
}

export function getNextMachine(
currentMachineId: string,
otId: string)
: Machine | null {
  const machines = getMachinesByOT(otId);
  const currentIndex = machines.findIndex((m) => m.id === currentMachineId);
  if (currentIndex === -1 || currentIndex === machines.length - 1) return null;
  return machines[currentIndex + 1];
}

export function getPreviousMachine(
currentMachineId: string,
otId: string)
: Machine | null {
  const machines = getMachinesByOT(otId);
  const currentIndex = machines.findIndex((m) => m.id === currentMachineId);
  if (currentIndex <= 0) return null;
  return machines[currentIndex - 1];
}

export function getMachinePosition(
machineId: string,
otId: string)
: {current: number;total: number;} {
  const machines = getMachinesByOT(otId);
  const currentIndex = machines.findIndex((m) => m.id === machineId);
  return {
    current: currentIndex + 1,
    total: machines.length
  };
}
