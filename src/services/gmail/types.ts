
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GmailTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  userId: string;
}

export interface GmailUserProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}
