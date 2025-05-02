
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  retryCount,
  maxRetries,
  onRetry
}) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-red-500">
      <AlertTriangle className="h-12 w-12 mb-4" />
      <p className="text-center mb-4">{error}</p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        disabled={retryCount >= maxRetries}
        className="flex items-center"
      >
        <RefreshCw className="mr-2 h-4 w-4" /> 
        Retry Loading Document
      </Button>
    </div>
  );
};
