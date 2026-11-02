import { fetchFromAPI, API_BASE_URL } from './api';

export const reportService = {
    getReports: () => fetchFromAPI('/reports'),
    
    generateReport: (reportType, fileFormat = 'pdf') => fetchFromAPI('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({ report_type: reportType, file_format: fileFormat })
    }),

    getDownloadUrl: (filename) => `${API_BASE_URL}/reports/download/${encodeURIComponent(filename)}`
};
