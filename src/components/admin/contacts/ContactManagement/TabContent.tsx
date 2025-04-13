
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ContactTabContent } from '@/components/admin/contacts';
import { Contact } from '@/components/admin/contacts/types';

interface TabContentProps {
  value: string;
  contacts: Contact[];
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  navigateToDeals: () => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  contacts,
  selectedContacts,
  setSelectedContacts,
  onEditContact,
  onDeleteContact,
  navigateToDeals
}) => {
  return (
    <TabsContent value={value} className="mt-6">
      <ContactTabContent 
        contacts={contacts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        onEditContact={onEditContact}
        onDeleteContact={onDeleteContact}
        navigateToDeals={navigateToDeals}
      />
    </TabsContent>
  );
};

export default TabContent;
