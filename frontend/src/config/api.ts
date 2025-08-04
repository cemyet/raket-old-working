// API Configuration
export const API_BASE_URL = 'https://raketrapport.se';  // Custom domain set up in Railway

export const API_ENDPOINTS = {
  uploadSeFile: `${API_BASE_URL}/upload-se-file`,
  generateReport: `${API_BASE_URL}/generate-report`,
  testParser: `${API_BASE_URL}/test-parser`,
  health: `${API_BASE_URL}/health`,
  companyInfo: `${API_BASE_URL}/company-info`,
  userReports: `${API_BASE_URL}/user-reports`,
  downloadReport: `${API_BASE_URL}/download-report`,
} as const; 