
import { GmailTokens, GmailUserProfile } from './types';

/**
 * Store Gmail tokens in local storage
 */
export const storeGmailTokens = async (
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  email: string
): Promise<void> => {
  try {
    // In a production application, you would store these in a database table
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
 * Get stored Gmail tokens from local storage
 */
export const getStoredGmailTokens = (): GmailTokens | null => {
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
 * Store Gmail user profile in local storage
 */
export const storeUserProfile = (profile: GmailUserProfile): void => {
  localStorage.setItem('gmail_user_profile', JSON.stringify(profile));
};

/**
 * Get stored Gmail user profile from local storage
 */
export const getStoredUserProfile = (): GmailUserProfile | null => {
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
