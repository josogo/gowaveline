
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Alert className="bg-red-50 border-red-200 max-w-xl">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-700">
            {error || 'Error loading document'}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};
