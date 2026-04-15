import api from './api';

export const serviceService = {
    getAll: async (params = {}) => {
        const response = await api.get('/services', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    create: async (serviceData) => {
        const response = await api.post('/services', serviceData);
        return response.data;
    },

    update: async (id, serviceData) => {
        const response = await api.put(`/services/${id}`, serviceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },

    getMyServices: async () => {
        const response = await api.get('/services/provider/my-services');
        return response.data;
    },
};
