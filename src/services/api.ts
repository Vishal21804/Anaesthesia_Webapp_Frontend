import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
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
