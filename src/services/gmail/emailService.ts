
import { supabase } from '@/integrations/supabase/client';

/**
 * Get emails from Gmail API
 */
export const getGmailEmails = async (accessToken: string): Promise<any[]> => {
  try {
    console.log('Fetching emails from Gmail API...');
    
    // Use the gmail-api edge function to fetch emails
    const { data, error } = await supabase.functions.invoke('gmail-api', {
      body: { 
        action: 'listMessages',
        accessToken: accessToken,
        maxResults: 20
      }
    });
    
    if (error) {
      console.error('Error fetching emails:', error);
      throw new Error(`Failed to fetch emails: ${error.message}`);
    }
    
    if (!data || !data.messages) {
      console.error('Invalid response from Gmail API');
      throw new Error('No messages found in response');
    }
    
    console.log(`Retrieved ${data.messages.length} emails`);
    return data.messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

/**
 * Send an email via Gmail API
 */
export const sendGmailEmail = async (accessToken: string, to: string, subject: string, body: string): Promise<any> => {
  try {
    console.log(`Sending email to ${to}...`);
    
    // Use the gmail-api edge function to send the email
    const { data, error } = await supabase.functions.invoke('gmail-api', {
      body: { 
        action: 'sendEmail',
        accessToken: accessToken,
        to: to,
        subject: subject,
        body: body
      }
    });
    
    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    console.log('Email sent successfully');
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Debug assistant - Checks for common configuration issues
 */
export const checkGmailIntegrationSetup = async (): Promise<string> => {
  try {
    console.log('Checking Gmail integration setup...');
    
    // Check if the edge function is accessible
    const { data, error } = await supabase.functions.invoke('get-gmail-credentials', {
      body: { 
        action: 'checkConfig'
      }
    });
    
    if (error) {
      console.error('Error checking configuration:', error);
      return `Edge function error: ${error.message}`;
    }
    
    return `Configuration check completed: ${JSON.stringify(data)}`;
  } catch (error) {
    console.error('Error in configuration check:', error);
    return `Exception during check: ${error instanceof Error ? error.message : String(error)}`;
  }
};
