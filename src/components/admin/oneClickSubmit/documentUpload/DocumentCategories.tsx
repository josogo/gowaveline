
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Building2, CreditCard, FileText } from 'lucide-react';

interface DocumentCategoriesProps {
  activeTab: string;
}

export const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ activeTab }) => {
  return (
    <TabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger value="bank" className="flex flex-col gap-1 py-3 h-auto">
        <FileCheck className="h-5 w-5" />
        <span className="text-xs">Banking</span>
      </TabsTrigger>
      <TabsTrigger value="business" className="flex flex-col gap-1 py-3 h-auto">
        <Building2 className="h-5 w-5" />
        <span className="text-xs">Business</span>
      </TabsTrigger>
      <TabsTrigger value="processing" className="flex flex-col gap-1 py-3 h-auto">
        <CreditCard className="h-5 w-5" />
        <span className="text-xs">Processing</span>
      </TabsTrigger>
      <TabsTrigger value="other" className="flex flex-col gap-1 py-3 h-auto">
        <FileText className="h-5 w-5" />
        <span className="text-xs">Other</span>
      </TabsTrigger>
    </TabsList>
  );
};
