
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, AlertCircle, Check } from 'lucide-react';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

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

  // Check authentication status and admin role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AUTH CHECK] Starting authentication check process');
        setAuthCheckComplete(false);
        
        // Force refresh the session to ensure we have the latest data
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('[AUTH CHECK] Failed to refresh session:', refreshError);
        } else {
          console.log('[AUTH CHECK] Session refreshed successfully');
        }

        // Get the current session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('[AUTH CHECK] Session data:', sessionData);
        
        const session = sessionData?.session;
        const currentUser = session?.user;
        
        if (!session || !currentUser) {
          console.log('[AUTH CHECK] No active session or user found');
          setIsAuthenticated(false);
          setIsAdmin(false);
          setError('Authentication required. Please log in to generate applications.');
          toast.error('You must be logged in to generate applications');
          setAuthCheckComplete(true);
          setSessionChecked(true);
          return;
        }
        
        // User is authenticated
        console.log('[AUTH CHECK] User authenticated:', currentUser.id);
        setIsAuthenticated(true);
        setUserId(currentUser.id);
        
        // Check if user is admin
        try {
          console.log('[AUTH CHECK] Checking admin role for user:', currentUser.id);
          const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
            user_id: currentUser.id,
            role: 'admin'
          });
          
          if (roleError) {
            console.error('[AUTH CHECK] Error checking admin status:', roleError);
            setError(`Failed to verify admin permissions: ${roleError.message}`);
            setIsAdmin(false);
          } else {
            console.log('[AUTH CHECK] Admin role check result:', hasAdminRole);
            setIsAdmin(!!hasAdminRole);
            
            if (!hasAdminRole) {
              console.log('[AUTH CHECK] User is not admin');
              setError('You need admin permissions to generate applications');
              toast.error('Admin permissions required');
            } else {
              console.log('[AUTH CHECK] User confirmed as admin');
              // Clear any previous auth errors
              setError(null);
            }
          }
        } catch (e: any) {
          console.error('[AUTH CHECK] Error checking admin role:', e);
          setError(`Failed to verify admin permissions: ${e.message}`);
          setIsAdmin(false);
        }
        
        setAuthCheckComplete(true);
        setSessionChecked(true);
      } catch (e: any) {
        console.error('[AUTH CHECK] Error in authentication check:', e);
        setError(`Failed to verify authentication status: ${e.message}`);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAuthCheckComplete(true);
        setSessionChecked(true);
      }
    };
    
    if (open && !sessionChecked) {
      checkAuth();
    } else if (!open) {
      // Reset session checked when dialog closes so it will check again next time
      setSessionChecked(false);
    }
  }, [open, sessionChecked]);

  const handleGenerate = async (data: PreAppFormValues) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You must be logged in to generate applications');
      return;
    }
    
    if (!isAdmin) {
      toast.error('You need admin permissions to generate applications');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      console.log('[GENERATE] Starting PDF generation process');
      console.log('[GENERATE] Selected industry:', selectedIndustryId);
      console.log('[GENERATE] Form data:', data);
      console.log('[GENERATE] User ID:', userId);
      
      // Generate Pre-App PDF
      const result = await generatePreApp(selectedIndustryId, leadData, data);
      
      console.log('[GENERATE] Pre-app generation successful:', result);
      toast.success('Merchant application generated successfully');
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
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

  // Manual authentication check for debugging
  const triggerManualAuthCheck = async () => {
    setSessionChecked(false);
    toast.info('Rechecking authentication status...');
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
        
        {!authCheckComplete && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" /> 
            Checking authentication status...
          </div>
        )}
        
        {error && authCheckComplete && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={triggerManualAuthCheck}
            >
              <Loader2 className="h-3 w-3 mr-1" /> Recheck Auth Status
            </Button>
          </div>
        )}
        
        {isAuthenticated === true && isAdmin === true && authCheckComplete && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-sm text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Logged in as admin. You can generate applications.
            </p>
          </div>
        )}
        
        {isAuthenticated === false && authCheckComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-sm text-amber-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              You need to be logged in to generate applications. Please log in and try again.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={triggerManualAuthCheck}
            >
              <Loader2 className="h-3 w-3 mr-1" /> Recheck Auth Status
            </Button>
          </div>
        )}
        
        {isAuthenticated === true && isAdmin === false && authCheckComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-sm text-amber-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              You need admin permissions to generate applications.
            </p>
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
              <Button 
                type="submit" 
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80" 
                disabled={isGenerating || !authCheckComplete || !isAuthenticated || isAdmin === false || !selectedIndustryId}
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
      </DialogContent>
    </Dialog>
  );
};
