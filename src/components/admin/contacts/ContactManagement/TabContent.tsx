
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ContactTabContent } from '@/components/admin/contacts';
import { Contact } from '@/components/admin/contacts/types';

interface TabContentProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  handleEditContact: (contact: Contact) => void;
  handleDeleteContact: (id: string) => void;
  isMobile: boolean;
}

export const TabContent: React.FC<TabContentProps> = ({
  contacts,
  filteredContacts,
  searchTerm,
  setSearchTerm,
  selectedTab,
  setSelectedTab,
  selectedContacts,
  setSelectedContacts,
  handleEditContact,
  handleDeleteContact,
  isMobile
}) => {
  return (
    <TabsContent value={selectedTab} className="mt-6">
      <ContactTabContent 
        contacts={filteredContacts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
        navigateToDeals={() => {}}
      />
    </TabsContent>
  );
};

export default TabContent;
