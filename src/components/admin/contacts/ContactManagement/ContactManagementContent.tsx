
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { 
  ContactFilters,
  ContactHeader
} from '@/components/admin/contacts';
import { useContactsManagement } from '@/hooks/useContactsManagement';
import TitleSection from './TitleSection';
import TabContent from './TabContent';
import DialogsSection from './DialogsSection';

const ContactManagementContent: React.FC = () => {
  const {
    contacts,
    filteredContacts,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isImportExportDialogOpen,
    setIsImportExportDialogOpen,
    editingContact,
    setEditingContact,
    selectedContacts,
    setSelectedContacts,
    handleFilter,
    handleAddContact,
    handleUpdateContact,
    handleDeleteContact,
    handleBulkDelete,
    navigateToDeals
  } = useContactsManagement();
  
  return (
    <div className="space-y-6">
      <TitleSection />

      <Tabs defaultValue="all" className="w-full">
        <ContactHeader 
          selectedCount={selectedContacts.length}
          onAddClick={() => setIsAddDialogOpen(true)}
          onImportExportClick={() => setIsImportExportDialogOpen(true)}
          onBulkDelete={handleBulkDelete}
        />
        
        <ContactFilters onFilter={handleFilter} />
        
        <TabContent 
          value="all" 
          contacts={filteredContacts} 
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          onEditContact={setEditingContact}
          onDeleteContact={handleDeleteContact}
          navigateToDeals={navigateToDeals}
        />
        
        <TabContent 
          value="clients" 
          contacts={filteredContacts.filter(c => c.type === 'client')}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          onEditContact={setEditingContact}
          onDeleteContact={handleDeleteContact}
          navigateToDeals={navigateToDeals}
        />
        
        <TabContent 
          value="leads" 
          contacts={filteredContacts.filter(c => c.type === 'lead')}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          onEditContact={setEditingContact}
          onDeleteContact={handleDeleteContact}
          navigateToDeals={navigateToDeals}
        />
        
        <TabContent 
          value="prospects" 
          contacts={filteredContacts.filter(c => c.type === 'prospect')}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          onEditContact={setEditingContact}
          onDeleteContact={handleDeleteContact}
          navigateToDeals={navigateToDeals}
        />
        
        <TabContent 
          value="partners" 
          contacts={filteredContacts.filter(c => c.type === 'partner')}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          onEditContact={setEditingContact}
          onDeleteContact={handleDeleteContact}
          navigateToDeals={navigateToDeals}
        />
      </Tabs>
      
      <DialogsSection 
        isAddDialogOpen={isAddDialogOpen}
        isImportExportDialogOpen={isImportExportDialogOpen}
        editingContact={editingContact}
        setIsAddDialogOpen={setIsAddDialogOpen}
        setIsImportExportDialogOpen={setIsImportExportDialogOpen}
        setEditingContact={setEditingContact}
        handleAddContact={handleAddContact}
        handleUpdateContact={handleUpdateContact}
        contacts={contacts}
      />
    </div>
  );
};

export default ContactManagementContent;
