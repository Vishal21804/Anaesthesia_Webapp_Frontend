import api from './api';

export const getIssueOts = async (creatorId: number) => {
  const response = await api.get('/api/issues/ots', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getMachineIssues = async (creatorId: number) => {
  const response = await api.get('/api/issues/machines', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getIssueDetails = async (machineId: number, creatorId: number) => {
  const response = await api.get(`/api/issues/${machineId}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
}

export const resolveIssue = async (machineId: number, creatorId: number, maintenanceNotes?: string) => {
  const response = await api.post(`/api/issues/resolve/${machineId}`, null, {
    params: {
      creator_id: creatorId,
      maintenance_notes: maintenanceNotes
    }
  });
  return response.data;
}
