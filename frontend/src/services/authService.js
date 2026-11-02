import { fetchFromAPI } from './api';

export const authService = {
    login: async (email, password) => {
        const data = await fetchFromAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.access_token) {
            localStorage.setItem('enterprise_auth_token', data.access_token);
            localStorage.setItem('enterprise_auth_user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (name, email, password, role = 'employee', department = 'General') => {
        const data = await fetchFromAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role, department })
        });
        if (data.access_token) {
            localStorage.setItem('enterprise_auth_token', data.access_token);
            localStorage.setItem('enterprise_auth_user', JSON.stringify(data.user));
        }
        return data;
    },

    getCurrentUser: async () => {
        return fetchFromAPI('/auth/me');
    },

    logout: () => {
        localStorage.removeItem('enterprise_auth_token');
        localStorage.removeItem('enterprise_auth_user');
    }
};
