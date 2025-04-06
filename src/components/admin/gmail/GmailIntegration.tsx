
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { GmailConnectPrompt } from './';
import { GmailHeader } from './';
import { GmailEmailList } from './';
import { GmailFooter } from './';
import { ComposeEmailDialog } from './';

import {
  getGmailAuthUrl,
  exchangeCodeForTokens,
  getGmailUserProfile,
  getGmailEmails,
  sendGmailEmail,
  storeGmailTokens,
  getStoredGmailTokens,
  clearGmailTokens,
  storeUserProfile,
  getStoredUserProfile
} from '@/services/gmailService';

const GmailIntegration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Check for OAuth callback and load stored tokens on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // First check if we're handling an OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      const authState = urlParams.get('state');
      
      if (authCode && authState) {
        // Verify state to prevent CSRF
        const storedState = localStorage.getItem('gmail_oauth_state');
        if (storedState !== authState) {
          toast.error("Authentication failed: Invalid state parameter");
          return;
        }
        
        await handleGoogleAuthCallback(authCode);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Check if we already have stored tokens
        const tokens = getStoredGmailTokens();
        const storedProfile = getStoredUserProfile();
        
        if (tokens && storedProfile) {
          setIsAuthenticated(true);
          setUserProfile(storedProfile);
          
          // In a real app, check if token is expired and refresh if needed
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleGoogleAuthCallback = async (authCode: string) => {
    setIsLoading(true);
    
    try {
      // Exchange auth code for tokens
      const tokens = await exchangeCodeForTokens(authCode);
      
      if (!tokens.access_token) {
        throw new Error("Failed to get access token");
      }
      
      // Get user profile with the access token
      const profile = await getGmailUserProfile(tokens.access_token);
      
      // Calculate expiration time
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      
      // Store tokens and profile
      await storeGmailTokens(
        profile.id, 
        tokens.access_token, 
        tokens.refresh_token || '', 
        expiresAt, 
        profile.email
      );
      storeUserProfile(profile);
      
      setUserProfile(profile);
      setIsAuthenticated(true);
      toast.success('Successfully connected to Gmail');
      
      // Fetch emails
      await fetchEmails(tokens.access_token);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      toast.error('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmails = async (accessToken: string) => {
    setIsSyncing(true);
    try {
      const gmailEmails = await getGmailEmails(accessToken);
      
      // Process raw Gmail API response to a more usable format
      const processedEmails = processGmailEmails(gmailEmails);
      setEmails(processedEmails);
      
      setLastSync(new Date().toLocaleString());
      setSyncError(null);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setSyncError((error instanceof Error) ? error.message : 'Unknown error');
      toast.error('Failed to fetch emails: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSyncing(false);
    }
  };

  // Process Gmail API response to a more usable format
  const processGmailEmails = (gmailMessages: any[]) => {
    return gmailMessages.map(message => {
      // Extract headers
      const headers = message.payload.headers;
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No subject)';
      const from = headers.find((h: any) => h.name === 'From')?.value || 'unknown@example.com';
      const dateHeader = headers.find((h: any) => h.name === 'Date')?.value;
      const date = dateHeader ? new Date(dateHeader).toISOString() : new Date().toISOString();
      
      // Check for attachments
      const hasAttachment = message.payload.parts?.some((part: any) => part.filename && part.filename.length > 0) || false;
      
      // Extract body
      let body = '';
      if (message.payload.body?.data) {
        // Body is base64 encoded
        body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      } else if (message.payload.parts) {
        // Try to find text part
        const textPart = message.payload.parts.find((part: any) => 
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body?.data) {
          body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
      }
      
      // Strip HTML tags for plain text preview
      body = body.replace(/<[^>]*>/g, ' ');
      
      return {
        id: message.id,
        from,
        subject,
        body,
        date,
        read: !message.labelIds?.includes('UNREAD'),
        hasAttachment
      };
    });
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    
    try {
      // Get the authentication URL
      const authUrl = await getGmailAuthUrl();
      
      // Redirect to Google's OAuth consent screen
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error starting authentication:', error);
      toast.error('Failed to start authentication: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    
    try {
      // Clear tokens and user profile
      clearGmailTokens();
      setIsAuthenticated(false);
      setUserProfile(null);
      setEmails([]);
      toast.info("Disconnected from Gmail");
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Logout failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      const tokens = getStoredGmailTokens();
      
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }
      
      await fetchEmails(tokens.accessToken);
      toast.success("Emails refreshed");
    } catch (error) {
      console.error('Error refreshing emails:', error);
      toast.error('Failed to refresh emails: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.filter(email => email.id !== emailId);
    setEmails(updatedEmails);
    toast.success("Email deleted");
  };

  const handleMarkAsRead = (emailId: string) => {
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    );
    setEmails(updatedEmails);
  };

  const handleSendEmail = async (formData: { to: string; subject: string; body: string; }) => {
    setIsSending(true);
    
    try {
      const tokens = getStoredGmailTokens();
      
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }
      
      // Send email using Gmail API
      await sendGmailEmail(tokens.accessToken, formData.to, formData.subject, formData.body);
      
      toast.success("Email sent successfully");
      setIsComposeOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSending(false);
    }
  };

  const handleConvertToLead = (emailId: string) => {
    toast.success("Email converted to lead");
  };

  const syncEmails = async () => {
    setIsSyncing(true);
    
    try {
      const tokens = getStoredGmailTokens();
      
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }
      
      await fetchEmails(tokens.accessToken);
    } catch (error) {
      console.error('Error syncing emails:', error);
      setSyncError((error instanceof Error) ? error.message : 'Unknown error');
      toast.error('Failed to sync emails');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gmail Integration</CardTitle>
            <CardDescription>Connect your Gmail account to sync customer communications.</CardDescription>
          </div>
          {isAuthenticated && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex items-center gap-1.5"
              disabled
            >
              <Check size={16} />
              Connected
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!isAuthenticated ? (
          <GmailConnectPrompt 
            isLoading={isLoading} 
            handleAuthenticate={handleAuthenticate}
          />
        ) : (
          <div>
            <GmailHeader
              userProfile={userProfile}
              isLoading={isLoading}
              handleRefresh={handleRefresh}
              handleLogout={handleLogout}
              setIsComposeOpen={setIsComposeOpen}
            />
            
            <GmailEmailList
              emails={emails}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              handleMarkAsRead={handleMarkAsRead}
              handleDeleteEmail={handleDeleteEmail}
              onConvertToLead={handleConvertToLead}
            />
            
            <ComposeEmailDialog
              isOpen={isComposeOpen}
              setIsOpen={setIsComposeOpen}
              handleSendEmail={handleSendEmail}
              isSending={isSending}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-4 border-t pt-4">
        <GmailFooter
          lastSync={lastSync}
          syncError={syncError}
          isSyncing={isSyncing}
          isAuthenticated={isAuthenticated}
          syncEmails={syncEmails}
        />
      </CardFooter>
    </Card>
  );
};

export default GmailIntegration;
