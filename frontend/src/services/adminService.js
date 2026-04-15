import api from './api';

const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getAuditLogs: async () => {
        const response = await api.get('/admin/audit-logs');
        return response.data;
    },

    activateUser: async (id) => {
        const response = await api.put(`/admin/users/${id}/activate`);
        return response.data;
    },

    deactivateUser: async (id) => {
        const response = await api.put(`/admin/users/${id}/deactivate`);
        return response.data;
    },

    changeRole: async (id, role) => {
        const response = await api.put(`/admin/users/${id}/role`, { role });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }
};

export default adminService;
