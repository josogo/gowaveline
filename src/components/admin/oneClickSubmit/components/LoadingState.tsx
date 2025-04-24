
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all p-4 md:p-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-48 w-full rounded-md" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    </div>
  );
};

