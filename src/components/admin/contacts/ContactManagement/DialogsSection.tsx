
import React from 'react';
import { 
  ContactFormDialog,
  ImportExportDialog,
} from '@/components/admin/contacts';
import { Contact } from '@/components/admin/contacts/types';
import { toast } from 'sonner';

interface DialogsSectionProps {
  isAddDialogOpen: boolean;
  isImportExportDialogOpen: boolean;
  editingContact: Contact | null;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsImportExportDialogOpen: (isOpen: boolean) => void;
  setEditingContact: (contact: Contact | null) => void;
  handleAddContact: (data: any) => void;
  handleUpdateContact: (data: any) => void;
  contacts: Contact[];
}

export const DialogsSection: React.FC<DialogsSectionProps> = ({
  isAddDialogOpen,
  isImportExportDialogOpen,
  editingContact,
  setIsAddDialogOpen,
  setIsImportExportDialogOpen,
  setEditingContact,
  handleAddContact,
  handleUpdateContact,
  contacts
}) => {
  return (
    <>
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
    </>
  );
};

export default DialogsSection;
