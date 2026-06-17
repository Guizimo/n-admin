import { apiRequest } from './base';

export class AiAPI {
  static async getInsights() {
    return apiRequest('/ai/insights');
  }
}
