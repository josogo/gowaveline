
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ value, icon, label, isActive }) => {
  return (
    <TabsTrigger 
      value={value} 
      className="flex items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
    >
      {icon}
      {label}
    </TabsTrigger>
  );
};

export default TabButton;
