
import React from 'react';
import { Contact } from '@/components/admin/contacts/types';
import { useCrmData } from '@/contexts/CrmDataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DealRelatedContactProps {
  contactId: string;
  onEdit?: (contact: Contact) => void;
}

const DealRelatedContact: React.FC<DealRelatedContactProps> = ({ contactId, onEdit }) => {
  const { contacts } = useCrmData();
  
  // Find the contact in our context
  const contact = contacts.find(c => c.id === contactId);
  
  if (!contact) return null;
  
  return (
    <div className="flex items-center justify-between p-2 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h4>
        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-gray-100">
          {contact.type}
        </Badge>
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(contact)}
            className="h-7 px-2"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default DealRelatedContact;
