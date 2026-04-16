import api from './api';

export const getMachineTypes = async () => {
  const response = await api.get('/api/machine/types');
  return response.data;
};

export const addMachine = async (data: any, creatorId: number) => {
  const response = await api.post('/api/machine/add', data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getMachineList = async (creatorId: number) => {
  const response = await api.get('/api/machine/list', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const assignMachine = async (otId: number, machineId: number, serialNumber: string, creatorId: number) => {
  const response = await api.post('/api/machine/assign', null, {
    params: {
      ot_id: otId,
      machine_id: machineId,
      serial_number: serialNumber,
      creator_id: creatorId
    }
  });
  return response.data;
};

export const getOTMachines = async (otId: number, creatorId: number) => {
  const response = await api.get(`/api/ot/${otId}/machines`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getAvailableMachines = async (creatorId: number) => {
  const response = await api.get('/api/machine/available', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getUserAssignedOTs = async (userId: number, creatorId: number) => {
  const response = await api.get(`/api/user/${userId}/assigned-ots`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const inspectMachine = async (data: { machine_id: number, user_id: number, status: string, remarks?: string, priority?: string }) => {
  const response = await api.post('/api/machine/inspect', null, {
    params: {
      machine_id: data.machine_id,
      creator_id: data.user_id,
      status: data.status,
      remarks: data.remarks || "",
      priority: data.priority || null
    }
  });
  return response.data;
};

export const getMachineHistory = async (creatorId: number, status?: string) => {
  const response = await api.get('/api/machine/history', {
    params: { creator_id: creatorId, status }
  });
  return response.data;
};

export const getMachineServiceHistory = async (creatorId: number) => {
  const response = await api.get('/api/history/machines', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getMachineDetails = async (machineId: number, creatorId: number) => {
  const response = await api.get(`/api/machine/${machineId}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const updateMachine = async (machineId: number, data: any, creatorId: number) => {
  const response = await api.put(`/api/machine/update/${machineId}`, data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const updateMachineTemplate = async (machineId: number, data: any, creatorId: number) => {
  const response = await api.put(`/api/machine/update-template/${machineId}`, data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getInspectionDetails = async (inspectionId: number, creatorId: number) => {
  const response = await api.get(`/api/inspection/details/${inspectionId}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
}; export const getMachineHistoryById = async (id: number, creatorId: number) => {
  const response = await api.get(`/api/history/machines/${id}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getReportHistory = async (creatorId: number) => {
  const response = await api.get('/api/reports/history', {
    params: { creator_id: creatorId }
  });

  return response.data;
};
