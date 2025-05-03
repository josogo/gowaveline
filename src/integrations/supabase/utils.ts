
import { supabase } from './client';

/**
 * Helper function to get the authenticated user's session token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

/**
 * Helper function to validate if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};
