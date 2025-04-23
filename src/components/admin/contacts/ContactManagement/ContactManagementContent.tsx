
import React, { useState } from 'react';
import { useContactsManagement } from '@/hooks/useContactsManagement';
import { TitleSection } from './TitleSection';
import { TabContent } from './TabContent';
import { DialogsSection } from './DialogsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs } from '@/components/ui/tabs';

const ContactManagementContent: React.FC = () => {
  const {
    contacts,
    filteredContacts,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    selectedContacts,
    setSelectedContacts,
    handleEditContact,
    handleDeleteContact,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isContactFormOpen,
    setIsContactFormOpen,
    handleCreateContact,
    isImportDialogOpen,
    setIsImportDialogOpen,
    editingContact,
    setEditingContact,
    contactToDelete,
    setContactToDelete,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isImportExportDialogOpen,
    setIsImportExportDialogOpen
  } = useContactsManagement();

  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <TitleSection />
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabContent 
          contacts={contacts}
          filteredContacts={filteredContacts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          handleEditContact={handleEditContact}
          handleDeleteContact={handleDeleteContact}
          isMobile={isMobile}
        />
      </Tabs>

      <DialogsSection
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isContactFormOpen={isContactFormOpen}
        setIsContactFormOpen={setIsContactFormOpen}
        handleCreateContact={handleCreateContact}
        isImportDialogOpen={isImportDialogOpen}
        setIsImportDialogOpen={setIsImportDialogOpen}
        editingContact={editingContact}
        setEditingContact={setEditingContact}
        contactToDelete={contactToDelete}
        setContactToDelete={setContactToDelete}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isImportExportDialogOpen={isImportExportDialogOpen}
        setIsImportExportDialogOpen={setIsImportExportDialogOpen}
      />
    </div>
  );
};

export default ContactManagementContent;
