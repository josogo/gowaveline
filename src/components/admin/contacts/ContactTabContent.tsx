
import React from 'react';
import { ContactsList } from './ContactsList';
import { Contact } from './types';

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
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <ContactsList
        contacts={contacts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        onEditContact={onEditContact}
        onDeleteContact={onDeleteContact}
        navigateToDeals={navigateToDeals}
      />
    </div>
  );
};
