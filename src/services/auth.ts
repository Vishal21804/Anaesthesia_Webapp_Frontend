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
