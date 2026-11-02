import { fetchFromAPI } from './api';

export const documentService = {
    getDocuments: () => fetchFromAPI('/documents'),
    
    uploadDocument: (file, category = 'General') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        return fetchFromAPI('/documents/upload', {
            method: 'POST',
            body: formData
        });
    },

    createDocument: (data) => fetchFromAPI('/documents/create', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getDocumentContent: (docId) => fetchFromAPI(`/documents/${docId}/content`),

    searchDocuments: (query, category = null, limit = 4) => fetchFromAPI('/documents/search', {
        method: 'POST',
        body: JSON.stringify({ query, category, limit })
    }),

    deleteDocument: (docId) => fetchFromAPI(`/documents/${docId}`, {
        method: 'DELETE'
    })
};
