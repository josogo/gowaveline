
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Contact } from '../types';
import {
  StatusBadge,
  TypeBadge,
  TagList,
  ContactActions,
  ContactInfo,
  CompanyInfo
} from '../components';
import { SortableHeader } from './SortableHeader';

interface ContactsTableProps {
  contacts: Contact[];
  selectedContacts: string[];
  handleToggleSelect: (id: string) => void;
  handleToggleSelectAll: () => void;
  handleEdit?: (contact: Contact) => void;
  handleDelete?: (id: string) => void;
  navigateToDeals?: () => void;
  setSelectedContacts?: React.Dispatch<React.SetStateAction<string[]>>;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  selectedContacts,
  handleToggleSelect,
  handleToggleSelectAll,
  handleEdit,
  handleDelete,
  navigateToDeals,
  setSelectedContacts,
  sortField,
  sortDirection,
  onSort
}) => {
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
              <SortableHeader 
                field="name" 
                label="Name" 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>
              <SortableHeader 
                field="company" 
                label="Company" 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="type" 
                label="Type" 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="status" 
                label="Status" 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
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
