
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, Info, Loader2, Mail, LogIn, 
  Settings, LogOut, RefreshCw, Trash, AlertCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

// Form schema for composing emails
const emailFormSchema = z.object({
  to: z.string().email({ message: "Valid email address required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Message body is required" })
});

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

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: "",
      subject: "",
      body: ""
    },
  });

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

  const handleSendEmail = async (formData: z.infer<typeof emailFormSchema>) => {
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
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = emails.filter(email => !email.read).length;

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
          <div className="flex flex-col items-center py-8">
            <Mail className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect to Gmail</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect your Gmail account to automatically sync customer emails and attachments.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={handleAuthenticate} 
                disabled={isLoading}
                className="gap-2 w-64"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Connect Gmail Account
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">or</p>
              </div>
              
              <Button 
                onClick={handleAuthenticate}
                variant="outline" 
                disabled={isLoading}
                className="gap-2 w-64 bg-white hover:bg-gray-50 border border-gray-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </Button>
            </div>
            
            <Alert className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Integration Setup Required</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  To complete this integration, you need to set up a project in the Google Cloud Console:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a project at <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li>Enable the Gmail API for your project</li>
                  <li>Create OAuth credentials (client ID and secret) for a web application</li>
                  <li>Add this URL as an authorized redirect URI</li>
                  <li>Store the client ID and secret in Supabase secrets</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {userProfile?.picture ? (
                    <AvatarImage src={userProfile.picture} alt={userProfile.name || 'User'} />
                  ) : (
                    <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userProfile?.email || 'user@example.com'}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      Compose
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Compose Email</DialogTitle>
                      <DialogDescription>
                        Create and send an email from your connected Gmail account.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSendEmail)} className="space-y-4 mt-2">
                        <FormField
                          control={form.control}
                          name="to"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To</FormLabel>
                              <FormControl>
                                <Input placeholder="recipient@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Email subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Email body" 
                                  className="min-h-[200px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsComposeOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isSending}
                          >
                            {isSending ? (
                              <>
                                <Loader2 size={16} className="mr-2 animate-spin" /> 
                                Sending...
                              </>
                            ) : "Send Email"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Settings dialog would open here")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <Tabs 
                value={selectedTab} 
                onValueChange={setSelectedTab} 
                className="w-full"
              >
                <div className="border-b px-4">
                  <TabsList className="grid grid-cols-4 h-10 w-full max-w-md">
                    <TabsTrigger value="inbox" className="data-[state=active]:bg-gray-100">
                      Inbox {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="data-[state=active]:bg-gray-100">Sent</TabsTrigger>
                    <TabsTrigger value="archived" className="data-[state=active]:bg-gray-100">Archived</TabsTrigger>
                    <TabsTrigger value="leads" className="data-[state=active]:bg-gray-100">Leads</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="inbox" className="m-0">
                  <div className="divide-y">
                    {emails.map((email) => (
                      <div 
                        key={email.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!email.read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleMarkAsRead(email.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {email.from}
                            {!email.read && <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{formatDate(email.date)}</div>
                        </div>
                        <div className="font-medium mt-1">{email.subject} {email.hasAttachment && '📎'}</div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{email.body}</div>
                        <div className="flex gap-2 mt-2 items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("Email converted to lead");
                            }}
                          >
                            Convert to Lead
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmail(email.id);
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {emails.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        No emails to display
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="sent" className="m-0">
                  <div className="p-8 text-center text-muted-foreground">
                    Sent emails would appear here
                  </div>
                </TabsContent>
                <TabsContent value="archived" className="m-0">
                  <div className="p-8 text-center text-muted-foreground">
                    Archived emails would appear here
                  </div>
                </TabsContent>
                <TabsContent value="leads" className="m-0">
                  <div className="p-8 text-center text-muted-foreground">
                    Emails converted to leads would appear here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-4 border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} />
            <span>We only access specific labels you authorize</span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={syncEmails} 
            disabled={isSyncing || !isAuthenticated}
          >
            {isSyncing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Syncing...
              </>
            ) : "Sync Now"}
          </Button>
        </div>
        
        {lastSync && (
          <div className="w-full text-sm text-muted-foreground">
            Last sync: {lastSync}
          </div>
        )}
        
        {syncError && (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Sync Failed</AlertTitle>
            <AlertDescription>
              {syncError}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default GmailIntegration;
