import { fetchFromAPI } from './api';

export const salesService = {
    getStats: () => fetchFromAPI('/sales/stats'),
    askSalesQuestion: (query, history = null) => fetchFromAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_role: 'sales', history })
    })
};
