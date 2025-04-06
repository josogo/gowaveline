
import { supabase } from '@/integrations/supabase/client';
import { GOOGLE_AUTH_ENDPOINT, GMAIL_SCOPES, REDIRECT_URI } from './constants';
import { TokenResponse } from './types';

/**
 * Generate the OAuth URL for Gmail authorization
 */
export const getGmailAuthUrl = async (): Promise<string> => {
  try {
    // We're getting the client ID from the Supabase Edge Function to avoid exposing it
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
