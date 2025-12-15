import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: any) => api.post('/auth/register', data),
};

// Restaurants API
export const restaurantsAPI = {
    getAll: () => api.get('/restaurants'),
    getMenu: (id: string) => api.get(`/restaurants/${id}/menu`),
};

// Orders API
export const ordersAPI = {
    create: () => api.post('/orders'),
    addItem: (orderId: string, menuItemId: string, quantity: number) =>
        api.post(`/orders/${orderId}/items`, { menuItemId, quantity }),
    checkout: (orderId: string) => api.post(`/orders/${orderId}/checkout`),
    cancel: (orderId: string) => api.post(`/orders/${orderId}/cancel`),
};

// Payments API
export const paymentsAPI = {
    update: (id: string, data: any) => api.put(`/payments/${id}`, data),
};