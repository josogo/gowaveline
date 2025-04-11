import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndustries, generatePreApp } from '../api';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from '../PreAppFormSchema';

interface Industry {
  id: string;
  name: string;
  description?: string;
}

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

  const { data: industries, isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ['industries'],
    queryFn: fetchIndustries,
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
      toast.success('Merchant application generated successfully');
      
      if (result && result.pdfBase64) {
        const pdfBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
        const downloadLink = URL.createObjectURL(pdfBlob);
        
        const filename = `WaveLine_PreApp_${result.businessName.replace(/\s+/g, '_')}.pdf`;
        
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setGeneratedPdfUrl(downloadLink);
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

  function base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  }

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
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}
        
        {generatedPdfUrl ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600 font-medium mb-2">Application generated successfully!</p>
              <p className="text-sm text-gray-600">Your download should start automatically. If it doesn't, use the button below.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 flex items-center"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedPdfUrl;
                  link.download = "WaveLine_Merchant_Application.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
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
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="industry" className="block font-medium mb-1">Select Industry</Label>
              <Select value={selectedIndustryId} onValueChange={setSelectedIndustryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industriesLoading ? (
                    <SelectItem value="loading" disabled>Loading industries...</SelectItem>
                  ) : industries && industries.length > 0 ? (
                    industries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No industries available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

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
