
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, RefreshCcw, RotateCw, Eye } from 'lucide-react';

interface GenerationSuccessProps {
  generatedPdfUrl: string | null;
  generatedFilename: string;
  handleReset: () => void;
  retryAttempt?: number;
}

export const GenerationSuccess: React.FC<GenerationSuccessProps> = ({
  generatedPdfUrl,
  generatedFilename,
  handleReset,
  retryAttempt = 0
}) => {
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setPdfError(null);
    setLoading(true);
  }, [generatedPdfUrl, retryAttempt]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setPdfError('Failed to load the PDF. Please download it to view locally.');
  };

  const handleDownload = () => {
    if (!generatedPdfUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = generatedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!generatedPdfUrl) return;
    window.open(generatedPdfUrl, '_blank');
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-semibold">Merchant Application Generated Successfully</h3>
        <p className="text-green-700 text-sm mt-1">Your PDF has been generated and is ready for download.</p>
      </div>

      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <div className="h-[500px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <RotateCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                <span className="text-sm text-gray-600">Loading PDF preview...</span>
              </div>
            </div>
          )}
          
          {pdfError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-4">
                <p className="text-red-600 mb-2">{pdfError}</p>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={generatedPdfUrl || ''}
              className="w-full h-full"
              title="Generated Merchant Application"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Create Another Application
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleOpenInNewTab}>
            <Eye className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
          <Button onClick={handleDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
