
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Settings, LogOut, Loader2 } from "lucide-react";

interface GmailHeaderProps {
  userProfile: any;
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  handleLogout: () => void;
  setIsComposeOpen: (isOpen: boolean) => void;
}

const GmailHeader: React.FC<GmailHeaderProps> = ({
  userProfile,
  isLoading,
  handleRefresh,
  handleLogout,
  setIsComposeOpen
}) => {
  return (
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
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setIsComposeOpen(true)}
        >
          Compose
        </Button>
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
          onClick={() => {
            // Using toast would work here but needs to be imported in the main component
            console.log("Settings dialog would open here");
          }}
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
  );
};

export default GmailHeader;
