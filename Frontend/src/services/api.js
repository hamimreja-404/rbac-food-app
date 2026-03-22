import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── Restaurants ───────────────────────────────────────
export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getOne: (id) => api.get(`/restaurants/${id}`),
};

// ── Orders ────────────────────────────────────────────
export const orderAPI = {
create: (data) => api.post('/orders', data),
  
  // The checkout function we fixed earlier
  checkout: (id, data) => api.put(`/orders/${id}/checkout`, data),
  
  // 🆕 YOU MUST HAVE THIS LINE TO FETCH ORDERS:
  getMyOrders: () => api.get('/orders/my'),
  
  // And your cancel function
  cancel: (id) => api.delete(`/orders/${id}`)
};

// ── Payment ───────────────────────────────────────────
export const paymentAPI = {
  update: (data) => api.put('/payment', data),
};

export default api;
