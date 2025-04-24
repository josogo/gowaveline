
import React from 'react';
import { FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationProgressProps {
  progress: number;
  lastEdited?: string;
}

export const ApplicationProgress: React.FC<ApplicationProgressProps> = ({
  progress,
  lastEdited
}) => {
  // Validate the lastEdited date before formatting
  const validLastEdited = lastEdited && !isNaN(new Date(lastEdited).getTime()) 
    ? new Date(lastEdited) 
    : null;

  return (
    <div className="space-y-2">
      {validLastEdited && (
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="h-3 w-3 mr-1" />
          Last edited {formatDistanceToNow(validLastEdited)} ago
        </div>
      )}
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
