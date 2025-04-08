
import React from 'react';
import { Mail, Phone, Building } from 'lucide-react';
import { Contact } from '../types';

interface ContactInfoProps {
  contact: Contact;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ contact }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Mail className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{contact.email}</span>
      </div>
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{contact.phone}</span>
      </div>
    </div>
  );
};
