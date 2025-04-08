
import { useState, useEffect } from 'react';
import { Contact, ContactType, ContactStatus } from '@/components/admin/contacts/types';
import { toast } from 'sonner';
import { useCrmData } from '@/contexts/CrmDataContext';

// Adapter function to convert CrmContact to Contact
function adaptCrmContactToAdminContact(crmContact: any): Contact {
  return {
    id: crmContact.id,
    name: crmContact.name,
    email: crmContact.email || '',
    phone: crmContact.phone || '',
    company: crmContact.company || '',
    title: crmContact.title || '',
    type: (crmContact.type || 'lead') as ContactType,
    status: (crmContact.status || 'new') as ContactStatus,
    tags: crmContact.tags || [],
    address: crmContact.address || '',
    notes: crmContact.notes || '',
    assignedTo: crmContact.assignedTo || '',
    createdAt: crmContact.createdAt
  };
}

export const useContactsManagement = () => {
  // Add console log to help debug the context
  console.log("Using CRM data hook...");
  
  const { contacts: crmContacts, setContacts: setCrmContacts, createDealFromContact } = useCrmData();
  console.log("CRM data retrieved:", { contactsCount: crmContacts?.length });
  
  // Convert CRM contacts to admin contacts format
  const adminContacts = crmContacts.map(adaptCrmContactToAdminContact);
  
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(adminContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  // Update filtered contacts when contacts change
  useEffect(() => {
    setFilteredContacts(adminContacts);
  }, [crmContacts]);
  
  // Filter handlers
  const handleFilter = (filters: Record<string, any>) => {
    let filtered = [...adminContacts];
    
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
    // Convert to CRM contact format before adding
    const newCrmContact = {
      id: `c-${Date.now()}`,
      ...contactData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCrmContacts((prevContacts: any) => [...prevContacts, newCrmContact]);
    setIsAddDialogOpen(false);
    toast.success('Contact added successfully');
    
    // Create a deal if the contact type is prospect
    if (newCrmContact.type === 'prospect') {
      try {
        const dealId = createDealFromContact(newCrmContact);
        console.log("Created deal with ID:", dealId, "for contact:", newCrmContact);
        toast.success('Created a deal for new prospect');
      } catch (error) {
        console.error("Error creating deal from contact:", error);
        toast.error('Failed to create deal for prospect');
      }
    }
  };
  
  const handleUpdateContact = (contactData: any) => {
    if (!editingContact) return;
    
    let dealCreated = false;
    
    // Check if the contact type changed from lead to prospect
    if (editingContact.type !== 'prospect' && contactData.type === 'prospect') {
      try {
        // Find the contact with updates applied
        const updatedContact = { ...editingContact, ...contactData };
        console.log("Converting contact to prospect:", updatedContact);
        
        // Create a new deal for this contact that just became a prospect
        const dealId = createDealFromContact(updatedContact);
        console.log("Created deal with ID:", dealId);
        dealCreated = true;
      } catch (error) {
        console.error("Error creating deal from contact:", error);
        toast.error('Failed to create deal for prospect');
      }
    }
    
    // Update the contact in the state
    setCrmContacts((prevContacts: any) => 
      prevContacts.map((contact: any) => 
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
    setCrmContacts((prevContacts: any) => prevContacts.filter((contact: any) => contact.id !== id));
    toast.success('Contact deleted successfully');
  };
  
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) return;
    
    setCrmContacts((prevContacts: any) => 
      prevContacts.filter((contact: any) => !selectedContacts.includes(contact.id))
    );
    
    setSelectedContacts([]);
    toast.success(`${selectedContacts.length} contacts deleted`);
  };

  return {
    contacts: adminContacts,
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
