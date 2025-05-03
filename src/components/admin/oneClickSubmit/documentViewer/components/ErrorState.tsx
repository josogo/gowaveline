
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading Document</h3>
      <p className="text-red-600 text-center max-w-md">{error}</p>
    </div>
  );
};

export default ErrorState;
