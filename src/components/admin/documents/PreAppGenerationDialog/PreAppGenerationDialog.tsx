
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndustries, generatePreApp } from '../api';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from '../PreAppFormSchema';
import { supabase } from '@/integrations/supabase/client';

// Import Tab Components
import { BusinessStructureTab } from './tabs/BusinessStructureTab';
import { BusinessInfoTab } from './tabs/BusinessInfoTab';
import { PrincipalInfoTab } from './tabs/PrincipalInfoTab';
import { BankingInfoTab } from './tabs/BankingInfoTab';
import { ProcessingVolumeTab } from './tabs/ProcessingVolumeTab';
import { PoliciesTab } from './tabs/PoliciesTab';
import { EcommerceTab } from './tabs/EcommerceTab';

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

  // Fetch industries with proper typing
  const { data: industries, isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ['industries'],
    queryFn: fetchIndustries,
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('You must be logged in to generate applications');
        setError('Authentication required');
      }
    };
    
    checkAuth();
  }, []);

  const handleGenerate = async (data: PreAppFormValues) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      console.log('Starting PDF generation process');
      console.log('Selected industry:', selectedIndustryId);
      console.log('Form data:', data);
      
      // Generate Pre-App PDF
      const result = await generatePreApp(selectedIndustryId, leadData, data);
      
      console.log('Pre-app generation successful:', result);
      toast.success('Merchant application generated successfully');
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error generating pre-app:', error);
      setError(error.message);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            WaveLine Merchant Application
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        )}
        
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

              {/* Tabs Content */}
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
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80" disabled={isGenerating}>
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
      </DialogContent>
    </Dialog>
  );
};
