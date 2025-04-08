
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  ContactFilters,
  ContactTabContent,
  ContactFormDialog,
  ImportExportDialog,
  ContactHeader
} from '@/components/admin/contacts';
import { useContactsManagement } from '@/hooks/useContactsManagement';
import { toast } from 'sonner';

const ContactManagement: React.FC = () => {
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
    handleBulkDelete
  } = useContactsManagement();
  
  // Navigation to deals
  const navigateToDeals = () => {
    // TODO: Implement navigation to deals
    console.log("Navigate to deals");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground mt-1">Manage your contacts and leads</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <ContactHeader 
          selectedCount={selectedContacts.length}
          onAddClick={() => setIsAddDialogOpen(true)}
          onImportExportClick={() => setIsImportExportDialogOpen(true)}
          onBulkDelete={handleBulkDelete}
        />
        
        <ContactFilters onFilter={handleFilter} />
        
        <TabsContent value="all" className="mt-6">
          <ContactTabContent 
            contacts={filteredContacts}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            onEditContact={setEditingContact}
            onDeleteContact={handleDeleteContact}
            navigateToDeals={navigateToDeals}
          />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <ContactTabContent 
            contacts={filteredContacts.filter(c => c.type === 'client')}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            onEditContact={setEditingContact}
            onDeleteContact={handleDeleteContact}
            navigateToDeals={navigateToDeals}
          />
        </TabsContent>
        
        <TabsContent value="leads" className="mt-6">
          <ContactTabContent 
            contacts={filteredContacts.filter(c => c.type === 'lead')}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            onEditContact={setEditingContact}
            onDeleteContact={handleDeleteContact}
            navigateToDeals={navigateToDeals}
          />
        </TabsContent>
        
        <TabsContent value="prospects" className="mt-6">
          <ContactTabContent 
            contacts={filteredContacts.filter(c => c.type === 'prospect')}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            onEditContact={setEditingContact}
            onDeleteContact={handleDeleteContact}
            navigateToDeals={navigateToDeals}
          />
        </TabsContent>
        
        <TabsContent value="partners" className="mt-6">
          <ContactTabContent 
            contacts={filteredContacts.filter(c => c.type === 'partner')}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            onEditContact={setEditingContact}
            onDeleteContact={handleDeleteContact}
            navigateToDeals={navigateToDeals}
          />
        </TabsContent>
      </Tabs>
      
      {/* Contact Form Dialog */}
      <ContactFormDialog 
        isOpen={isAddDialogOpen || editingContact !== null}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingContact(null);
        }}
        onSubmit={(data) => editingContact ? handleUpdateContact(data) : handleAddContact(data)}
        contact={editingContact}
      />
      
      {/* Import/Export Dialog */}
      <ImportExportDialog 
        isOpen={isImportExportDialogOpen}
        onClose={() => setIsImportExportDialogOpen(false)}
        onImport={(data) => {
          // Handle import logic
          toast.success(`Imported ${Array.isArray(data) ? data.length : 1} contacts`);
        }}
        contactsCount={contacts.length}
        onExport={() => {
          // Export logic would go here
          toast.success('Contacts exported successfully');
        }}
      />
    </div>
  );
};

export default ContactManagement;
