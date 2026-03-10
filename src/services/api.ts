import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    // Automatically attach user_id to requests
    if (user && user.id) {
      if (config.method === 'get') {
        if (!config.params) {
          config.params = {};
        }
        // For GET requests, add creator_id to params, except for dashboard endpoints
        if (!config.url?.includes('/dashboard/')) {
          config.params.creator_id = user.id;
        }
      } else if (config.method === 'post' && config.data) {
        // For POST requests, add user_id to the body
        // Ensure config.data is an object
        if (typeof config.data === 'object' && config.data !== null && !Array.isArray(config.data)) {
            config.data.user_id = user.id;
        } else {
            // If config.data is not a typical object, we might need to handle it differently
            // For now, we'll assume JSON data and wrap it if necessary
            try {
                let data = JSON.parse(config.data);
                data.user_id = user.id;
                config.data = JSON.stringify(data);
            } catch (e) {
                // Not a JSON string, do nothing
            }
        }
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
