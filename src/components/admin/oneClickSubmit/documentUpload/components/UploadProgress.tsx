
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
  uploading: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, uploading }) => {
  if (!uploading || progress <= 0) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-right text-gray-500">{Math.round(progress)}%</p>
    </div>
  );
};

export default UploadProgress;
