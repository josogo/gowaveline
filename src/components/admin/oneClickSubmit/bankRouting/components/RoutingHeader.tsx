
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RoutingHeaderProps {
  onBack: () => void;
}

export const RoutingHeader: React.FC<RoutingHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Bank Routing Engine</h2>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Application
        </Button>
      </div>
      <p className="text-muted-foreground mt-1">
        Select the banks you'd like to submit this application to
      </p>
    </div>
  );
};
