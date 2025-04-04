
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
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check for OAuth callback on component mount
  useEffect(() => {
    // Check for auth code in URL (would be part of the OAuth flow)
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode) {
      handleGoogleAuthCallback(authCode);
    }
    
    // Check if we already have a stored token
    const storedToken = localStorage.getItem('gmail_access_token');
    const storedProfile = localStorage.getItem('gmail_user_profile');
    
    if (storedToken && storedProfile) {
      setIsAuthenticated(true);
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
  }, []);

  const handleGoogleAuthCallback = async (authCode: string) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would exchange the code for tokens
      console.log('Received auth code:', authCode);
      
      // Simulate token exchange
      setTimeout(() => {
        // Mock user data
        const mockProfile = {
          email: 'admin@gowaveline.com',
          name: 'Admin User',
          picture: 'https://github.com/shadcn.png'
        };
        
        // Store token and profile
        localStorage.setItem('gmail_access_token', 'mock-token-' + Date.now());
        localStorage.setItem('gmail_user_profile', JSON.stringify(mockProfile));
        
        setUserProfile(mockProfile);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        toast.success('Successfully authenticated with Google');
      }, 1500);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      setIsLoading(false);
      toast.error('Authentication failed');
    }
  };

  const handleAuthenticate = () => {
    setIsLoading(true);
    
    // In a real implementation, this would redirect to the Google OAuth consent screen
    // For now, we'll simulate it with a demo URL
    
    // Generate a mock OAuth URL (in a real app, this would be a Google URL)
    const mockOAuthUrl = `/admin/gmail-integration?mock_oauth=true&timestamp=${Date.now()}`;
    
    // In a real implementation, we would redirect to Google
    // window.location.href = googleAuthUrl;
    
    // For demo purposes, simulate the OAuth flow
    setTimeout(() => {
      // Simulate successful OAuth and callback
      const mockProfile = {
        email: 'admin@gowaveline.com',
        name: 'Admin User',
        picture: 'https://github.com/shadcn.png'
      };
      
      // Store token and profile
      localStorage.setItem('gmail_access_token', 'mock-token-' + Date.now());
      localStorage.setItem('gmail_user_profile', JSON.stringify(mockProfile));
      
      setUserProfile(mockProfile);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      toast.success("Successfully connected to Gmail");
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoading(true);
    // Simulate logout
    setTimeout(() => {
      localStorage.removeItem('gmail_access_token');
      localStorage.removeItem('gmail_user_profile');
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsLoading(false);
      toast.info("Disconnected from Gmail");
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate email fetch
    setTimeout(() => {
      // Randomize the read status of some emails to simulate new emails
      const updatedEmails = emails.map(email => ({
        ...email,
        read: Math.random() > 0.3
      }));
      setEmails(updatedEmails);
      setIsLoading(false);
      toast.success("Emails refreshed");
    }, 1500);
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

  const syncEmails = () => {
    setIsSyncing(true);
    // Simulate email sync
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleString());
      setSyncError(null);
      toast.success("Emails synced");
    }, 1500);
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
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                This is a demo interface. In production, this would connect to Gmail via OAuth2 and the Gmail API to fetch and process real emails.
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
                  <p className="text-sm font-medium">{userProfile?.email || 'admin@gowaveline.com'}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex gap-2">
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
