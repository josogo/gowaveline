
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { generatePreApp } from '../api';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from '../PreAppFormSchema';

// Import hooks
import { useDialogReset } from './hooks/useDialogReset';
import { useTabNavigation } from './hooks/useTabNavigation';

// Import component files
import { IndustrySelector } from './components/IndustrySelector';
import { ErrorDisplay } from './components/ErrorDisplay';
import { GenerationSuccess } from './components/GenerationSuccess';
import { TabsNavigation } from './components/TabsNavigation';
import { FormTabs } from './components/FormTabs';
import { FormSubmitButton } from './components/FormSubmitButton';

// Import utility functions
import { base64ToBlob } from './utils/pdfUtils';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Default form values
const defaultFormValues: Partial<PreAppFormValues> = {
  businessStructure: 'llc' as const,
  hasRefundPolicy: true,
  purchaseMethods: [],
  shippingMethod: [],
  advertisingChannels: [],
  additionalOwners: false,
  businessName: '',
};

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>('WaveLine_Merchant_Application.pdf');
  
  // Use custom hooks
  const { activeTab, setActiveTab, goToNextTab, goToPrevTab } = useTabNavigation();
  
  // Create the form instance
  const form = useForm<PreAppFormValues>({
    resolver: zodResolver(preAppFormSchema),
    defaultValues: defaultFormValues
  });

  // Use custom hook for form reset management
  const { formResetKey, retryAttempt, incrementRetry } = useDialogReset(open, form, defaultFormValues);

  // Cleanup URLs on unmount or when dialog closes
  useEffect(() => {
    return () => {
      if (generatedPdfUrl) {
        URL.revokeObjectURL(generatedPdfUrl);
      }
    };
  }, [generatedPdfUrl]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      if (generatedPdfUrl) {
        URL.revokeObjectURL(generatedPdfUrl);
        setGeneratedPdfUrl(null);
      }
      setError(null);
      setActiveTab('structure');
    }
  }, [open, setActiveTab]);

  const handleReset = () => {
    // Reset form and state
    incrementRetry();
    setSelectedIndustryId('');
    setActiveTab('structure');
    
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
    }
    setError(null);
  };

  const handleGenerate = async (data: PreAppFormValues) => {
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
      
      const result = await generatePreApp(selectedIndustryId, leadData, data);
      
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
    } catch (error: any) {
      console.error('[GENERATE] Error generating pre-app:', error);
      setError(error.message || 'Unknown error occurred');
      toast.error(`Failed to generate merchant application: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    incrementRetry();
    setError(null);
    const formData = form.getValues();
    handleGenerate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
            WaveLine Merchant Application
          </DialogTitle>
          <DialogDescription>
            Fill out this form to generate a merchant application
          </DialogDescription>
        </DialogHeader>
        
        <ErrorDisplay 
          error={error} 
          onRetry={handleRetry}
        />
        
        {generatedPdfUrl ? (
          <GenerationSuccess 
            generatedPdfUrl={generatedPdfUrl}
            generatedFilename={generatedFilename}
            handleReset={handleReset}
            retryAttempt={retryAttempt}
          />
        ) : (
          <>
            <IndustrySelector 
              selectedIndustryId={selectedIndustryId} 
              setSelectedIndustryId={setSelectedIndustryId} 
            />

            {/* Apply the form reset key for re-rendering */}
            <Form {...form} key={formResetKey}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsNavigation />
                  <FormTabs 
                    activeTab={activeTab}
                    form={form} 
                    goToNextTab={goToNextTab}
                    goToPrevTab={goToPrevTab}
                  />
                </Tabs>
                
                <FormSubmitButton 
                  isGenerating={isGenerating}
                  isDisabled={!selectedIndustryId}
                />
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
