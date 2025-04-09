import React, { createContext, useContext, useState, useEffect } from 'react';

// Define interfaces for the data
export interface Deal {
  id: string;
  name: string;
  value: number;
  processingVolume?: number;
  status: 'pending' | 'closed' | 'lost';
  contactName: string;
  assignedTo: string;
  createdAt: string;
  relatedContacts?: string[];
  documents?: DealDocument[];
}

export interface DealDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  commissionSplit: string;
  processingVolume: number;
  revenueVolume?: number;
  profilePicture?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  status: string;
  createdAt: string;
  phone?: string;
  tags?: string[];
}

// Define the context type
interface CrmDataContextType {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  linkContactToDeal: (contactId: string, dealId: string) => void;
  createDealFromContact: (contact: any) => string;
  totalVolume: number;
  totalRevenue: number;
  pendingDeals: number;
}

// Create the context
const CrmDataContext = createContext<CrmDataContextType | undefined>(undefined);

// Mock data for contacts
const initialContacts = [
  {
    "id": "c1",
    "name": "John Smith",
    "email": "john.123@gmail.com",
    "company": "ABC Restaurant",
    "type": "customer",
    "status": "active",
    "createdAt": "2023-01-15"
  },
  {
    "id": "c2",
    "name": "Jane Doe",
    "email": "jane.doe@xyzretail.com",
    "company": "XYZ Retail",
    "type": "lead",
    "status": "inactive",
    "createdAt": "2022-11-20"
  },
  {
    "id": "c3",
    "name": "Alice Johnson",
    "email": "alice.j@xyzretail.com",
    "company": "XYZ Retail",
    "type": "prospect",
    "status": "active",
    "createdAt": "2023-02-01"
  },
  {
    "id": "c4",
    "name": "Robert Chen",
    "email": "robert.chen@goldengatecoffee.com",
    "company": "Golden Gate Coffee",
    "type": "customer",
    "status": "active",
    "createdAt": "2022-12-10"
  },
  {
    "id": "c5",
    "name": "Emily White",
    "email": "emily.w@newtechsolutions.net",
    "company": "NewTech Solutions",
    "type": "lead",
    "status": "active",
    "createdAt": "2023-01-25"
  },
  {
    "id": "c6",
    "name": "David Green",
    "email": "david.g@globalexports.org",
    "company": "Global Exports",
    "type": "prospect",
    "status": "inactive",
    "createdAt": "2022-10-01"
  },
  {
    "id": "c7",
    "name": "Linda Perez",
    "email": "linda.p@familyfoods.co",
    "company": "Family Foods",
    "type": "customer",
    "status": "active",
    "createdAt": "2023-03-01"
  },
  {
    "id": "c8",
    "name": "Thomas Black",
    "email": "thomas.b@oceanviewhotel.com",
    "company": "Ocean View Hotel",
    "type": "lead",
    "status": "active",
    "createdAt": "2022-09-15"
  },
  {
    "id": "c9",
    "name": "Karen Lee",
    "email": "karen.lee@brightstarenergy.com",
    "company": "Bright Star Energy",
    "type": "prospect",
    "status": "inactive",
    "createdAt": "2023-02-15"
  },
  {
    "id": "c10",
    "name": "George Hill",
    "email": "george.h@pioneerbank.com",
    "company": "Pioneer Bank",
    "type": "customer",
    "status": "active",
    "createdAt": "2022-11-01"
  }
];

// Mock data for deals
const initialDeals = [
  {
    id: 'd1',
    name: 'ABC Restaurant POS System',
    value: 5000,
    processingVolume: 25000,
    status: 'pending' as const,
    contactName: 'John Smith',
    assignedTo: 't1',
    createdAt: '2023-03-15',
    relatedContacts: ['c1'],
    documents: [
      {
        id: 'doc1',
        name: 'Statement March 2023',
        type: 'statement',
        uploadedAt: '2023-03-20T10:30:00Z',
        uploadedBy: 'Sarah Jones',
        fileUrl: '#',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024 * 2.5
      },
      {
        id: 'doc2',
        name: 'Business License',
        type: 'license',
        uploadedAt: '2023-03-18T14:15:00Z',
        uploadedBy: 'Sarah Jones',
        fileUrl: '#',
        fileType: 'image/jpeg',
        fileSize: 1024 * 512
      }
    ]
  },
  {
    id: 'd2',
    name: 'XYZ Retail Payment Gateway',
    value: 3500,
    processingVolume: 18000,
    status: 'closed' as const,
    contactName: 'Jane Doe',
    assignedTo: 't2',
    createdAt: '2023-02-28',
    relatedContacts: ['c2', 'c3'],
    documents: [
      {
        id: 'doc3',
        name: 'Contract',
        type: 'other',
        uploadedAt: '2023-03-01T09:45:00Z',
        uploadedBy: 'Mike Johnson',
        fileUrl: '#',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024 * 1.8
      }
    ]
  },
  {
    id: 'd3',
    name: 'Golden Gate Coffee ATM Installation',
    value: 7500,
    processingVolume: 35000,
    status: 'pending' as const,
    contactName: 'Robert Chen',
    assignedTo: 't1',
    createdAt: '2023-03-10',
    relatedContacts: ['c4'],
    documents: []
  }
];

