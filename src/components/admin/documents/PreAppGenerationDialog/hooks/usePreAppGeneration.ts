
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { generatePreApp } from '../../api';
import { toast } from 'sonner';
import { PreAppFormValues } from '../../PreAppFormSchema';
import { base64ToBlob } from '../utils/pdfUtils';

interface UsePreAppGenerationProps {
  onSuccess?: () => void;
}

export const usePreAppGeneration = ({ onSuccess }: UsePreAppGenerationProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>('WaveLine_Merchant_Application.pdf');

  const handleGenerate = async (selectedIndustryId: string, leadData: any, data: PreAppFormValues) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedPdfUrl(null);
      
      console.log('[GENERATE] Starting PDF generation process');
      console.log('[GENERATE] Selected industry:', selectedIndustryId);
      console.log('[GENERATE] Form data:', data);
      
      // Add flag to include logo in the PDF
      const result = await generatePreApp(selectedIndustryId, leadData, {
        ...data,
        includeLogo: true // Tell the API to include the Waveline logo
      });
      
      console.log('[GENERATE] Pre-app generation successful:', result);
      
      if (!result || !result.pdfBase64) {
        throw new Error('No PDF data returned from the server');
      }
      
      toast.success('Merchant application generated successfully');
      
      // Create a clean business name for the filename
      const businessName = result.businessName || data.businessName || 'Merchant';
      const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `WaveLine_PreApp_${cleanBusinessName}.pdf`;
      setGeneratedFilename(filename);
      
      // Convert base64 to blob and create download URL
      try {
        // Create a fresh blob with the PDF data
        const pdfBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
        
        // Verify blob is valid
        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error('Generated PDF has zero size or is invalid');
        }
        
        console.log('[GENERATE] Created PDF blob with size:', pdfBlob.size, 'bytes');
        
        // Create a download URL from the blob
        const downloadUrl = URL.createObjectURL(pdfBlob);
        setGeneratedPdfUrl(downloadUrl);
        
        // Trigger automatic download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('[GENERATE] PDF download URL created:', downloadUrl);
      } catch (blobError: any) {
        console.error('[GENERATE] Error converting PDF base64 to blob:', blobError);
        throw new Error(`Failed to process the generated PDF: ${blobError.message}`);
      }
      
      if (onSuccess) onSuccess();
      
      return { success: true, pdfUrl: generatedPdfUrl, filename: generatedFilename };
    } catch (error: any) {
      console.error('[GENERATE] Error generating pre-app:', error);
      setError(error.message || 'Unknown error occurred');
      toast.error(`Failed to generate merchant application: ${error.message || 'Unknown error'}`);
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = (selectedIndustryId: string, leadData: any, data: PreAppFormValues) => {
    setError(null);
    return handleGenerate(selectedIndustryId, leadData, data);
  };

  // Function to clean up URLs
  const cleanupUrls = () => {
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
    }
    setError(null);
  };

  return {
    isGenerating,
    error,
    generatedPdfUrl,
    generatedFilename,
    handleGenerate,
    handleRetry,
    cleanupUrls,
    setError
  };
};
