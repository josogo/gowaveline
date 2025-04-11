
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileCheck, ArrowRight } from 'lucide-react';

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
    try {
      console.log('Triggering download for:', generatedFilename);
      const link = document.createElement('a');
      link.href = generatedPdfUrl;
      link.download = generatedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error during download:', error);
      alert('There was an error downloading the file. Please try again.');
    }
  };
  
  // Trigger download automatically on component mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleDownload();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex items-start">
          <FileCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800 mb-1">Application generated successfully!</p>
            <p className="text-sm text-gray-600">Your download should start automatically. If it doesn't, use the button below.</p>
          </div>
        </div>
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
          className="flex items-center"
        >
          <ArrowRight className="mr-2 h-4 w-4" /> Create Another Application
        </Button>
      </div>
    </div>
  );
};
