
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Mail, AlertTriangle, Info, Settings, RefreshCw, Check, Star, Clock, Tag, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Email {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels: string[];
}

const GmailIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      subject: 'New Merchant Application',
      sender: 'jane@example.com',
      preview: 'I\'ve just submitted the application for Downtown Bakery...',
      date: '2025-04-03T14:30:00',
      read: true,
      starred: true,
      labels: ['Merchant', 'Important']
    },
    {
      id: '2',
      subject: 'Meeting Agenda: Sales Team Sync',
      sender: 'michael@example.com',
      preview: 'Here\'s the agenda for tomorrow\'s sales team meeting...',
      date: '2025-04-03T11:15:00',
      read: false,
      starred: false,
      labels: ['Internal', 'Meeting']
    },
    {
      id: '3',
      subject: 'Processing Statement Questions',
      sender: 'customer@business.com',
      preview: 'I have some questions regarding the fees on my latest statement...',
      date: '2025-04-02T16:45:00',
      read: false,
      starred: true,
      labels: ['Support', 'Important']
    },
    {
      id: '4',
      subject: 'Partnership Opportunity',
      sender: 'partner@fintech.com',
      preview: 'We\'d like to explore a potential partnership opportunity...',
      date: '2025-04-02T09:20:00',
      read: true,
      starred: false,
      labels: ['Partnership', 'Business']
    },
    {
      id: '5',
      subject: 'Deal Approval Required',
      sender: 'system@gowaveline.com',
      preview: 'A new deal requires your approval. Details: Merchant ID...',
      date: '2025-04-01T15:10:00',
      read: true,
      starred: false,
      labels: ['System', 'Action Required']
    }
  ]);
  
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showUnread, setShowUnread] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const allLabels = Array.from(
    new Set(emails.flatMap(email => email.labels))
  ).sort();
  
  const handleConnect = () => {
    // In a real implementation, this would handle OAuth2 flow with Google
    setIsConnected(true);
    toast.success('Gmail account connected successfully!');
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    toast.success('Gmail account disconnected');
  };
  
  const handleRefresh = () => {
    toast.success('Emails refreshed');
  };
  
  const toggleRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: !email.read } : email
    ));
  };
  
  const toggleStarred = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Apply filters to the emails list
  const filteredEmails = emails.filter(email => {
    if (showUnread && email.read) return false;
    if (showStarred && !email.starred) return false;
    if (selectedLabels.length > 0 && !email.labels.some(label => selectedLabels.includes(label))) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">Gmail Integration</CardTitle>
          <CardDescription>Connect and manage your Gmail account for seamless communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Mail className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Connect Your Gmail Account</h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Connect your Gmail account to manage customer communications, track deals, and streamline your sales process.
              </p>
              <Button onClick={handleConnect} className="bg-[#0EA5E9]">
                <Mail className="mr-2 h-4 w-4" />
                Connect Gmail
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#0EA5E9] mr-2" />
                  <div>
                    <h3 className="font-medium">admin@gowaveline.com</h3>
                    <p className="text-sm text-gray-500">Gmail account connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gmail Integration Settings</DialogTitle>
                        <DialogDescription>
                          Configure your Gmail integration preferences
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Auto-sync emails</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically sync emails every 5 minutes
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Email notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications for new emails
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Auto-categorize</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically categorize emails by type
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button variant="destructive" onClick={handleDisconnect}>
                          Disconnect Account
                        </Button>
                        <Button onClick={() => toast.success('Settings saved')}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-filter"
                    checked={showUnread}
                    onCheckedChange={setShowUnread}
                  />
                  <label htmlFor="unread-filter" className="text-sm font-medium">
                    Unread only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="starred-filter"
                    checked={showStarred}
                    onCheckedChange={setShowStarred}
                  />
                  <label htmlFor="starred-filter" className="text-sm font-medium">
                    Starred only
                  </label>
                </div>
                <div className="sm:ml-auto flex items-center gap-2">
                  <span className="text-sm font-medium">Filter by label:</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        {selectedLabels.length > 0 ? `${selectedLabels.length} selected` : 'All Labels'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filter by Labels</DialogTitle>
                        <DialogDescription>
                          Select labels to filter emails
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex flex-wrap gap-2">
                          {allLabels.map((label) => {
                            const isSelected = selectedLabels.includes(label);
                            return (
                              <Button
                                key={label}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedLabels(selectedLabels.filter(l => l !== label));
                                  } else {
                                    setSelectedLabels([...selectedLabels, label]);
                                  }
                                }}
                              >
                                {label}
                                {isSelected && <Check className="ml-1 h-3 w-3" />}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setSelectedLabels([])}>
                          Clear All
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Info className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No emails match your filters</h3>
                  <p className="text-gray-500 max-w-sm">
                    Try changing your filter settings or refresh to check for new emails.
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>From / Subject</TableHead>
                        <TableHead className="hidden md:table-cell">Labels</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmails.map((email) => (
                        <TableRow 
                          key={email.id} 
                          className={email.read ? "" : "bg-blue-50"}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <TableCell className="text-center p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRead(email.id);
                              }}
                            >
                              <div className={`h-3 w-3 rounded-full ${!email.read ? 'bg-blue-500' : ''}`} />
                            </Button>
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStarred(email.id);
                              }}
                            >
                              <Star className={email.starred ? "fill-yellow-400 text-yellow-400" : ""} size={16} />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className={`${!email.read ? "font-medium" : ""}`}>
                              <div className="text-sm">{email.sender}</div>
                              <div className={`${!email.read ? "font-semibold" : ""}`}>{email.subject}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{email.preview}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {email.labels.map((label) => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatDate(email.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedEmail && (
                <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <DialogTitle>{selectedEmail.subject}</DialogTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400"
                            onClick={() => toggleStarred(selectedEmail.id)}
                          >
                            <Star className={selectedEmail.starred ? "fill-yellow-400 text-yellow-400" : ""} size={18} />
                          </Button>
                          <Badge variant="outline">{selectedEmail.read ? "Read" : "Unread"}</Badge>
                        </div>
                      </div>
                      <DialogDescription className="flex justify-between items-center pt-1">
                        <span>From: <strong>{selectedEmail.sender}</strong></span>
                        <span className="text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(selectedEmail.date)}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 border-t border-b">
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="text-sm font-medium mr-2">Labels:</span>
                        {selectedEmail.labels.map((label) => (
                          <Badge key={label} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {label}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="text-gray-700 text-sm">
                        {selectedEmail.preview} Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>
                    <DialogFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toggleRead(selectedEmail.id);
                          setSelectedEmail(null);
                        }}
                      >
                        Mark as {selectedEmail.read ? "Unread" : "Read"}
                      </Button>
                      <Button 
                        onClick={() => {
                          toast.success('Reply sent!');
                          setSelectedEmail(null);
                        }}
                      >
                        Reply
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
          
          {isConnected && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Gmail API Integration</AlertTitle>
              <AlertDescription className="text-amber-700">
                This is a demo interface. In production, this would connect to Gmail via OAuth2 and the Gmail API to fetch and process real emails.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GmailIntegration;
