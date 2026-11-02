import { fetchFromAPI } from './api';

export const approvalService = {
    getApprovals: () => fetchFromAPI('/approvals'),
    
    takeAction: (approvalId, action, notes = '') => fetchFromAPI(`/approvals/${approvalId}/action`, {
        method: 'POST',
        body: JSON.stringify({ action, notes })
    })
};
