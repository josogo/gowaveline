
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Loader2 } from 'lucide-react';
import { generatePreApp } from '../api';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from '../PreAppFormSchema';

// Import utility functions
import { base64ToBlob } from './utils/pdfUtils';

// Import component files
import { IndustrySelector } from './components/IndustrySelector';
import { ErrorDisplay } from './components/ErrorDisplay';
import { GenerationSuccess } from './components/GenerationSuccess';

// Import all tab components
import { BusinessStructureTab } from './tabs/BusinessStructureTab';
import { BusinessInfoTab } from './tabs/BusinessInfoTab';
import { PrincipalInfoTab } from './tabs/PrincipalInfoTab';
import { BankingInfoTab } from './tabs/BankingInfoTab';
import { ProcessingVolumeTab } from './tabs/ProcessingVolumeTab';
import { PoliciesTab } from './tabs/PoliciesTab';
import { EcommerceTab } from './tabs/EcommerceTab';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('structure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>('WaveLine_Merchant_Application.pdf');

  const form = useForm<PreAppFormValues>({
    resolver: zodResolver(preAppFormSchema),
    defaultValues: {
      businessStructure: 'llc',
      hasRefundPolicy: true,
      purchaseMethods: [],
      shippingMethod: [],
      advertisingChannels: [],
      additionalOwners: false,
      businessName: '',
    },
  });

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
        const pdfBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
        const downloadUrl = URL.createObjectURL(pdfBlob);
        setGeneratedPdfUrl(downloadUrl);
        
        // Trigger download automatically
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (blobError) {
        console.error('Error converting PDF base64 to blob:', blobError);
        throw new Error('Failed to process the generated PDF');
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

  const goToNextTab = () => {
    if (activeTab === 'structure') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('ecommerce');
  };

  const goToPrevTab = () => {
    if (activeTab === 'ecommerce') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('structure');
  };

  const handleReset = () => {
    form.reset();
    setGeneratedPdfUrl(null);
    setError(null);
    setActiveTab('structure');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            WaveLine Merchant Application
          </DialogTitle>
          <DialogDescription>
            Fill out this form to generate a merchant application
          </DialogDescription>
        </DialogHeader>
        
        <ErrorDisplay error={error} />
        
        {generatedPdfUrl ? (
          <GenerationSuccess 
            generatedPdfUrl={generatedPdfUrl}
            generatedFilename={generatedFilename}
            handleReset={handleReset}
          />
        ) : (
          <>
            <IndustrySelector 
              selectedIndustryId={selectedIndustryId} 
              setSelectedIndustryId={setSelectedIndustryId} 
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-7 mb-4">
                    <TabsTrigger value="structure" className="text-xs md:text-sm">Structure</TabsTrigger>
                    <TabsTrigger value="business" className="text-xs md:text-sm">Business</TabsTrigger>
                    <TabsTrigger value="principal" className="text-xs md:text-sm">Principal</TabsTrigger>
                    <TabsTrigger value="banking" className="text-xs md:text-sm">Banking</TabsTrigger>
                    <TabsTrigger value="volume" className="text-xs md:text-sm">Volume</TabsTrigger>
                    <TabsTrigger value="policies" className="text-xs md:text-sm">Policies</TabsTrigger>
                    <TabsTrigger value="ecommerce" className="text-xs md:text-sm">eCommerce</TabsTrigger>
                  </TabsList>

                  <TabsContent value="structure">
                    <BusinessStructureTab form={form} goToNextTab={goToNextTab} />
                  </TabsContent>
                  
                  <TabsContent value="business">
                    <BusinessInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                  
                  <TabsContent value="principal">
                    <PrincipalInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                  
                  <TabsContent value="banking">
                    <BankingInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                  
                  <TabsContent value="volume">
                    <ProcessingVolumeTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                  
                  <TabsContent value="policies">
                    <PoliciesTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                  
                  <TabsContent value="ecommerce">
                    <EcommerceTab form={form} goToPrevTab={goToPrevTab} />
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="submit" 
                    className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80" 
                    disabled={isGenerating || !selectedIndustryId}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
