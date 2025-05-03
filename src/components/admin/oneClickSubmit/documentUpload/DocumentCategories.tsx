
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Building2, CreditCard, FileText } from 'lucide-react';

interface DocumentCategoriesProps {
  activeTab: string;
}

export const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ activeTab }) => {
  return (
    <TabsList className="grid grid-cols-4 mb-6 bg-blue-50/50 p-1 rounded-lg">
      <TabsTrigger 
        value="bank" 
        className="flex flex-col gap-1 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700"
      >
        <FileCheck className="h-5 w-5" />
        <span className="text-xs">Banking</span>
      </TabsTrigger>
      <TabsTrigger 
        value="business" 
        className="flex flex-col gap-1 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700"
      >
        <Building2 className="h-5 w-5" />
        <span className="text-xs">Business</span>
      </TabsTrigger>
      <TabsTrigger 
        value="processing" 
        className="flex flex-col gap-1 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700"
      >
        <CreditCard className="h-5 w-5" />
        <span className="text-xs">Processing</span>
      </TabsTrigger>
      <TabsTrigger 
        value="other" 
        className="flex flex-col gap-1 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700"
      >
        <FileText className="h-5 w-5" />
        <span className="text-xs">Other</span>
      </TabsTrigger>
    </TabsList>
  );
};
