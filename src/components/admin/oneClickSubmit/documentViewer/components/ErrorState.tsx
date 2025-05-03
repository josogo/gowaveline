
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-5 w-5 mr-2" />
        <AlertDescription className="text-sm">
          {error || 'Failed to load the document. Please try again later.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};
