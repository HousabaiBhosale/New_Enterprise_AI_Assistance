import { fetchFromAPI } from './api';

export const supportService = {
    getStats: () => fetchFromAPI('/support/stats'),
    askSupportQuestion: (query, history = null) => fetchFromAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_role: 'support', history })
    })
};
