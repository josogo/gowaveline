
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
  uploading: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, uploading }) => {
  if (!uploading) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-right text-muted-foreground">{progress}%</p>
    </div>
  );
};

export default UploadProgress;
