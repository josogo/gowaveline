
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  downloadProgress: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  downloadProgress
}) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <div className="text-center">
        <p className="mb-4">Loading document...</p>
        {downloadProgress > 0 && (
          <div className="w-48 mx-auto">
            <Progress value={downloadProgress} className="h-1.5" />
          </div>
        )}
      </div>
    </div>
  );
};
