import api from './api';

export const appointmentService = {
    getAll: async (params = {}) => {
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    book: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },

    reschedule: async (id, data) => {
        const response = await api.put(`/appointments/${id}/reschedule`, data);
        return response.data;
    },

    cancel: async (id, cancelReason) => {
        const response = await api.put(`/appointments/${id}/cancel`, { cancelReason });
        return response.data;
    },

    getProviderBookings: async (params = {}) => {
        const response = await api.get('/appointments/provider/bookings', { params });
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/appointments/${id}/status`, { status });
        return response.data;
    },
};
