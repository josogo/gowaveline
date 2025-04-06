
import { supabase } from '@/integrations/supabase/client';

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
