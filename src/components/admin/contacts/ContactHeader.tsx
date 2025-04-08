
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactActions } from './ContactActions';

interface ContactHeaderProps {
  selectedCount: number;
  onAddClick: () => void;
  onImportExportClick: () => void;
  onBulkDelete: () => void;
}

export const ContactHeader: React.FC<ContactHeaderProps> = ({
  selectedCount,
  onAddClick,
  onImportExportClick,
  onBulkDelete
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <TabsList className="grid grid-cols-5 w-full max-w-md">
        <TabsTrigger value="all">All Contacts</TabsTrigger>
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="prospects">Prospects</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
      </TabsList>
      
      <ContactActions 
        onAddClick={onAddClick}
        onImportExportClick={onImportExportClick}
        selectedCount={selectedCount}
        onBulkDelete={onBulkDelete}
      />
    </div>
  );
};
