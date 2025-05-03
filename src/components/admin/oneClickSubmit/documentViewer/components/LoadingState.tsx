
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-blue-600 font-medium">Loading document...</p>
      </div>
    </div>
  );
};
