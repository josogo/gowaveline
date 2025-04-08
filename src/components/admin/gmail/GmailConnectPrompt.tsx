
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Mail, AlertCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkGmailIntegrationSetup } from '@/services/gmail/emailService';
import { toast } from '@/hooks/use-toast';

interface GmailConnectPromptProps {
  isLoading: boolean;
  handleAuthenticate: () => Promise<void>;
  error?: string | null;
}

const GmailConnectPrompt: React.FC<GmailConnectPromptProps> = ({
  isLoading,
  handleAuthenticate,
  error
}) => {
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const runDiagnostics = async () => {
    setIsDiagnosing(true);
    try {
      const result = await checkGmailIntegrationSetup();
      setDiagnosisResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setDiagnosisResult(`Error running diagnostics: ${message}`);
      toast({
        title: "Diagnosis Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <Mail className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">Connect to Gmail</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Connect your Gmail account to automatically sync customer emails and attachments.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {diagnosisResult && (
        <Alert className="mb-4 max-w-md">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Diagnostic Results</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap text-xs">
            {diagnosisResult}
          </AlertDescription>
        </Alert>
      )}
      
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

        <Button
          onClick={runDiagnostics}
          variant="secondary"
          size="sm"
          disabled={isDiagnosing}
          className="mt-4 w-64"
        >
          {isDiagnosing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <HelpCircle className="h-4 w-4 mr-2" />}
          Run Diagnostics
        </Button>
      </div>
      
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integration Setup Required</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            To complete this integration, you need to:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Make sure <code className="bg-gray-100 px-1">GOOGLE_CLIENT_ID</code> and <code className="bg-gray-100 px-1">GOOGLE_CLIENT_SECRET</code> are set in Supabase secrets</li>
            <li>Check that your redirect URI is configured correctly in Google Cloud Console</li>
            <li>Ensure your redirect URI is <strong>exactly</strong>: <code className="bg-gray-100 px-1">{window.location.origin}/admin/gmail-integration</code></li>
            <li>Verify OAuth consent screen is properly configured with appropriate scopes</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GmailConnectPrompt;
