
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApplicationTabs } from '../hooks/useApplicationTabs';

interface ApplicationTabsProps {
  activeTab: string;
}

export const ApplicationTabs = ({ activeTab }: ApplicationTabsProps) => {
  const tabs = useApplicationTabs();
  
  return (
    <TabsList className="w-full flex overflow-x-auto mb-8 sticky top-[100px] bg-white z-20 p-1 border-b">
      {tabs.map((tab) => (
        <TabsTrigger 
          key={tab.id} 
          value={tab.id}
          className="flex-1 min-w-max px-4 py-2"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
