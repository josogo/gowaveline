
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail, Search, Star, Trash, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Mock emails data
const mockEmails = [
  { 
    id: '1', 
    from: 'john@example.com', 
    subject: 'Statement Analysis Request',
    content: 'Hello, I would like to request a statement analysis for my business...',
    date: '2023-04-02T14:22:00Z',
    read: true
  },
  { 
    id: '2', 
    from: 'sarah@company.co', 
    subject: 'Partnership Opportunity',
    content: 'I represent Company Co and we are interested in discussing a partnership...',
    date: '2023-04-01T09:45:00Z',
    read: false
  },
  { 
    id: '3', 
    from: 'michael@business.org', 
    subject: 'High Risk Merchant Account',
    content: 'We are looking for solutions for our high-risk business...',
    date: '2023-03-31T16:08:00Z',
    read: true
  },
  { 
    id: '4', 
    from: 'info@customer.com', 
    subject: 'Quote Request',
    content: 'Please provide a quote for your services for our online store...',
    date: '2023-03-30T11:32:00Z',
    read: false
  },
  { 
    id: '5', 
    from: 'support@vendor.net', 
    subject: 'Follow up on our conversation',
    content: 'Thank you for speaking with me today about your processing needs...',
    date: '2023-03-29T15:17:00Z',
    read: true
  }
];

const GmailIntegration = () => {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleConnect = () => {
    setIsLoading(true);
    
    // Simulate OAuth2 flow
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      setIsConfiguring(false);
      toast.success('Successfully connected to Gmail');
    }, 1500);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate fetching new emails
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Emails refreshed successfully');
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.from.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && !email.read;
    return matchesSearch;
  });

  const currentEmail = emails.find(email => email.id === selectedEmail);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gmail Integration</h2>
          
          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsConfiguring(true)}
                >
                  Settings
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsConfiguring(true)}
              >
                Connect Gmail
              </Button>
            )}
          </div>
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>Gmail Integration</CardTitle>
              <CardDescription>
                Connect your Gmail account to automatically fetch and manage emails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-10">
                <Mail className="w-16 h-16 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Connect your Gmail account</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Link your Gmail account to automatically import, categorize, and respond to emails directly from this dashboard.
                </p>
                <Button onClick={() => setIsConfiguring(true)}>
                  Connect Gmail
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email list panel */}
            <div className="col-span-1 border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search emails"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="p-2 border-b">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-[calc(100vh-300px)] overflow-y-auto">
                {filteredEmails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Mail className="w-10 h-10 text-muted-foreground mb-2" />
                    <p>No emails found</p>
                  </div>
                ) : (
                  filteredEmails.map(email => (
                    <div 
                      key={email.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedEmail === email.id ? 'bg-gray-100' : ''
                      } ${!email.read ? 'font-medium' : ''}`}
                      onClick={() => setSelectedEmail(email.id)}
                    >
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${!email.read ? 'text-black' : 'text-gray-700'}`}>
                          {email.from}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1 truncate">
                        {email.subject}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {email.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Email content panel */}
            <div className="col-span-2 border rounded-lg overflow-hidden bg-white shadow-sm">
              {currentEmail ? (
                <div className="h-[calc(100vh-300px)] flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="text-xl font-semibold mb-2">{currentEmail.subject}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{currentEmail.from}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(currentEmail.date)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow overflow-y-auto">
                    <p className="whitespace-pre-line">{currentEmail.content}</p>
                  </div>
                  
                  <div className="p-4 border-t">
                    <Button className="w-full">Reply</Button>
                  </div>
                </div>
              ) : (
                <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center p-6">
                  <Mail className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an email to view</h3>
                  <p className="text-muted-foreground">
                    Choose an email from the list to view its contents
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gmail Configuration Dialog */}
      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gmail Integration Setup</DialogTitle>
            <DialogDescription>
              Connect your Gmail account to sync emails automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Connected Account</h4>
              {isConnected ? (
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@gowaveline.com</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>
                    <X className="h-4 w-4 mr-1" /> Disconnect
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No Gmail account connected
                </div>
              )}
            </div>

            {!isConnected && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input id="email" type="email" placeholder="info@gowaveline.com" />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to the Google OAuth2 consent screen to authorize access.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sync Settings</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="sync-new" defaultChecked={true} />
                <label htmlFor="sync-new" className="text-sm font-medium">
                  Automatically sync new emails
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-categorize" defaultChecked={true} />
                <label htmlFor="auto-categorize" className="text-sm font-medium">
                  Auto-categorize incoming emails
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sync Frequency</h4>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfiguring(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? 'Save Settings' : 'Connect Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration info banner */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <p className="mb-1 font-medium">Demo Interface</p>
        <p>
          This is a demo interface. In production, this would connect to Gmail via OAuth2 and the Gmail API to fetch and process real emails. 
          All emails submitted through the website's forms would be sent to info@gowaveline.com for processing.
        </p>
      </div>
    </div>
  );
};

export default GmailIntegration;
