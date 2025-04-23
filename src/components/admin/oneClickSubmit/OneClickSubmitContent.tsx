
import React, { useState, lazy, Suspense } from 'react';
import { TitleSection } from './TitleSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MerchantInitialForm } from './forms/MerchantInitialForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ApplicationsList = lazy(() => import('./ApplicationsList'));
const ApplicationFlow = lazy(() => import('./ApplicationFlow'));
const BankManagement = lazy(() => 
  Promise.all([
    import('./BankRoutingSystem'),
    new Promise(resolve => setTimeout(resolve, 100))
  ])
  .then(([moduleExports]) => moduleExports)
);

const ComingSoonFeature = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
    <p className="text-muted-foreground">{title} coming soon</p>
  </div>
);

const OneClickSubmitContent: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('applications');
  const [newAppDialogOpen, setNewAppDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Handler for when the merchant initial form is completed
  const handleNewApplicationSubmit = async (data: any) => {
    setNewAppDialogOpen(false);
    
    try {
      // Create a new merchant application
      const { data: newApp, error } = await supabase
        .from('merchant_applications')
        .insert([
          {
            merchant_name: data.businessName,
            merchant_email: data.email,
            application_data: {
              business: data,
              progress: 14, // Initial progress (1/7 tabs)
              currentTab: 'business'
            },
            completed: false,
            otp: (Math.floor(100000 + Math.random() * 900000)).toString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      toast.success("New application created!");
      
      // Redirect to the merchant application page with the application ID
      if (newApp?.id) {
        // We'll navigate to the same page but with a query parameter to open the application
        // This will trigger a reload of the applications list with the new application
        navigate(`/admin/one-click-submit?openApp=${newApp.id}`);
      }
      
    } catch (error: any) {
      console.error("Error creating application:", error);
      toast.error("Failed to create application: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <TitleSection onOpenNewApp={() => setNewAppDialogOpen(true)} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="banks">Bank Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <Suspense fallback={<div className="w-full p-12 text-center">Loading content...</div>}>
          <TabsContent value="applications" className="space-y-4">
            <ApplicationsList />
          </TabsContent>

          <TabsContent value="banks" className="space-y-4">
            <ComingSoonFeature title="Bank management tools" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ComingSoonFeature title="Analytics dashboard" />
          </TabsContent>
        </Suspense>
      </Tabs>

      <Dialog open={newAppDialogOpen} onOpenChange={setNewAppDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Merchant Application</DialogTitle>
          </DialogHeader>
          <MerchantInitialForm onNext={handleNewApplicationSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OneClickSubmitContent;
