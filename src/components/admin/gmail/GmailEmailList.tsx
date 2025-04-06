
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  hasAttachment: boolean;
}

interface GmailEmailListProps {
  emails: Email[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  handleMarkAsRead: (emailId: string) => void;
  handleDeleteEmail: (emailId: string) => void;
  onConvertToLead: (emailId: string) => void;
}

const GmailEmailList: React.FC<GmailEmailListProps> = ({
  emails,
  selectedTab,
  setSelectedTab,
  handleMarkAsRead,
  handleDeleteEmail,
  onConvertToLead
}) => {
  const unreadCount = emails.filter(email => !email.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
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
                      onConvertToLead(email.id);
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
  );
};

export default GmailEmailList;
