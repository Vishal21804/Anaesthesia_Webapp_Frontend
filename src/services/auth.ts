import api from './api';
import { LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
  // Optionally, redirect to login screen
  window.location.href = '/login';
};
export const sendForgotPasswordOTP = async (email: string) => {
  const response = await api.post('/api/user/forgot-password/send-otp', { email });
  return response.data;
};

export const verifyForgotPasswordOTP = async (email: string, otp: string) => {
  const response = await api.post('/api/user/forgot-password/verify-otp', { email, otp });
  return response.data;
};

export const resetForgotPassword = async (data: any) => {
  const response = await api.post('/api/user/forgot-password/reset-password', data);
  return response.data;
};
