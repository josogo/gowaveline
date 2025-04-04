
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Mail, Search, Filter, Clock, Settings, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';

// Mock data for demonstration
const mockEmails = [
  {
    id: 'e1',
    subject: 'New Lead: John Smith - Rate Comparison',
    from: 'john.smith@example.com',
    date: '2025-04-03T14:32:00Z',
    snippet: 'Hello, I would like to discuss the possibility of optimizing my payment processing rates...',
    read: false,
    labels: ['lead', 'priority'],
  },
  {
    id: 'e2',
    subject: 'Statement Analysis Request - ABC Supplies',
    from: 'finance@abcsupplies.com',
    date: '2025-04-03T10:15:00Z',
    snippet: 'I have attached our recent processing statements for review. We currently process about $120k monthly...',
    read: true,
    labels: ['analysis', 'high-value'],
  },
  {
    id: 'e3',
    subject: 'Re: Partnership Opportunity - eCommerce Platform',
    from: 'partnerships@techplatform.com',
    date: '2025-04-02T16:45:00Z',
    snippet: 'Thank you for your proposal. We would be interested in exploring how Waveline could integrate with our platform...',
    read: true,
    labels: ['partnership'],
  },
  {
    id: 'e4',
    subject: 'Customer Support - Processing Issues',
    from: 'sarah.jones@retail-client.net',
    date: '2025-04-02T09:22:00Z',
    snippet: 'We experienced some issues with our terminal yesterday. Transactions were declined even though...',
    read: false,
    labels: ['support', 'urgent'],
  },
  {
    id: 'e5',
    subject: 'Merchant Services Quote Follow-up',
    from: 'robert.johnson@smallbusiness.com',
    date: '2025-04-01T13:10:00Z',
    snippet: 'Following up on our conversation last week. Have you had a chance to prepare the quote we discussed?',
    read: true,
    labels: ['follow-up'],
  },
];

