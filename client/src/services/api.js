import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest = 
      originalRequest.url?.includes('/auth/login') || 
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh');
      
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !isAuthRequest) {
      originalRequest._retry = true;

      try {
        await authService.refresh();
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError);
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response;
  },
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response;
  },
  getCurrentUser: () => {
    return api.get('/auth/me');
  }
};

export const productService = {
  getAllProducts: () => {
    return api.get('/products');
  },
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  searchProducts: (params) => {
    return api.get('/products', { params });
  }
};

export const orderService = {
  createOrder: (items) => {
    return api.post('/orders', { items });
  },
  getOrders: () => {
    return api.get('/orders');
  },
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  }
};

export const adminService = {
  getStats: () => {
    return api.get('/admin/stats');
  },
  getUsers: () => {
    return api.get('/admin/users');
  },
  getAllOrders: () => {
    return api.get('/admin/orders');
  },
  createProduct: (productData) => {
    return api.post('/admin/products', productData);
  },
  updateProduct: (id, productData) => {
    return api.put(`/admin/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    return api.delete(`/admin/products/${id}`);
  }
};

export default api; 