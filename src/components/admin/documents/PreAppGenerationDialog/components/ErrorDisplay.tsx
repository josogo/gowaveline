
import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-800 font-medium">Error Generating PDF</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800"
              onClick={onRetry}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry Generation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
