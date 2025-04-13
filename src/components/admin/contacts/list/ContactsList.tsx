
import React from 'react';
import { Contact } from '../types';
import { EmptyState } from '../components';
import { MobileContactCard } from './MobileContactCard';
import { ContactsTable } from './ContactsTable';
import { sortContacts } from './sortUtils';

interface ContactsListProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  navigateToDeals?: () => void;
  selectedContacts?: string[];
  setSelectedContacts?: React.Dispatch<React.SetStateAction<string[]>>;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  isMobile?: boolean;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onEdit,
  onDelete,
  navigateToDeals,
  selectedContacts = [],
  setSelectedContacts,
  onEditContact,
  onDeleteContact,
  sortField = 'createdAt',
  sortDirection = 'desc',
  onSort,
  isMobile = false
}) => {
  if (contacts.length === 0) {
    return <EmptyState />;
  }

  const handleToggleSelect = (id: string) => {
    if (!setSelectedContacts) return;
    
    setSelectedContacts(prev => {
      if (prev.includes(id)) {
        return prev.filter(contactId => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleSelectAll = () => {
    if (!setSelectedContacts) return;
    
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  // Sort contacts based on selected field and direction
  const sortedContacts = sortContacts(contacts, sortField, sortDirection);

  // Use the appropriate edit/delete handlers
  const handleEdit = onEdit || onEditContact;
  const handleDelete = onDelete || onDeleteContact;

  // Responsive display based on device type
  if (isMobile) {
    return (
      <div className="space-y-4">
        {sortedContacts.map((contact) => (
          <MobileContactCard
            key={contact.id}
            contact={contact}
            selectedContacts={selectedContacts}
            handleToggleSelect={handleToggleSelect}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            navigateToDeals={navigateToDeals}
            setSelectedContacts={setSelectedContacts}
          />
        ))}
      </div>
    );
  }

  // Standard desktop table view
  return (
    <ContactsTable
      contacts={sortedContacts}
      selectedContacts={selectedContacts}
      handleToggleSelect={handleToggleSelect}
      handleToggleSelectAll={handleToggleSelectAll}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      navigateToDeals={navigateToDeals}
      setSelectedContacts={setSelectedContacts}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
};
