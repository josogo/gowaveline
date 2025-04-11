
import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <p className="text-sm text-red-600">
        {error}
      </p>
    </div>
  );
};
