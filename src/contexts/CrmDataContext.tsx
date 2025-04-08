
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TeamMember } from '@/components/admin/team/TeamMemberForm';
import { Contact } from '@/components/admin/contacts/types';

// Define types for our deals
export interface Deal {
  id: string;
  name: string;
  value: number;
  status: 'pending' | 'closed' | 'lost';
  contactName: string;
  createdAt: string;
  assignedTo: string;
  relatedContacts?: string[]; // Array of contact IDs related to this deal
  documents?: DealDocument[];  // Documents attached to the deal
}

export interface DealDocument {
  id: string;
  name: string;
  type: 'statement' | 'bank' | 'corp_docs' | 'license' | 'void_check' | 'tax_return' | 'other';
  uploadedAt: string;
  uploadedBy: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface CrmDataContextType {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  totalVolume: number;
  totalRevenue: number;
  pendingDeals: number;
  createDealFromContact: (contact: Contact) => string; // Returns the ID of the created deal
  linkContactToDeal: (contactId: string, dealId: string) => void;
}

const CrmDataContext = createContext<CrmDataContextType | undefined>(undefined);

export const useCrmData = () => {
  const context = useContext(CrmDataContext);
  if (context === undefined) {
    throw new Error('useCrmData must be used within a CrmDataProvider');
  }
  return context;
};

interface CrmDataProviderProps {
  children: ReactNode;
}

export const CrmDataProvider: React.FC<CrmDataProviderProps> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Smith', email: 'john@gowaveline.com', phone: '555-123-4567', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '425,000', profilePicture: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@gowaveline.com', phone: '555-987-6543', role: 'Account Manager', commissionSplit: '35%', processingVolume: '520,000', profilePicture: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Michael Brown', email: 'michael@gowaveline.com', phone: '555-456-7890', role: 'Sales Representative', commissionSplit: '30%', processingVolume: '310,000', profilePicture: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Lisa Davis', email: 'lisa@gowaveline.com', phone: '555-789-0123', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '410,000', profilePicture: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Robert Wilson', email: 'robert@gowaveline.com', phone: '555-321-6540', role: 'Account Manager', commissionSplit: '30%', processingVolume: '290,000', profilePicture: 'https://i.pravatar.cc/150?img=5' },
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    { id: '1', name: 'ABC Restaurant Group', value: 125000, status: 'pending', contactName: 'James Peterson', createdAt: '2025-03-15', assignedTo: '1', relatedContacts: ['1'] },
    { id: '2', name: 'XYZ Tech Solutions', value: 85000, status: 'pending', contactName: 'Maria Garcia', createdAt: '2025-03-20', assignedTo: '2', relatedContacts: ['2'] },
    { id: '3', name: 'Northside Medical Center', value: 210000, status: 'pending', contactName: 'Dr. Robert Chen', createdAt: '2025-03-22', assignedTo: '3', relatedContacts: ['3'] },
    { id: '4', name: 'City View Hotels', value: 175000, status: 'closed', contactName: 'Emma Thompson', createdAt: '2025-03-10', assignedTo: '4', relatedContacts: ['4'] },
    { id: '5', name: 'Green Valley Landscaping', value: 65000, status: 'pending', contactName: 'Carlos Rodriguez', createdAt: '2025-03-25', assignedTo: '5', relatedContacts: ['5'] }
  ]);

  // Sample contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'James Peterson',
      email: 'james@abc-restaurant.com',
      phone: '(555) 123-4567',
      company: 'ABC Restaurant Group',
      title: 'Owner',
      type: 'client',
      status: 'active',
      tags: ['Restaurant', 'VIP'],
      lastContact: '2025-04-01',
      createdAt: '2024-01-15',
      relatedDeals: ['1']
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria@xyz-tech.com',
      phone: '(555) 987-6543',
      company: 'XYZ Tech Solutions',
      title: 'CEO',
      type: 'lead',
      status: 'new',
      tags: ['Tech', 'Startup'],
      createdAt: '2024-03-20',
      relatedDeals: ['2']
    },
    {
      id: '3',
      name: 'Dr. Robert Chen',
      email: 'robert@northside-medical.com',
      phone: '(555) 456-7890',
      company: 'Northside Medical Center',
      title: 'Medical Director',
      type: 'client',
      status: 'active',
      tags: ['Healthcare', 'Enterprise'],
      lastContact: '2025-04-03',
      createdAt: '2023-11-10',
      relatedDeals: ['3']
    },
    {
      id: '4',
      name: 'Emma Thompson',
      email: 'emma@cityviewhotels.com',
      phone: '(555) 234-5678',
      company: 'City View Hotels',
      title: 'Procurement Manager',
      type: 'client',
      status: 'active',
      tags: ['Hospitality', 'Enterprise'],
      lastContact: '2025-02-15',
      createdAt: '2023-08-22',
      relatedDeals: ['4']
    },
    {
      id: '5',
      name: 'Carlos Rodriguez',
      email: 'carlos@greenvalleylandscaping.com',
      phone: '(555) 876-5432',
      company: 'Green Valley Landscaping',
      title: 'Owner',
      type: 'client',
      status: 'active',
      tags: ['Service', 'Small Business'],
      lastContact: '2025-03-28',
      createdAt: '2024-02-01',
      relatedDeals: ['5']
    }
  ]);

  // Calculate totals based on current data
  const totalVolume = React.useMemo(() => {
    return teamMembers.reduce((sum, member) => {
      const volume = parseInt(member.processingVolume.replace(/[^0-9]/g, ''));
      return sum + volume;
    }, 0);
  }, [teamMembers]);

  // Calculate revenue (35% on closed deals)
  const totalRevenue = React.useMemo(() => {
    return deals
      .filter(deal => deal.status === 'closed')
      .reduce((sum, deal) => sum + (deal.value * 0.35), 0);
  }, [deals]);

  // Count pending deals
  const pendingDeals = React.useMemo(() => {
    return deals.filter(deal => deal.status === 'pending').length;
  }, [deals]);

  // Function to create a new deal from a contact
  const createDealFromContact = (contact: Contact) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      name: contact.company || `${contact.name} Deal`,
      value: 0, // Default value
      status: 'pending',
      contactName: contact.name,
      createdAt: new Date().toISOString().split('T')[0],
      assignedTo: contact.assignedTo || teamMembers[0].id, // Assign to first team member if no assignee
      relatedContacts: [contact.id]
    };
    
    setDeals(prevDeals => [...prevDeals, newDeal]);
    
    // Update the contact to reference this deal
    setContacts(prevContacts => 
      prevContacts.map(c => {
        if (c.id === contact.id) {
          const relatedDeals = c.relatedDeals || [];
          return {
            ...c,
            relatedDeals: [...relatedDeals, newDeal.id]
          };
        }
        return c;
      })
    );
    
    return newDeal.id;
  };
  
  // Function to link a contact to an existing deal
  const linkContactToDeal = (contactId: string, dealId: string) => {
    // Update the deal to include this contact
    setDeals(prevDeals => 
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const relatedContacts = deal.relatedContacts || [];
          if (!relatedContacts.includes(contactId)) {
            return {
              ...deal,
              relatedContacts: [...relatedContacts, contactId]
            };
          }
        }
        return deal;
      })
    );
    
    // Update the contact to reference this deal
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.id === contactId) {
          const relatedDeals = contact.relatedDeals || [];
          if (!relatedDeals.includes(dealId)) {
            return {
              ...contact,
              relatedDeals: [...relatedDeals, dealId]
            };
          }
        }
        return contact;
      })
    );
  };

  return (
    <CrmDataContext.Provider 
      value={{ 
        teamMembers, 
        setTeamMembers, 
        deals, 
        setDeals,
        contacts,
        setContacts,
        totalVolume,
        totalRevenue,
        pendingDeals,
        createDealFromContact,
        linkContactToDeal
      }}
    >
      {children}
    </CrmDataContext.Provider>
  );
};
