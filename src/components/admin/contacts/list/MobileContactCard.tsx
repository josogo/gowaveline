
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Contact } from '../types';
import {
  StatusBadge,
  TypeBadge,
  TagList,
  ContactActions,
  ContactInfo
} from '../components';

interface MobileContactCardProps {
  contact: Contact;
  selectedContacts: string[];
  handleToggleSelect: (id: string) => void;
  handleEdit?: (contact: Contact) => void;
  handleDelete?: (id: string) => void;
  navigateToDeals?: () => void;
  setSelectedContacts?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MobileContactCard: React.FC<MobileContactCardProps> = ({
  contact,
  selectedContacts,
  handleToggleSelect,
  handleEdit,
  handleDelete,
  navigateToDeals,
  setSelectedContacts
}) => {
  return (
    <div 
      key={contact.id} 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">{contact.name}</div>
        {setSelectedContacts && (
          <Checkbox 
            checked={selectedContacts.includes(contact.id)}
            onCheckedChange={() => handleToggleSelect(contact.id)}
          />
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <ContactInfo contact={contact} />
        <div><span className="font-medium">Company:</span> {contact.company || 'N/A'}</div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Type:</span> <TypeBadge type={contact.type} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Status:</span> <StatusBadge status={contact.status} />
        </div>
        <div>
          <span className="font-medium">Tags:</span>
          <TagList tags={contact.tags} />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <ContactActions 
          contact={contact}
          onEdit={handleEdit}
          onDelete={handleDelete}
          navigateToDeals={navigateToDeals}
        />
      </div>
    </div>
  );
};
