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


export const getIssues = async (userId: number) => {

  const response = await api.get("/api/issues", {
    params: { user_id: userId }
  });

  return response.data.data;

};

export const updateIssue = async (id: number, data: any, creatorId: number) => {
  const response = await api.put(`/api/issues/${id}`, data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const createIssue = async (data: any) => {
  const response = await api.post('/api/issues', data);
  return response.data;
};
