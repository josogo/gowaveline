
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileCheck, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
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
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleDownload = () => {
    try {
      console.log('Triggering download for:', generatedFilename);
      
      if (!generatedPdfUrl) {
        toast.error('PDF URL is not available');
        return;
      }
      
      // Create a download link and trigger it
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
  
  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please generate a new document.');
      return;
    }
    
    setPdfLoaded(false);
    setPdfError(null);
    setRetryCount(prev => prev + 1);
    
    // Force re-validation of the PDF URL
    validateUrl();
  };
  
  const validateUrl = async () => {
    if (!generatedPdfUrl) {
      console.error('Generated PDF URL is empty or invalid');
      setPdfError('PDF URL is missing or invalid');
      return;
    }
    
    console.log('Validating PDF URL, length:', generatedPdfUrl.length);
    
    try {
      // For blob URLs, we can't use fetch, so we'll check indirectly
      if (generatedPdfUrl.startsWith('blob:')) {
        // We'll assume it's valid initially and let the iframe handle errors
        console.log('Blob URL detected, will validate via iframe loading');
        setPdfLoaded(false);
      } else {
        // For HTTP/HTTPS URLs, we can validate with fetch
        const response = await fetch(generatedPdfUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }
        setPdfLoaded(true);
      }
      
      // Trigger download automatically with a slight delay
      const timer = setTimeout(() => {
        handleDownload();
      }, 1000);
      return () => clearTimeout(timer);
    } catch (error: any) {
      console.error('Error validating PDF URL:', error);
      setPdfError(`Error loading PDF: ${error.message}`);
    }
  };
  
  useEffect(() => {
    validateUrl();
  }, [generatedPdfUrl, retryCount]);

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
      
      {generatedPdfUrl && !pdfError ? (
        <div className="border rounded-md overflow-hidden h-64 mb-4 relative">
          <iframe 
            src={generatedPdfUrl} 
            className="w-full h-full" 
            title="Generated PDF Preview"
            onLoad={() => {
              console.log('PDF iframe loaded successfully');
              setPdfLoaded(true);
            }}
            onError={(e) => {
              console.error('Error loading PDF in iframe:', e);
              setPdfError('Failed to load PDF preview');
            }}
          />
          {!pdfLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p>Loading PDF preview...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center text-red-500 h-64 mb-4 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{pdfError || 'PDF preview not available'}</p>
            <p className="text-sm mt-2">Try downloading the file directly using the button below</p>
            
            {pdfError && retryCount < maxRetries && (
              <Button 
                variant="outline" 
                className="mt-4 flex items-center"
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> 
                Retry Loading PDF
              </Button>
            )}
          </div>
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
