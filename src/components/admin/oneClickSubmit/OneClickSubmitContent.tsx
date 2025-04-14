
import React from 'react';
import { TitleSection } from './TitleSection';
import { ApplicationFlow } from './ApplicationFlow';
import { ApplicationsList } from './ApplicationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const OneClickSubmitContent: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <TitleSection />
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="new">New Application</TabsTrigger>
          <TabsTrigger value="banks">Bank Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          <ApplicationsList />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <ApplicationFlow />
        </TabsContent>

        <TabsContent value="banks" className="space-y-4">
          <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Bank management tools coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Analytics dashboard coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OneClickSubmitContent;
