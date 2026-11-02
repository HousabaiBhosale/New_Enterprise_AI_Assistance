import { fetchFromAPI } from './api';

export const hrService = {
    getStats: () => fetchFromAPI('/hr/stats'),
    askPolicyQuestion: (query, userId = 1, history = null) => fetchFromAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_id: userId, user_role: 'hr', history })
    })
};
