import api from './api';

export const getHMDashboard = async (userId: number) => {
  const response = await api.get(`/api/dashboard/hm/${userId}`);
  return response.data.data;
};

export const getATDashboard = async (userId: number) => {
  const response = await api.get(`/api/dashboard/at/${userId}`);
  return response.data;
};

export const getReportHistory = async (creatorId: number) => {
  const response = await api.get('/api/reports/history', {
    params: { creator_id: creatorId }
  });
  return response.data;
};

/* ADD THIS */

export const getBMETDashboard = async (userId: number) => {
  const response = await api.get(`/api/dashboard/bmet/${userId}`);
  return response.data.data;
};