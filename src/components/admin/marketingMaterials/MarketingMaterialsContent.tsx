
import React, { useState } from 'react';
import { MarketingHeader } from './MarketingHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialsGrid } from './MaterialsGrid';
import { BusinessCardTemplate } from './BusinessCardTemplate';
import { AgentTips } from './AgentTips';

const MarketingMaterialsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');

  return (
    <div className="space-y-6">
      <MarketingHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="materials">One-Page Materials</TabsTrigger>
          <TabsTrigger value="business-cards">Business Cards</TabsTrigger>
          <TabsTrigger value="tips">Agent Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials" className="space-y-6">
          <MaterialsGrid />
        </TabsContent>

        <TabsContent value="business-cards" className="space-y-6">
          <BusinessCardTemplate />
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <AgentTips />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingMaterialsContent;
