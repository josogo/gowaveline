
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cva } from 'class-variance-authority';

interface UploadProgressProps {
  progress: number;
  uploading: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning';
}

const progressVariants = cva("h-2", {
  variants: {
    variant: {
      default: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-amber-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  progress, 
  uploading, 
  className,
  variant = 'default'
}) => {
  if (!uploading) return null;
  
  // Calculate color based on progress
  const determineVariant = () => {
    if (progress > 80) return 'success';
    if (progress > 30) return 'default';
    return 'warning';
  };
  
  const dynamicVariant = variant === 'default' ? determineVariant() : variant;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={progressVariants({ variant: dynamicVariant })}
          style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
        />
      </div>
      <p className="text-sm text-right text-muted-foreground">{progress}%</p>
    </div>
  );
};

export default UploadProgress;
