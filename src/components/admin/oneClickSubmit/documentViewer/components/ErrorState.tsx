
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
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
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        {retryCount < maxRetries ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Unable to load the document. Please try again.
            </p>
            <Button 
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry ({retryCount}/{maxRetries})
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Maximum retry attempts reached. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};
