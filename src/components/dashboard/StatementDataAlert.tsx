
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StatementDataAlertProps {
  showVolumeNote: boolean;
}

const StatementDataAlert = ({ showVolumeNote }: StatementDataAlertProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-[#0EA5E9] p-4 rounded-md">
        <h3 className="font-medium mb-2">Statement Data</h3>
        <AlertDescription>
          <p>
            We've extracted all the information we could find in your statement. 
            Fields marked "N/A" could not be found in the document you uploaded.
          </p>
          {showVolumeNote && (
            <p className="mt-2 text-sm">
              <strong>Note about Monthly Volume:</strong> Many statements don't explicitly state the monthly volume,
              making it difficult to extract automatically. Submit for manual analysis for more complete results.
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StatementDataAlert;
