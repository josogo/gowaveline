
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Contact } from './types';
import {
  StatusBadge,
  TypeBadge,
  TagList,
  ContactActions,
  ContactInfo,
  CompanyInfo,
  EmptyState
} from './components';
import { ArrowUpDown } from 'lucide-react';

interface ContactsListProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  navigateToDeals?: () => void;
  selectedContacts?: string[];
  setSelectedContacts?: React.Dispatch<React.SetStateAction<string[]>>;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
}

type SortField = 'name' | 'email' | 'company' | 'type' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onEdit,
  onDelete,
  navigateToDeals,
  selectedContacts = [],
  setSelectedContacts,
  onEditContact,
  onDeleteContact
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'email':
        comparison = (a.email || '').localeCompare(b.email || '');
        break;
      case 'company':
        comparison = (a.company || '').localeCompare(b.company || '');
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Use the appropriate edit/delete handlers
  const handleEdit = onEdit || onEditContact;
  const handleDelete = onDelete || onDeleteContact;

  const SortableHeader = ({ field, label }: { field: SortField, label: string }) => (
    <div 
      onClick={() => handleSort(field)}
      className="flex items-center cursor-pointer hover:text-orange-500 transition-colors"
    >
      {label}
      <ArrowUpDown className="ml-1 h-4 w-4" />
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {setSelectedContacts && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onCheckedChange={handleToggleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>
              <SortableHeader field="name" label="Name" />
            </TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>
              <SortableHeader field="company" label="Company" />
            </TableHead>
            <TableHead>
              <SortableHeader field="type" label="Type" />
            </TableHead>
            <TableHead>
              <SortableHeader field="status" label="Status" />
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.map((contact) => (
            <TableRow key={contact.id} className="group">
              {setSelectedContacts && (
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleSelect(contact.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>
                <ContactInfo contact={contact} />
              </TableCell>
              <TableCell>
                <CompanyInfo contact={contact} />
              </TableCell>
              <TableCell>
                <TypeBadge type={contact.type} />
              </TableCell>
              <TableCell>
                <StatusBadge status={contact.status} />
              </TableCell>
              <TableCell>
                <TagList tags={contact.tags} />
              </TableCell>
              <TableCell className="text-right">
                <ContactActions 
                  contact={contact}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  navigateToDeals={navigateToDeals}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
