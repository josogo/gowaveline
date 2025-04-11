
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

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
      
      if (!generatedPdfUrl) {
        toast.error('PDF URL is not available');
        return;
      }
      
      const link = document.createElement('a');
      link.href = generatedPdfUrl;
      link.download = generatedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error during download:', error);
      toast.error('Failed to download the document. Please try again.');
    }
  };
  
  // Validate PDF URL on component mount
  useEffect(() => {
    if (!generatedPdfUrl) {
      console.error('Generated PDF URL is empty or invalid');
    } else {
      console.log('PDF URL is valid, length:', generatedPdfUrl.length);
      // Trigger download automatically with a slight delay
      const timer = setTimeout(() => {
        handleDownload();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [generatedPdfUrl]);

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
      
      {generatedPdfUrl ? (
        <div className="border rounded-md overflow-hidden h-64 mb-4">
          <iframe 
            src={generatedPdfUrl} 
            className="w-full h-full" 
            title="Generated PDF Preview" 
          />
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center text-red-500 h-64 mb-4 flex items-center justify-center">
          <p>PDF preview not available</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 flex items-center"
          onClick={handleDownload}
          disabled={!generatedPdfUrl}
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
