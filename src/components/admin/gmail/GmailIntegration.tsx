import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
} from '@/services/gmail';

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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      const authState = urlParams.get('state');
      const errorParam = urlParams.get('error');
      
      if (errorParam) {
        setAuthError(`Google returned an error: ${errorParam}`);
        toast({
          title: "Authentication failed",
          description: errorParam,
          variant: "destructive"
        });
        return;
      }
      
      if (authCode && authState) {
        const storedState = localStorage.getItem('gmail_oauth_state');
        if (storedState !== authState) {
          setAuthError("Invalid state parameter. Please try again.");
          toast({
            title: "Authentication failed",
            description: "Invalid state parameter",
            variant: "destructive"
          });
          return;
        }
        
        await handleGoogleAuthCallback(authCode);
        
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const tokens = getStoredGmailTokens();
        const storedProfile = getStoredUserProfile();
        
        if (tokens && storedProfile) {
          setIsAuthenticated(true);
          setUserProfile(storedProfile);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleGoogleAuthCallback = async (authCode: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const tokens = await exchangeCodeForTokens(authCode);
      
      if (!tokens.access_token) {
        throw new Error("Failed to get access token");
      }
      
      const profile = await getGmailUserProfile(tokens.access_token);
      
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      
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
      toast({
        title: "Successfully connected to Gmail",
        variant: "default"
      });
      
      await fetchEmails(tokens.access_token);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthError(`Authentication failed: ${errorMessage}`);
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmails = async (accessToken: string) => {
    setIsSyncing(true);
    try {
      const gmailEmails = await getGmailEmails(accessToken);
      
      const processedEmails = processGmailEmails(gmailEmails);
      setEmails(processedEmails);
      
      setLastSync(new Date().toLocaleString());
      setSyncError(null);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setSyncError((error instanceof Error) ? error.message : 'Unknown error');
      toast({
        title: "Failed to fetch emails",
        description: (error instanceof Error) ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const processGmailEmails = (gmailMessages: any[]) => {
    return gmailMessages.map(message => {
      const headers = message.payload.headers;
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No subject)';
      const from = headers.find((h: any) => h.name === 'From')?.value || 'unknown@example.com';
      const dateHeader = headers.find((h: any) => h.name === 'Date')?.value;
      const date = dateHeader ? new Date(dateHeader).toISOString() : new Date().toISOString();
      
      const hasAttachment = message.payload.parts?.some((part: any) => part.filename && part.filename.length > 0) || false;
      
      let body = '';
      if (message.payload.body?.data) {
        body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      } else if (message.payload.parts) {
        const textPart = message.payload.parts.find((part: any) => 
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body?.data) {
          body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
      }
      
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
    setAuthError(null);
    
    try {
      console.log("Starting Gmail authentication flow...");
      const authUrl = await getGmailAuthUrl();
      console.log("Generated auth URL:", authUrl);
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error starting authentication:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthError(`Failed to start authentication: ${errorMessage}`);
      toast({
        title: "Failed to start authentication",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    
    try {
      clearGmailTokens();
      setIsAuthenticated(false);
      setUserProfile(null);
      setEmails([]);
      toast({
        title: "Disconnected from Gmail",
        variant: "default"
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: (error instanceof Error) ? error.message : 'Unknown error',
        variant: "destructive"
      });
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
      toast({
        title: "Emails refreshed",
        variant: "default"
      });
    } catch (error) {
      console.error('Error refreshing emails:', error);
      toast({
        title: "Failed to refresh emails", 
        description: (error instanceof Error) ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.filter(email => email.id !== emailId);
    setEmails(updatedEmails);
    toast({
      title: "Email deleted",
      variant: "default"
    });
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
      
      await sendGmailEmail(tokens.accessToken, formData.to, formData.subject, formData.body);
      
      toast({
        title: "Email sent successfully",
        variant: "default"
      });
      setIsComposeOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: (error instanceof Error) ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleConvertToLead = (emailId: string) => {
    toast({
      title: "Email converted to lead",
      variant: "default"
    });
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
      toast({
        title: "Failed to sync emails",
        description: (error instanceof Error) ? error.message : 'Unknown error',
        variant: "destructive"
      });
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
            error={authError}
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
