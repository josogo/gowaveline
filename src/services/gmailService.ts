
import { supabase } from '@/integrations/supabase/client';

// Gmail OAuth Configuration
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
];

// This would come from environment variables in a production app
const REDIRECT_URI = window.location.origin + '/admin/gmail-integration';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Generate the OAuth URL for Gmail authorization
 */
export const getGmailAuthUrl = async (): Promise<string> => {
  try {
    // In a real implementation, we would get the client ID from the server
    // Here we're getting it from Supabase Edge Function to avoid exposing it
    const { data, error } = await supabase.functions.invoke('get-gmail-credentials', {
      body: { action: 'getClientId' }
    });

    if (error) {
      console.error('Error getting Gmail client ID:', error);
      throw new Error('Failed to get Gmail client ID');
    }

    const clientId = data.clientId;
    if (!clientId) {
      throw new Error('Client ID not found');
    }

    // Generate a unique state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('gmail_oauth_state', state);

    // Create authorization URL
    const authUrl = new URL(GOOGLE_AUTH_ENDPOINT);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', GMAIL_SCOPES.join(' '));
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', state);

    return authUrl.toString();
  } catch (error) {
    console.error('Error generating Gmail auth URL:', error);
    throw error;
  }
};

/**
 * Exchange authorization code for access and refresh tokens
 */
export const exchangeCodeForTokens = async (code: string): Promise<TokenResponse> => {
  try {
    // Exchange the code for tokens using Supabase Edge Function
    // This is more secure than doing it client-side
    const { data, error } = await supabase.functions.invoke('get-gmail-credentials', {
      body: { 
        action: 'exchangeCode',
        code,
        redirectUri: REDIRECT_URI
      }
    });

    if (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }

    return data;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

/**
 * Get user profile information using the access token
 */
export const getGmailUserProfile = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get emails from Gmail using the access token
 */
export const getGmailEmails = async (accessToken: string, maxResults = 10): Promise<any[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('gmail-api', {
      body: { 
        action: 'listMessages',
        accessToken,
        maxResults
      }
    });

    if (error) {
      console.error('Error getting Gmail emails:', error);
      throw new Error('Failed to get Gmail emails');
    }

    return data.messages || [];
  } catch (error) {
    console.error('Error getting Gmail emails:', error);
    throw error;
  }
};

/**
 * Send an email using the Gmail API
 */
export const sendGmailEmail = async (
  accessToken: string, 
  to: string, 
  subject: string, 
  body: string
): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('gmail-api', {
      body: { 
        action: 'sendEmail',
        accessToken,
        to,
        subject,
        body
      }
    });

    if (error) {
      console.error('Error sending Gmail email:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Error sending Gmail email:', error);
    throw error;
  }
};

/**
 * Store Gmail tokens in the database
 */
export const storeGmailTokens = async (
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  email: string
): Promise<void> => {
  try {
    // In a real application, you would store these in a database table
    // For demo purposes, we're using localStorage
    const tokens = {
      accessToken,
      refreshToken,
      expiresAt,
      email,
      userId
    };
    
    localStorage.setItem('gmail_tokens', JSON.stringify(tokens));
  } catch (error) {
    console.error('Error storing Gmail tokens:', error);
    throw error;
  }
};

/**
 * Get stored Gmail tokens
 */
export const getStoredGmailTokens = (): {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  userId: string;
} | null => {
  try {
    const tokensStr = localStorage.getItem('gmail_tokens');
    if (!tokensStr) {
      return null;
    }
    
    return JSON.parse(tokensStr);
  } catch (error) {
    console.error('Error getting stored Gmail tokens:', error);
    return null;
  }
};

/**
 * Clear stored Gmail tokens (logout)
 */
export const clearGmailTokens = (): void => {
  localStorage.removeItem('gmail_tokens');
  localStorage.removeItem('gmail_user_profile');
  localStorage.removeItem('gmail_oauth_state');
};

/**
 * Store Gmail user profile
 */
export const storeUserProfile = (profile: any): void => {
  localStorage.setItem('gmail_user_profile', JSON.stringify(profile));
};

/**
 * Get stored Gmail user profile
 */
export const getStoredUserProfile = (): any => {
  try {
    const profileStr = localStorage.getItem('gmail_user_profile');
    if (!profileStr) {
      return null;
    }
    
    return JSON.parse(profileStr);
  } catch (error) {
    console.error('Error getting stored Gmail user profile:', error);
    return null;
  }
};
