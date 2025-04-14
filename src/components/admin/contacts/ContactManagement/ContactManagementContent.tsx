
import React, { useState } from 'react';
import { useContactsManagement } from '@/hooks/useContactsManagement';
import { TitleSection } from './TitleSection';
import { TabContent } from './TabContent';
import { DialogsSection } from './DialogsSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  } = useContactsManagement();

  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <TitleSection />
      
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
      />
    </div>
  );
};

export default ContactManagementContent;
