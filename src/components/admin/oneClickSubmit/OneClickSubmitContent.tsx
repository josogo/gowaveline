
import React, { useState, lazy, Suspense } from 'react';
import { TitleSection } from './TitleSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MerchantInitialForm } from './forms/MerchantInitialForm';
import { useNavigate } from 'react-router-dom';

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
  const handleNewApplicationSubmit = (data: any) => {
    setNewAppDialogOpen(false);
    // After creating, you may need to reload ApplicationsList (not handled here).
    // Optionally, could redirect or open the application edit dialog here
    // For now, simply reload ApplicationsList or let user click.
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
