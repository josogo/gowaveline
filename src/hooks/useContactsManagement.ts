
import { useState, useEffect } from 'react';
import { Contact } from '@/components/admin/contacts/types';
import { toast } from 'sonner';
import { useCrmData } from '@/contexts/CrmDataContext';

export const useContactsManagement = () => {
  const { contacts, setContacts, createDealFromContact } = useCrmData();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  // Update filtered contacts when contacts change
  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);
  
  // Filter handlers
  const handleFilter = (filters: Record<string, any>) => {
    let filtered = [...contacts];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) || 
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.company && contact.company.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(contact => contact.status === filters.status);
    }
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(contact => contact.type === filters.type);
    }
    
    setFilteredContacts(filtered);
  };
  
  // Contact CRUD operations
  const handleAddContact = (contactData: any) => {
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      ...contactData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setContacts(prevContacts => [...prevContacts, newContact]);
    setIsAddDialogOpen(false);
    toast.success('Contact added successfully');
    
    // Create a deal if the contact type is prospect
    if (newContact.type === 'prospect') {
      const dealId = createDealFromContact(newContact);
      toast.success('Created a deal for new prospect');
    }
  };
  
  const handleUpdateContact = (contactData: any) => {
    if (!editingContact) return;
    
    let dealCreated = false;
    // Check if the contact type changed from lead to prospect
    if (editingContact.type === 'lead' && contactData.type === 'prospect') {
      // Find the contact with updates applied
      const updatedContact = { ...editingContact, ...contactData };
      // Create a new deal for this contact that just became a prospect
      const dealId = createDealFromContact(updatedContact);
      dealCreated = true;
    }
    
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === editingContact.id ? { ...contact, ...contactData } : contact
      )
    );
    
    setEditingContact(null);
    toast.success('Contact updated successfully');
    
    if (dealCreated) {
      toast.success('New deal created for converted prospect');
    }
  };
  
  const handleDeleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    toast.success('Contact deleted successfully');
  };
  
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) return;
    
    setContacts(prevContacts => 
      prevContacts.filter(contact => !selectedContacts.includes(contact.id))
    );
    
    setSelectedContacts([]);
    toast.success(`${selectedContacts.length} contacts deleted`);
  };

  return {
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
  };
};
