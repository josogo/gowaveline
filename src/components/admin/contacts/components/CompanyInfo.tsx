
import React from 'react';
import { Building } from 'lucide-react';
import { Contact } from '../types';

interface CompanyInfoProps {
  contact: Contact;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ contact }) => {
  if (!contact.company) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Building className="h-3 w-3 text-gray-400" />
      <span>{contact.company}</span>
      {contact.title && <span className="text-xs text-gray-500">({contact.title})</span>}
    </div>
  );
};
