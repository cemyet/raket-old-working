// API Configuration
// Change this URL when you deploy the backend
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-app-name.railway.app'  // Replace with your Railway URL
  : 'http://localhost:8000';

export const API_ENDPOINTS = {
  uploadSeFile: `${API_BASE_URL}/upload-se-file`,
  generateReport: `${API_BASE_URL}/generate-report`,
  testParser: `${API_BASE_URL}/test-parser`,
  health: `${API_BASE_URL}/health`,
  companyInfo: `${API_BASE_URL}/company-info`,
  userReports: `${API_BASE_URL}/user-reports`,
  downloadReport: `${API_BASE_URL}/download-report`,
} as const; 