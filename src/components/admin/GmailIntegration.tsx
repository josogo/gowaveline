import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Trash, RefreshCw, Settings, LogIn, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  
  const handleAuthenticate = () => {
    setIsLoading(true);
    // Simulate OAuth2 authentication flow
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
      toast.success("Successfully connected to Gmail");
    }, 2000);
  };
  
  const handleLogout = () => {
    setIsLoading(true);
    // Simulate logout
    setTimeout(() => {
      setIsAuthenticated(false);
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
  
  // Format date to a more readable format
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gmail Integration</CardTitle>
            <CardDescription>Connect and manage your Gmail account</CardDescription>
          </div>
          {isAuthenticated && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
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
            <Button 
              onClick={handleAuthenticate} 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Connect Gmail Account
            </Button>
            
            <Alert className="mt-8">
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
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback>WL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">admin@gowaveline.com</p>
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
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Email data is automatically synced every 15 minutes
        </p>
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => toast.info("Settings dialog would open here")}
        >
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GmailIntegration;
