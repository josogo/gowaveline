
import React, { ReactNode } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface TrainingHubTabsProps {
  defaultTab: string;
  children: ReactNode;
}

const TrainingHubTabs: React.FC<TrainingHubTabsProps> = ({
  defaultTab,
  children
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="glossary">Glossary</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default TrainingHubTabs;
