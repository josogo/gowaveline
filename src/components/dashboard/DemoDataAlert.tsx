
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const DemoDataAlert: React.FC = () => {
  return (
    <Alert variant="default" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Demonstration Data</AlertTitle>
      <AlertDescription>
        You are viewing sample data for demonstration purposes. This is not based on your actual statement.
      </AlertDescription>
    </Alert>
  );
};

export default DemoDataAlert;
