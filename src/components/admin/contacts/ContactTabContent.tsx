
import React, { useState } from 'react';
import { ContactsList } from './ContactsList';
import { Contact } from './types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface ContactTabContentProps {
  contacts: Contact[];
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  navigateToDeals: () => void;
}

export const ContactTabContent: React.FC<ContactTabContentProps> = ({
  contacts,
  selectedContacts,
  setSelectedContacts,
  onEditContact,
  onDeleteContact,
  navigateToDeals
}) => {
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const isMobile = useIsMobile();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-2 sm:p-4 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-48">
            <Label htmlFor="sortBy" className="text-xs text-gray-500">Sort By</Label>
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger id="sortBy" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Label htmlFor="sortDirection" className="text-xs text-gray-500">Direction</Label>
            <Select value={sortDirection} onValueChange={(value: string) => setSortDirection(value as 'asc' | 'desc')}>
              <SelectTrigger id="sortDirection" className="w-full">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <ContactsList
        contacts={contacts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        onEditContact={onEditContact}
        onDeleteContact={onDeleteContact}
        navigateToDeals={navigateToDeals}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        isMobile={isMobile}
      />
    </div>
  );
};
