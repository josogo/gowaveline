
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
    </div>
  );
};

export default LoadingState;
