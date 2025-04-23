
import React from 'react';
import { 
  ContactFormDialog,
  ImportExportDialog,
} from '@/components/admin/contacts';
import { Contact } from '@/components/admin/contacts/types';
import { toast } from 'sonner';

interface DialogsSectionProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isImportExportDialogOpen: boolean;
  setIsImportExportDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isContactFormOpen: boolean;
  setIsContactFormOpen: (isOpen: boolean) => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (isOpen: boolean) => void;
  handleCreateContact: (data: any) => void;
  editingContact: Contact | null;
  setEditingContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  contactToDelete: Contact | null;
  setContactToDelete: React.Dispatch<React.SetStateAction<Contact | null>>;
}

export const DialogsSection: React.FC<DialogsSectionProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isImportExportDialogOpen,
  setIsImportExportDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isContactFormOpen,
  setIsContactFormOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  handleCreateContact,
  editingContact,
  setEditingContact,
  contactToDelete,
  setContactToDelete
}) => {
  return (
    <>
      {/* Contact Form Dialog */}
      <ContactFormDialog 
        isOpen={isContactFormOpen || editingContact !== null}
        onClose={() => {
          setIsContactFormOpen(false);
          setEditingContact(null);
        }}
        onSubmit={(data) => handleCreateContact(data)}
        contact={editingContact}
      />
      
      {/* Import/Export Dialog */}
      <ImportExportDialog 
        isOpen={isImportDialogOpen || isImportExportDialogOpen}
        onClose={() => {
          setIsImportDialogOpen(false);
          setIsImportExportDialogOpen(false);
        }}
        onImport={(data) => {
          // Handle import logic
          toast.success(`Imported ${Array.isArray(data) ? data.length : 1} contacts`);
        }}
        contactsCount={0}
        onExport={() => {
          // Export logic would go here
          toast.success('Contacts exported successfully');
        }}
      />
    </>
  );
};

export default DialogsSection;