const GmailIntegration: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    
    // Simulate OAuth2 authentication process
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
      toast.success('Successfully connected to Gmail');
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnected(false);
    toast.info('Gmail integration disconnected');
  };

  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate fetching new emails
    setTimeout(() => {
      setLoading(false);
      toast.success('Emails refreshed successfully');
    }, 1500);
  };

  const handleEmailClick = (email: typeof mockEmails[0]) => {
    setSelectedEmail(email);
    
    // Mark as read
    if (!email.read) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      );
      setEmails(updatedEmails);
    }
  };

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gmail Integration</h1>
        <p className="text-muted-foreground mt-1">
          Connect your Gmail account to automatically import leads and track communications.
        </p>
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <InfoIcon className="h-4 w-4" /> 
            This is a demo interface. In production, this would connect to Gmail via OAuth2 and the Gmail API.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Manage your Gmail integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">Gmail connection</p>
                  </div>
                  <Badge variant={connected ? "success" : "outline"} className={connected ? "bg-green-100 text-green-800" : ""}>
                    {connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>

                {connected && (
                  <div className="space-y-2">
                    <p className="font-medium">Connected Account</p>
                    <p className="text-sm">info@gowaveline.com</p>
                  </div>
                )}

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="auto-sync">Auto-sync emails</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync" checked={connected} disabled={!connected} />
                    <Label htmlFor="auto-sync" className="text-sm text-muted-foreground">
                      {connected ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!connected ? (
                <Button 
                  onClick={handleConnect} 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect Gmail'}
                </Button>
              ) : (
                <div className="flex w-full gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDisconnect} 
                    className="w-1/2"
                  >
                    Disconnect
                  </Button>
                  <Button 
                    onClick={handleRefresh} 
                    className="w-1/2"
                    disabled={loading}
                  >
                    {loading ? 'Refreshing...' : 'Refresh Emails'}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure Gmail integration behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-categorize">Auto-categorize emails</Label>
                  <Switch id="auto-categorize" checked={connected} disabled={!connected} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lead">Create leads from emails</Label>
                  <Switch id="auto-lead" checked={connected} disabled={!connected} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification">Email notifications</Label>
                  <Switch id="notification" checked={connected} disabled={!connected} />
                </div>
                
                <Separator />
                
                <div>
                  <Label>Email forwarding address</Label>
                  <div className="flex mt-1 items-center gap-2">
                    <Input 
                      value="leads@gowaveline.com" 
                      readOnly 
                      className="bg-muted"
                    />
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText('leads@gowaveline.com');
                      toast.success('Email copied to clipboard');
                    }}>
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Forward emails to this address to import them to the system
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="inbox" className="h-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="inbox" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Inbox
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4" /> Settings
                </TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input 
                  placeholder="Search emails..." 
                  className="pl-10 w-[250px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="inbox" className="h-[600px] m-0">
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="border-r overflow-auto h-full">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold">Recent Emails</h3>
                        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {filteredEmails.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-muted-foreground">No emails found</p>
                        </div>
                      ) : (
                        <div>
                          {filteredEmails.map((email) => (
                            <div 
                              key={email.id}
                              className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                                selectedEmail?.id === email.id ? 'bg-muted' : ''
                              } ${!email.read ? 'bg-blue-50' : ''}`}
                              onClick={() => handleEmailClick(email)}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-medium ${!email.read ? 'font-bold' : ''}`}>
                                  {email.subject}
                                </h4>
                                {!email.read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{email.from}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex gap-1">
                                  {email.labels.map(label => (
                                    <Badge key={label} variant="outline" className="text-xs">
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(email.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {selectedEmail ? (
                      <div className="p-6 overflow-auto h-full">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">From: {selectedEmail.from}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedEmail.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div>
                          <p className="whitespace-pre-line">{selectedEmail.snippet}</p>
                          <p className="mt-4 text-muted-foreground">
                            [Full email content would appear here in a real implementation]
                          </p>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <Button size="sm">
                            Reply
                          </Button>
                          <Button variant="outline" size="sm">
                            Forward
                          </Button>
                          <Button variant="ghost" size="sm">
                            Create Lead
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Select an email to view</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="h-[600px] m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>
                    Configure how the system interacts with Gmail and processes emails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Sync Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sync-frequency">Sync Frequency</Label>
                            <p className="text-sm text-muted-foreground">How often to check for new emails</p>
                          </div>
                          <select 
                            id="sync-frequency" 
                            className="p-2 border rounded-md"
                            disabled={!connected}
                          >
                            <option value="5">Every 5 minutes</option>
                            <option value="15">Every 15 minutes</option>
                            <option value="30">Every 30 minutes</option>
                            <option value="60">Every hour</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="max-emails">Max Emails to Sync</Label>
                            <p className="text-sm text-muted-foreground">Number of emails to sync per run</p>
                          </div>
                          <Input 
                            id="max-emails" 
                            type="number" 
                            className="w-24 text-right"
                            defaultValue="100"
                            disabled={!connected}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="historical-sync">Historical Sync Period</Label>
                            <p className="text-sm text-muted-foreground">How far back to sync emails</p>
                          </div>
                          <select 
                            id="historical-sync" 
                            className="p-2 border rounded-md"
                            disabled={!connected}
                          >
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Email Processing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Auto-create leads from emails</Label>
                            <p className="text-sm text-muted-foreground">Create new leads from emails that match certain criteria</p>
                          </div>
                          <Switch disabled={!connected} defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Attach emails to existing leads</Label>
                            <p className="text-sm text-muted-foreground">Match emails to existing leads by email address</p>
                          </div>
                          <Switch disabled={!connected} defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Extract attachments</Label>
                            <p className="text-sm text-muted-foreground">Automatically save email attachments</p>
                          </div>
                          <Switch disabled={!connected} defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Email Filters</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="email-filters">Monitored Labels/Categories</Label>
                          <p className="text-sm text-muted-foreground mb-2">Only sync emails with these Gmail labels</p>
                          <Input 
                            id="email-filters" 
                            placeholder="inbox, important, leads, etc."
                            defaultValue="inbox"
                            disabled={!connected}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email-exclusions">Excluded Email Patterns</Label>
                          <p className="text-sm text-muted-foreground mb-2">Don't sync emails that match these patterns</p>
                          <Input 
                            id="email-exclusions" 
                            placeholder="newsletter@, no-reply@, etc."
                            defaultValue="newsletter@, no-reply@, notifications@"
                            disabled={!connected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={!connected}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper component for info icon
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default GmailIntegration;
