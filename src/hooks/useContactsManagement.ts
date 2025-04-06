
import { useState } from 'react';
import { Contact } from '@/components/admin/contacts/types';
import { toast } from 'sonner';

// Initial mock data for contacts
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc',
    title: 'CEO',
    type: 'client',
    status: 'active',
    tags: ['VIP', 'Enterprise'],
    lastContact: '2025-04-01',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    company: 'TechStart Ltd',
    title: 'Marketing Director',
    type: 'lead',
    status: 'new',
    tags: ['Marketing', 'Startup'],
    createdAt: '2024-03-20'
  },
  {
    id: '3',
    name: 'Robert Williams',
    email: 'robert@example.com',
    phone: '(555) 456-7890',
    company: 'Global Merchants',
    title: 'CFO',
    type: 'client',
    status: 'active',
    tags: ['Finance', 'Enterprise'],
    lastContact: '2025-04-03',
    createdAt: '2023-11-10'
  },
  {
    id: '4',
    name: 'Lisa Davis',
    email: 'lisa@example.com',
    phone: '(555) 234-5678',
    company: 'Local Shop',
    title: 'Owner',
    type: 'client',
    status: 'inactive',
    tags: ['Retail', 'Small Business'],
    lastContact: '2025-02-15',
    createdAt: '2023-08-22'
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '(555) 876-5432',
    company: 'Tech Innovations',
    title: 'CTO',
    type: 'partner',
    status: 'active',
    tags: ['Technology', 'R&D'],
    lastContact: '2025-03-28',
    createdAt: '2024-02-01'
  }
];

export const useContactsManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
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
      id: String(contacts.length + 1),
      ...contactData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    setIsAddDialogOpen(false);
    toast.success('Contact added successfully');
  };
  
  const handleUpdateContact = (contactData: any) => {
    if (!editingContact) return;
    
    const updatedContacts = contacts.map(contact => 
      contact.id === editingContact.id ? { ...contact, ...contactData } : contact
    );
    
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    setEditingContact(null);
    toast.success('Contact updated successfully');
  };
  
  const handleDeleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    toast.success('Contact deleted successfully');
  };
  
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) return;
    
    const updatedContacts = contacts.filter(
      contact => !selectedContacts.includes(contact.id)
    );
    
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
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
