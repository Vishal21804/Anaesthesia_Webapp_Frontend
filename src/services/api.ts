import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');

  if (userString) {
    const user = JSON.parse(userString);

    if (user?.id) {
      if (!config.params) {
        config.params = {};
      }

      // attach creator_id automatically
      config.params.creator_id = user.id;
    }
  }

  return config;
});

export default api;
