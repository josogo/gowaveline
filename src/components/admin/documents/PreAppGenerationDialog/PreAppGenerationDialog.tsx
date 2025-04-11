
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from '../PreAppFormSchema';

// Import hooks
import { useDialogReset } from './hooks/useDialogReset';
import { useTabNavigation } from './hooks/useTabNavigation';
import { usePreAppGeneration } from './hooks/usePreAppGeneration';

// Import component files
import { 
  IndustrySelector,
  ErrorDisplay,
  GenerationSuccess,
  TabsNavigation,
  FormTabs,
  FormSubmitButton 
} from './components';

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
  const [leadData, setLeadData] = useState(null);
  
  // Use custom hooks
  const { activeTab, handleTabChange, goToNextTab, goToPrevTab } = useTabNavigation();
  const { 
    isGenerating, 
    error, 
    generatedPdfUrl, 
    generatedFilename, 
    handleGenerate, 
    handleRetry, 
    cleanupUrls,
    setError
  } = usePreAppGeneration({ onSuccess });
  
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
      cleanupUrls();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      cleanupUrls();
    }
  }, [open]);

  const handleReset = () => {
    // Reset form and state
    incrementRetry();
    setSelectedIndustryId('');
    cleanupUrls();
  };

  const onSubmitForm = async (data: PreAppFormValues) => {
    await handleGenerate(selectedIndustryId, leadData, data);
  };

  const onRetry = () => {
    incrementRetry();
    const formData = form.getValues();
    handleRetry(selectedIndustryId, leadData, formData);
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
          onRetry={onRetry}
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
              <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
