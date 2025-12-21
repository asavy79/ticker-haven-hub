/**
 * API Key Service
 * 
 * Handles all API calls for API key management.
 * Uses the same axios instance pattern as other services.
 */

import axiosInstance from "@/lib/api";
import {
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyDTO,
  RevokeApiKeyResponse,
} from "@/types/apiKeys";

export class ApiKeyService {
  /**
   * Create a new API key.
   * 
   * IMPORTANT: The full_key in the response is only shown ONCE.
   * Users must save it immediately - it cannot be retrieved later.
   */
  static async createApiKey(request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const response = await axiosInstance.post<CreateApiKeyResponse>(
      "/api/v1/api-keys/",
      request
    );
    return response.data;
  }

  /**
   * List all API keys for the authenticated user.
   * Returns key metadata only - the actual key values are never returned after creation.
   */
  static async listApiKeys(): Promise<ApiKeyDTO[]> {
    const response = await axiosInstance.get<ApiKeyDTO[]>("/api/v1/api-keys/");
    return response.data;
  }

  /**
   * Revoke (deactivate) an API key.
   * This is a soft delete - the key will no longer work but still appears in the list.
   * Revoked keys cannot be reactivated.
   */
  static async revokeApiKey(apiKeyId: number): Promise<RevokeApiKeyResponse> {
    const response = await axiosInstance.delete<RevokeApiKeyResponse>(
      `/api/v1/api-keys/${apiKeyId}`
    );
    return response.data;
  }
}

