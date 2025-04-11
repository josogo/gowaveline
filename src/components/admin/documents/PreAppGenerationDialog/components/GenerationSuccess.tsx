
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface GenerationSuccessProps {
  generatedPdfUrl: string;
  generatedFilename: string;
  handleReset: () => void;
}

export const GenerationSuccess: React.FC<GenerationSuccessProps> = ({
  generatedPdfUrl,
  generatedFilename,
  handleReset
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = generatedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-green-600 font-medium mb-2">Application generated successfully!</p>
        <p className="text-sm text-gray-600">Your download should start automatically. If it doesn't, use the button below.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 flex items-center"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" /> Download Application
        </Button>
        
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
