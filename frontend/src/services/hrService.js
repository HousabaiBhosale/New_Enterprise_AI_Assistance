import { fetchFromAPI } from './api';

export const hrService = {
    getStats: () => fetchFromAPI('/hr/stats'),
    askPolicyQuestion: (query, userId = 1) => fetchFromAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_id: userId })
    })
};

