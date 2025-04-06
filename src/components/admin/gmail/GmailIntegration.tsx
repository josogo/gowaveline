
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

// Mock emails for demonstration
const mockEmails = [
  {
    id: 'email1',
    from: 'john.smith@example.com',
    subject: 'Merchant statement review',
    body: 'Hello, I\'ve attached my merchant statement for review. Looking forward to your analysis.',
    date: '2025-04-02T14:30:00',
    read: false,
    hasAttachment: true
  },
  {
    id: 'email2',
    from: 'sales@competitor.com',
    subject: 'Special offer for payment processing',
    body: 'We\'d like to offer you our special rate of 2.4% + $0.10 per transaction.',
    date: '2025-04-01T09:15:00',
    read: true,
    hasAttachment: false
  },
  {
    id: 'email3',
    from: 'support@acmecorp.com',
    subject: 'Re: Processing fee inquiry',
    body: 'Thank you for your inquiry about our processing fees. Our current rates are competitive in the market.',
    date: '2025-03-31T16:45:00',
    read: true,
    hasAttachment: false
  },
  {
    id: 'email4',
    from: 'sarah.jones@bigretail.com',
    subject: 'Need help with statement',
    body: 'Hi there, I\'m trying to understand my current processing fees. Can you help?',
    date: '2025-03-30T11:20:00',
    read: false,
    hasAttachment: true
  },
  {
    id: 'email5',
    from: 'michael.rodriguez@smallbusiness.org',
    subject: 'Looking to switch processors',
    body: 'We\'re currently with Stripe but are looking for better rates. What can you offer us?',
    date: '2025-03-29T13:10:00',
    read: true,
    hasAttachment: false
  }
];

const GmailIntegration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState(mockEmails);
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
          // For demo purposes, we'll assume token is valid
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
      
      // Fetch emails (in a real app)
      // await fetchEmails(tokens.access_token);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      toast.error('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
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
      // In a real app, fetch emails from Gmail API
      // For demo purposes, we'll use mock data
      const tokens = getStoredGmailTokens();
      
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }
      
      // Uncomment this to use real Gmail API (requires enabling it in Google Cloud Console)
      // const gmailEmails = await getGmailEmails(tokens.accessToken);
      // setEmails(processGmailEmails(gmailEmails));
      
      // For demo purposes, use mock emails with randomized read status
      const updatedEmails = mockEmails.map(email => ({
        ...email,
        read: Math.random() > 0.3
      }));
      setEmails(updatedEmails);
      
      setLastSync(new Date().toLocaleString());
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
      // Uncomment to use real Gmail API (requires setup in Google Cloud Console)
      // await sendGmailEmail(tokens.accessToken, formData.to, formData.subject, formData.body);
      
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // In a real app, fetch emails from Gmail API
      await handleRefresh();
      setLastSync(new Date().toLocaleString());
      setSyncError(null);
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
