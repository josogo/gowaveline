
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, FileText, BarChart, Folder } from 'lucide-react';

interface DocumentCategoriesProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="mb-6 bg-slate-100 p-1 border rounded-md">
      <TabsTrigger 
        value="bank" 
        className={`flex items-center gap-1.5 ${activeTab === 'bank' ? 'bg-white text-blue-700' : 'text-gray-600'}`}
        onClick={() => onTabChange('bank')}
      >
        <FileCheck className="h-4 w-4" />
        Banking
      </TabsTrigger>
      <TabsTrigger 
        value="business" 
        className={`flex items-center gap-1.5 ${activeTab === 'business' ? 'bg-white text-blue-700' : 'text-gray-600'}`}
        onClick={() => onTabChange('business')}
      >
        <FileText className="h-4 w-4" />
        Business
      </TabsTrigger>
      <TabsTrigger 
        value="processing" 
        className={`flex items-center gap-1.5 ${activeTab === 'processing' ? 'bg-white text-blue-700' : 'text-gray-600'}`}
        onClick={() => onTabChange('processing')}
      >
        <BarChart className="h-4 w-4" />
        Processing
      </TabsTrigger>
      <TabsTrigger 
        value="other" 
        className={`flex items-center gap-1.5 ${activeTab === 'other' ? 'bg-white text-blue-700' : 'text-gray-600'}`}
        onClick={() => onTabChange('other')}
      >
        <Folder className="h-4 w-4" />
        Other
      </TabsTrigger>
    </TabsList>
  );
};
