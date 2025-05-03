
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  downloadProgress: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ downloadProgress }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
      <p className="text-blue-600 font-medium text-lg mb-2">Loading document...</p>
      
      {downloadProgress > 0 && (
        <div className="w-64 space-y-2">
          <Progress 
            value={downloadProgress} 
            className="h-2"
            indicatorClassName="bg-blue-500"
          />
          <p className="text-sm text-blue-600 text-right">{downloadProgress}%</p>
        </div>
      )}
    </div>
  );
};
