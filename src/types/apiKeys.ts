/**
 * TypeScript types for API Key management.
 * Matches the backend DTOs in quantx/api/routes/v1/api_keys/dto.py
 */

/** Request to create a new API key */
export interface CreateApiKeyRequest {
  name: string;
  expires_in_days?: number | null;
}

/** 
 * Response when creating a new API key.
 * IMPORTANT: full_key is only returned ONCE at creation time.
 */
export interface CreateApiKeyResponse {
  id: number;
  key_prefix: string;
  full_key: string; // Only shown once!
  name: string;
  created_at: string;
  expires_at: string | null;
}

/** API key info returned when listing keys (without the actual key) */
export interface ApiKeyDTO {
  id: number;
  key_prefix: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

/** Response when revoking an API key */
export interface RevokeApiKeyResponse {
  success: boolean;
  message: string;
}

