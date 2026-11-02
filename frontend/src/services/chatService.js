import { fetchFromAPI } from './api';

export const chatService = {
    sendQuery: (query, userId = 1, history = [], userRole = 'admin') => fetchFromAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_id: userId, user_role: userRole, history })
    })
};