// Mock data for team members
const initialTeamMembers = [
  {
    id: 't1',
    name: 'Sarah Jones',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    role: 'Sales Manager',
    commissionSplit: '70/30',
    processingVolume: 95000,
    revenueVolume: 35000,
    profilePicture: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: 't2',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '(555) 987-6543',
    role: 'Sales Representative',
    commissionSplit: '60/40',
    processingVolume: 78000,
    revenueVolume: 28000,
    profilePicture: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 't3',
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    phone: '(555) 456-7890',
    role: 'Account Executive',
    commissionSplit: '65/35',
    processingVolume: 82000,
    revenueVolume: 32000,
    profilePicture: 'https://i.pravatar.cc/150?img=25'
  }
];

// Create the provider component
export const CrmDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Load data from localStorage or use initial data
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const savedContacts = localStorage.getItem('crm_contacts');
    return savedContacts ? JSON.parse(savedContacts) : initialContacts;
  });
  
  const [deals, setDeals] = useState<Deal[]>(() => {
    const savedDeals = localStorage.getItem('crm_deals');
    return savedDeals ? JSON.parse(savedDeals) : initialDeals;
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const savedTeamMembers = localStorage.getItem('crm_team_members');
    return savedTeamMembers ? JSON.parse(savedTeamMembers) : initialTeamMembers;
  });
  
  // Calculate derived values
  const totalVolume = deals.reduce((sum, deal) => sum + (deal.processingVolume || 0), 0);
  const totalRevenue = deals
    .filter(deal => deal.status === 'closed')
    .reduce((sum, deal) => sum + deal.value, 0);
  const pendingDeals = deals.filter(deal => deal.status === 'pending').length;
  
  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }, [contacts]);
  
  useEffect(() => {
    localStorage.setItem('crm_deals', JSON.stringify(deals));
  }, [deals]);
  
  useEffect(() => {
    localStorage.setItem('crm_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Function to link a contact to a deal
  const linkContactToDeal = (contactId: string, dealId: string) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const existingRelatedContacts = deal.relatedContacts || [];
          if (existingRelatedContacts.includes(contactId)) {
            return deal;
          }
          return {
            ...deal,
            relatedContacts: [...existingRelatedContacts, contactId]
          };
        }
        return deal;
      })
    );
  };

  // Function to create a deal from a contact
  const createDealFromContact = (contact: any) => {
    const newDealId = `d-${Date.now()}`;
    const newDeal: Deal = {
      id: newDealId,
      name: `New opportunity with ${contact.company || contact.name}`,
      value: 0,
      processingVolume: 0,
      status: 'pending',
      contactName: contact.name,
      assignedTo: teamMembers[0].id,
      createdAt: new Date().toISOString().split('T')[0],
      relatedContacts: [contact.id]
    };
    
    setDeals(prevDeals => [...prevDeals, newDeal]);
    return newDealId;
  };
  
  const value = {
    contacts,
    setContacts,
    deals,
    setDeals,
    teamMembers,
    setTeamMembers,
    linkContactToDeal,
    createDealFromContact,
    totalVolume,
    totalRevenue,
    pendingDeals
  };
  
  return (
    <CrmDataContext.Provider value={value}>
      {children}
    </CrmDataContext.Provider>
  );
};

// Custom hook to use the context
export const useCrmData = () => {
  const context = useContext(CrmDataContext);
  if (context === undefined) {
    throw new Error('useCrmData must be used within a CrmDataProvider');
  }
  return context;
};
