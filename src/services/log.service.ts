import apiClient from "./api-client";

export interface AuditLog {
  id: string;
  prompt: string;
  aiResponse: string;
  modelUsed: string;
  latency: number;
  userId: string;
  createdAt: string;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  model?: string;
}

export interface AuditLogResponse {
  success: boolean;
  data: {
    logs: AuditLog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const logService = {
  getAuditLogs: async (params?: AuditLogParams): Promise<AuditLogResponse> => {
    const response = await apiClient.get('/api/v1/user/ai-history', { params });
    return response.data;
  },
};