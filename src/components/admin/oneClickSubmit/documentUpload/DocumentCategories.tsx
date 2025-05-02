
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck } from 'lucide-react';

interface DocumentCategoriesProps {
  activeTab: string;
}

export const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ activeTab }) => {
  const categories = [
    { id: 'bank', label: 'Bank Statements', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'processing', label: 'Processing Statements', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'identity', label: 'Identity Documents', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'business', label: 'Business Documents', icon: <FileCheck className="h-4 w-4" /> }
  ];

  return (
    <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-50">
      {categories.map(category => (
        <TabsTrigger 
          key={category.id} 
          value={category.id}
          className="text-xs sm:text-sm flex items-center gap-1.5 py-2.5"
        >
          {category.icon}
          {category.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
