
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
      <p className="text-blue-700 font-medium">Loading document...</p>
    </div>
  );
};
