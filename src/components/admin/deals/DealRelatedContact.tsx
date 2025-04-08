
import React from 'react';
import { Contact } from '@/components/admin/contacts/types';
import { TypeBadge } from '@/components/admin/contacts/components/TypeBadge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DealRelatedContactProps {
  contact: Contact;
  onRemoveContact?: () => void;
  canRemove?: boolean;
}

const DealRelatedContact: React.FC<DealRelatedContactProps> = ({ 
  contact, 
  onRemoveContact, 
  canRemove = false 
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md mb-2 bg-white">
      <div className="flex flex-col">
        <div className="font-medium">{contact.name}</div>
        <div className="text-sm text-muted-foreground">{contact.email}</div>
        <div className="mt-1">
          <TypeBadge type={contact.type} />
        </div>
      </div>
      {canRemove && onRemoveContact && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onRemoveContact}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DealRelatedContact;
