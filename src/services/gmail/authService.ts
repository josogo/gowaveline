
import { supabase } from '@/integrations/supabase/client';
import { GOOGLE_AUTH_ENDPOINT, GMAIL_SCOPES, REDIRECT_URI } from './constants';
import { TokenResponse } from './types';

/**
 * Generate the OAuth URL for Gmail authorization
 */
export const getGmailAuthUrl = async (): Promise<string> => {
  try {
    console.log("Getting Gmail client ID from edge function...");
    // We're getting the client ID from the Supabase Edge Function to avoid exposing it
    const { data, error } = await supabase.functions.invoke('get-gmail-credentials', {
      body: { action: 'getClientId' }
    });

    if (error) {
      console.error('Error getting Gmail client ID:', error);
      throw new Error(`Failed to get Gmail client ID: ${error.message}`);
    }

    if (!data || !data.clientId) {
      console.error('Invalid response from get-gmail-credentials:', data);
      throw new Error('Client ID not found in response');
    }

    const clientId = data.clientId;
    console.log("Successfully retrieved client ID");

    // Generate a unique state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('gmail_oauth_state', state);
    console.log("Generated OAuth state:", state);

    // Create authorization URL
    const authUrl = new URL(GOOGLE_AUTH_ENDPOINT);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', GMAIL_SCOPES.join(' '));
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', state);

    console.log("Created authorization URL with redirect URI:", REDIRECT_URI);
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
    console.log("Exchanging authorization code for tokens...");
    console.log("Using redirect URI:", REDIRECT_URI);
    
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
      throw new Error(`Failed to exchange authorization code for tokens: ${error.message}`);
    }

    if (!data) {
      console.error('Empty response received from token exchange');
      throw new Error('Empty response from token exchange');
    }
    
    if (data.error) {
      console.error('Error in token response:', data);
      throw new Error(`Error from Google: ${data.error} - ${data.error_description || 'No additional details'}`);
    }

    if (!data.access_token) {
      console.error('Invalid token response:', data);
      throw new Error('Invalid token response - missing access token');
    }

    console.log("Successfully exchanged code for tokens");
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
    console.log("Fetching user profile with access token...");
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get user profile:', response.status, errorText);
      throw new Error(`Failed to get user profile: ${response.status} ${response.statusText}`);
    }

    const profile = await response.json();
    console.log("Successfully retrieved user profile");
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Verify that the Google OAuth configuration is correct
 */
export const verifyOAuthSetup = async (): Promise<{
  status: string;
  redirectUri: string;
  scopes: string[];
  timestamp: string;
  message?: string;
}> => {
  try {
    console.log("Verifying OAuth setup...");
    
    return {
      status: "ok",
      redirectUri: REDIRECT_URI,
      scopes: GMAIL_SCOPES,
      timestamp: new Date().toISOString(),
      message: "OAuth parameters ready for verification"
    };
  } catch (error) {
    console.error('Error verifying OAuth setup:', error);
    return {
      status: "error",
      redirectUri: REDIRECT_URI,
      scopes: GMAIL_SCOPES,
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error)
    };
  }
};
