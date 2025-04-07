
import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

interface ViewModeTabsProps {
  viewMode: 'all' | 'categorized';
  setViewMode: (value: 'all' | 'categorized') => void;
  isMobile: boolean;
}

const ViewModeTabs: React.FC<ViewModeTabsProps> = ({
  viewMode,
  setViewMode,
  isMobile,
}) => {
  if (!isMobile) return null;
  
  return (
    <Tabs 
      defaultValue="all" 
      value={viewMode} 
      onValueChange={(value) => setViewMode(value as 'all' | 'categorized')}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all">List View</TabsTrigger>
        <TabsTrigger value="categorized">By Letter</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewModeTabs;
