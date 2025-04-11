
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, AlertCircle, Check, RefreshCw } from 'lucide-react';
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
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(false);

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
    if (open && !sessionChecked && !isAuthChecking) {
      checkAuth();
    } else if (!open) {
      // Reset session checked when dialog closes so it will check again next time
      setSessionChecked(false);
    }
  }, [open, sessionChecked, isAuthChecking]);

  const checkAuth = async () => {
    try {
      console.log('[AUTH CHECK] Starting authentication check process');
      setAuthCheckComplete(false);
      setIsAuthChecking(true);
      setError(null);
      
      // Force refresh the session to ensure we have the latest data
      try {
        console.log('[AUTH CHECK] Refreshing session...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('[AUTH CHECK] Failed to refresh session:', refreshError);
          toast.error('Failed to refresh session. Please try logging in again.');
        } else {
          console.log('[AUTH CHECK] Session refreshed successfully');
        }
      } catch (e) {
        console.error('[AUTH CHECK] Exception during session refresh:', e);
      }

      // Get the current session
      console.log('[AUTH CHECK] Getting current session...');
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('[AUTH CHECK] Session data:', sessionData);
      
      const session = sessionData?.session;
      const currentUser = session?.user;
      
      if (!session || !currentUser) {
        console.log('[AUTH CHECK] No active session or user found');
        setIsAuthenticated(false);
        setError('Authentication required. Please log in to generate applications.');
        toast.error('You must be logged in to generate applications');
        setAuthCheckComplete(true);
        setSessionChecked(true);
        setIsAuthChecking(false);
        return;
      }
      
      // User is authenticated
      console.log('[AUTH CHECK] User authenticated:', currentUser.id, '(Email:', currentUser.email, ')');
      setIsAuthenticated(true);
      setUserId(currentUser.id);
      setError(null);
      toast.success('Authentication successful');
      
      setAuthCheckComplete(true);
      setSessionChecked(true);
      setIsAuthChecking(false);
    } catch (e: any) {
      console.error('[AUTH CHECK] Error in authentication check:', e);
      setError(`Failed to verify authentication status: ${e.message}`);
      setIsAuthenticated(false);
      setAuthCheckComplete(true);
      setSessionChecked(true);
      setIsAuthChecking(false);
      toast.error('Authentication check failed');
    }
  };

  const handleGenerate = async (data: PreAppFormValues) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You must be logged in to generate applications');
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

  // Force login if the dialog is open but user is not authenticated
  useEffect(() => {
    if (open && authCheckComplete && !isAuthenticated) {
      console.log("[AUTH] Showing login prompt for unauthenticated user");
      toast.error("Please log in to access this feature", {
        duration: 5000,
        action: {
          label: "Login",
          onClick: () => {
            // Navigate to login page
            window.location.href = "/auth";
          }
        }
      });
    }
  }, [open, authCheckComplete, isAuthenticated]);

  // Manual authentication check for debugging
  const triggerManualAuthCheck = async () => {
    console.log("Manually rechecking authentication status...");
    setSessionChecked(false);
    toast.info('Rechecking authentication status...');
    await checkAuth();
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
        
        {isAuthChecking && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" /> 
            Checking authentication status...
          </div>
        )}

        {!isAuthChecking && !authCheckComplete && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" /> 
            Initializing authentication check...
          </div>
        )}
        
        {error && authCheckComplete && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={triggerManualAuthCheck}
                disabled={isAuthChecking}
                className="flex items-center"
              >
                {isAuthChecking ? 
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : 
                  <RefreshCw className="h-3 w-3 mr-1" />
                } 
                Recheck Auth Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/auth"}
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}
        
        {isAuthenticated === true && authCheckComplete && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-sm text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Logged in successfully. You can generate applications.
            </p>
          </div>
        )}
        
        {isAuthenticated === false && authCheckComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-sm text-amber-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              You need to be logged in to generate applications. Please log in and try again.
            </p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={triggerManualAuthCheck}
                disabled={isAuthChecking}
                className="flex items-center"
              >
                {isAuthChecking ? 
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : 
                  <RefreshCw className="h-3 w-3 mr-1" />
                } 
                Recheck Auth Status
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = "/auth"}
              >
                Go to Login
              </Button>
            </div>
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
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={triggerManualAuthCheck}
                disabled={isAuthChecking}
                className="flex items-center"
              >
                {isAuthChecking ? 
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                  <RefreshCw className="h-4 w-4 mr-1" />
                } 
                Recheck Auth
              </Button>
              
              <Button 
                type="submit" 
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80" 
                disabled={isGenerating || !authCheckComplete || !isAuthenticated || !selectedIndustryId}
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
