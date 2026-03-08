import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ─── AUTH ─── */
export const authAPI = {
  register: (data)        => api.post('/auth/register', data),
  login:    (data)        => api.post('/auth/login', data),
  getMe:    ()            => api.get('/auth/me'),
  updateProfile: (data)   => api.put('/auth/profile', data),
};

/* ─── ALGORITHMS ─── */
export const algorithmAPI = {
  getAll:     ()          => api.get('/algorithms'),
  getById:    (id)        => api.get(`/algorithms/${id}`),
  getByType:  (type)      => api.get(`/algorithms/type/${type}`),
  execute:    (data)      => api.post('/algorithms/execute', data),
  getSaved:   ()          => api.get('/algorithms/saved'),
  saveConfig: (data)      => api.post('/algorithms/saved', data),
  deleteSaved:(id)        => api.delete(`/algorithms/saved/${id}`),
};

/* ─── HISTORY ─── */
export const historyAPI = {
  // GET /history?page=1&limit=20&algorithmType=bubble-sort
  getAll:   (params = {}) => api.get('/history', { params }),

  // GET /history/stats
  getStats: ()            => api.get('/history/stats'),

  // GET /history/:id
  getById:  (id)          => api.get(`/history/${id}`),

  // DELETE /history/:id
  delete:   (id)          => api.delete(`/history/${id}`),

  // DELETE /history  (clears all, optional ?algorithmType=...)
  clear:    (type)        => api.delete('/history', type ? { params: { algorithmType: type } } : {}),
};

export default api;