import api from './api';

export const addOT = async (data: any, creatorId: number) => {
  const response = await api.post('/api/ot/add', data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getOTList = async (creatorId: number) => {
  const response = await api.get('/api/ot/list', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getOTDetails = async (id: number, creatorId: number) => {
  const response = await api.get(`/api/ot/${id}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const updateOT = async (id: number, data: any, creatorId: number) => {
  const response = await api.put(`/api/ot/update/${id}`, data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const deleteOT = async (id: number, creatorId: number) => {
  const response = await api.delete(`/api/ot/delete/${id}`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const assignOT = async (
  data: { user_id: number; ot_id: number },
  creatorId: number
) => {
  const response = await api.post('/api/ot/assign', data, {
    params: { creator_id: creatorId }
  });
  return response.data;
};

export const getAvailableOTs = async (
  creatorId: number,
  userRole: string
) => {
  const response = await api.get('/api/ot/available', {
    params: { creator_id: creatorId, user_role: userRole }
  });
  return response.data;
};

export const getUserOTAssignments = async (
  userId: number,
  creatorId: number
) => {
  const response = await api.get('/api/ot/user_assignments', {
    params: { user_id: userId, creator_id: creatorId }
  });
  return response.data;
};

export const unassignOT = async (
  userId: number,
  otId: number,
  creatorId: number
) => {
  const response = await api.delete('/api/ot/unassign', {
    params: { user_id: userId, ot_id: otId, creator_id: creatorId }
  });
  return response.data;
};

export const getAssignedOTs = async (userId: number, creatorId: number) => {
  const response = await api.get(`/api/user/${userId}/assigned-ots`, {
    params: { creator_id: creatorId }
  });
  return response.data;
};
