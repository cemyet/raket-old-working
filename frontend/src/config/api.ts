// API Configuration
export const API_BASE_URL = 'https://web-production-39242.up.railway.app';  // Railway backend deployment

export const API_ENDPOINTS = {
  uploadSeFile: `${API_BASE_URL}/upload-se-file`,
  generateReport: `${API_BASE_URL}/generate-report`,
  testParser: `${API_BASE_URL}/test-parser`,
  health: `${API_BASE_URL}/health`,
  companyInfo: `${API_BASE_URL}/company-info`,
  userReports: `${API_BASE_URL}/user-reports`,
  downloadReport: `${API_BASE_URL}/download-report`,
  recalculateInk2: `${API_BASE_URL}/api/recalculate-ink2`,
} as const; 