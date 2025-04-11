
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface GenerationSuccessProps {
  generatedPdfUrl: string;
  generatedFilename: string;
  handleReset: () => void;
  retryAttempt: number;
}

export const GenerationSuccess: React.FC<GenerationSuccessProps> = ({
  generatedPdfUrl,
  generatedFilename,
  handleReset,
  retryAttempt
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-green-600" />
        </div>
        
        <h3 className="text-xl font-medium text-green-800 mb-2">
          Merchant Application Generated Successfully
        </h3>
        
        <p className="text-green-700">
          Your application PDF has been generated and downloaded.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <a 
          href={generatedPdfUrl}
          download={generatedFilename}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download PDF Again
        </a>
        
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Create Another Application
        </Button>
      </div>
    </div>
  );
};
