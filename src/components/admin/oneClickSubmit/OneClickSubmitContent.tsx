
import React, { useState, lazy, Suspense } from 'react';
import { TitleSection } from './TitleSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the tab content components for code splitting
const ApplicationsList = lazy(() => import('./ApplicationsList'));
const ApplicationFlow = lazy(() => import('./ApplicationFlow'));
const BankManagement = lazy(() => 
  Promise.all([
    import('./BankRoutingSystem'),
    // Add artificial delay to ensure minimum loading time
    new Promise(resolve => setTimeout(resolve, 100))
  ])
  .then(([moduleExports]) => moduleExports)
);

// Placeholder component for upcoming features
const ComingSoonFeature = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
    <p className="text-muted-foreground">{title} coming soon</p>
  </div>
);

const OneClickSubmitContent: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className="space-y-6">
      <TitleSection />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="new">New Application</TabsTrigger>
          <TabsTrigger value="banks">Bank Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <Suspense fallback={<div className="w-full p-12 text-center">Loading content...</div>}>
          <TabsContent value="applications" className="space-y-4">
            <ApplicationsList />
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4">
            <ApplicationFlow />
          </TabsContent>

          <TabsContent value="banks" className="space-y-4">
            <ComingSoonFeature title="Bank management tools" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ComingSoonFeature title="Analytics dashboard" />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};

export default OneClickSubmitContent;
