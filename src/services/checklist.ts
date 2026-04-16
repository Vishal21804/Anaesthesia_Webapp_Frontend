import api from './api';

export const getChecklistMachines = async (userId: number, otId: number) => {
  const res = await api.get(`/api/checklist/machines/${userId}`, {
    params: { ot_id: otId }
  });
  return res.data;
};

export const setResetTime = async (resetTime: string, creatorId: number) => {
  const response = await api.post('/api/checklist/reset-time', { reset_time: resetTime }, {
    params: { creator_id: creatorId }
  });
  return response.data;
};
