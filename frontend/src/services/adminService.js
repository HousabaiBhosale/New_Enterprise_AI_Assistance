import { fetchFromAPI } from './api';

export const adminService = {
    getAuditLogs: () => fetchFromAPI('/admin/audit-logs'),
    getUsers: () => fetchFromAPI('/admin/users'),
    getRoles: () => fetchFromAPI('/admin/roles'),
    getPermissions: () => fetchFromAPI('/admin/permissions')
};
