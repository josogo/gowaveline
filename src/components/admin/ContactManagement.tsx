
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { ContactsList } from './contacts';
import { ContactFilters } from './contacts';
import { ContactActions } from './contacts';
import { ContactFormDialog } from './contacts';
import { ImportExportDialog } from './contacts';
import { useCrmNavigation } from '@/hooks/use-crm-navigation';
import { Contact } from './contacts/types';

// Sample initial contacts data
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    company: 'Acme Inc',
    title: 'CEO',
    type: 'client',
    status: 'active',
    tags: ['VIP', 'Enterprise'],
    address: '123 Main St, New York, NY',
    lastContact: '2023-04-01',
    notes: 'Interested in premium plan',
    assignedTo: 'Sarah Johnson',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    company: 'Tech Solutions',
    title: 'CTO',
    type: 'lead',
    status: 'new',
    tags: ['Tech', 'Startup'],
    address: '456 Park Ave, San Francisco, CA',
    lastContact: '2023-03-28',
    notes: 'Follow up on demo',
    assignedTo: 'Michael Brown',
    createdAt: '2023-03-10'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '555-456-7890',
    company: 'Johnson Retail',
    title: 'Owner',
    type: 'client',
    status: 'active',
    tags: ['Retail', 'SMB'],
    address: '789 Oak Rd, Chicago, IL',
    lastContact: '2023-03-15',
    notes: 'Monthly review scheduled for April 15',
    assignedTo: 'Lisa Davis',
    createdAt: '2022-11-05'
  }
];

const ContactManagementContent = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { navigateToDeals } = useCrmNavigation();

  const handleAddContact = (newContact: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact = {
      ...newContact,
      id: (contacts.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContacts([...contacts, contact]);
    setIsAddContactOpen(false);
    toast.success('Contact added successfully');
  };

  const handleEditContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setSelectedContact(null);
    toast.success('Contact updated successfully');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success('Contact deleted successfully');
  };

  const handleExportContacts = () => {
    // In a real application, this would generate a CSV file
    toast.success('Contacts exported successfully');
    setIsImportExportOpen(false);
  };

  const handleImportContacts = (file: File) => {
    // In a real application, this would parse the CSV file
    toast.success(`Imported contacts from ${file.name}`);
    setIsImportExportOpen(false);
  };

  const filteredContacts = contacts.filter(contact => {
    // Apply status filter
    if (filterStatus !== 'all' && contact.status !== filterStatus) return false;
    
    // Apply type filter
    if (filterType !== 'all' && contact.type !== filterType) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-orange-500">Contact Management</CardTitle>
              <CardDescription>Manage your customer and lead contacts</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsImportExportOpen(true)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> 
                Import/Export
              </Button>
              <Button 
                onClick={() => setIsAddContactOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContactFilters 
            onStatusChange={setFilterStatus}
            onTypeChange={setFilterType}
            onSearchChange={setSearchQuery}
            statusFilter={filterStatus}
            typeFilter={filterType}
            searchQuery={searchQuery}
          />
          
          <div className="mt-6">
            <ContactsList 
              contacts={filteredContacts}
              onEdit={setSelectedContact}
              onDelete={handleDeleteContact}
              navigateToDeals={navigateToDeals}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Contact Form Dialog */}
      <ContactFormDialog 
        isOpen={isAddContactOpen || !!selectedContact} 
        onClose={() => {
          setIsAddContactOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={selectedContact ? handleEditContact : handleAddContact}
        contact={selectedContact}
      />
      
      {/* Import/Export Dialog */}
      <ImportExportDialog
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onExport={handleExportContacts}
        onImport={handleImportContacts}
      />
    </div>
  );
};

export default ContactManagementContent;
