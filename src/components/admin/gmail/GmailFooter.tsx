
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface GmailFooterProps {
  lastSync: string | null;
  syncError: string | null;
  isSyncing: boolean;
  isAuthenticated: boolean;
  syncEmails: () => Promise<void>;
}

const GmailFooter: React.FC<GmailFooterProps> = ({
  lastSync,
  syncError,
  isSyncing,
  isAuthenticated,
  syncEmails
}) => {
  return (
    <>
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
    </>
  );
};

export default GmailFooter;
