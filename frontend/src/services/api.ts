import { API_ENDPOINTS } from '@/config/api';

export interface UploadResponse {
  success: boolean;
  company_data: any;
  message: string;
}

export interface TestParserResponse {
  success: boolean;
  accounts_count: number;
  accounts_sample: Record<string, number>;
  rr_count: number;
  rr_sample: any[];
  br_count: number;
  br_sample: any[];
  message: string;
}

class ApiService {
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async uploadSeFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.uploadSeFile, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  }

  async testParser(file: File): Promise<TestParserResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.testParser, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Parser test failed: ${response.status}`);
    }

    return await response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest(API_ENDPOINTS.health);
  }

  async getCompanyInfo(orgNumber: string): Promise<any> {
    return this.makeRequest(`${API_ENDPOINTS.companyInfo}/${orgNumber}`);
  }
}

export const apiService = new ApiService(); 