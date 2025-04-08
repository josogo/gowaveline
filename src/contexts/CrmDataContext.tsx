
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TeamMember } from '@/components/admin/team/TeamMemberForm';

// Define types for our deals
export interface Deal {
  id: string;
  name: string;
  value: number;
  status: 'pending' | 'closed' | 'lost';
  contactName: string;
  createdAt: string;
  assignedTo: string;
}

interface CrmDataContextType {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  totalVolume: number;
  totalRevenue: number;
  pendingDeals: number;
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
    { id: '1', name: 'ABC Restaurant Group', value: 125000, status: 'pending', contactName: 'James Peterson', createdAt: '2025-03-15', assignedTo: '1' },
    { id: '2', name: 'XYZ Tech Solutions', value: 85000, status: 'pending', contactName: 'Maria Garcia', createdAt: '2025-03-20', assignedTo: '2' },
    { id: '3', name: 'Northside Medical Center', value: 210000, status: 'pending', contactName: 'Dr. Robert Chen', createdAt: '2025-03-22', assignedTo: '3' },
    { id: '4', name: 'City View Hotels', value: 175000, status: 'closed', contactName: 'Emma Thompson', createdAt: '2025-03-10', assignedTo: '4' },
    { id: '5', name: 'Green Valley Landscaping', value: 65000, status: 'pending', contactName: 'Carlos Rodriguez', createdAt: '2025-03-25', assignedTo: '5' }
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

  return (
    <CrmDataContext.Provider 
      value={{ 
        teamMembers, 
        setTeamMembers, 
        deals, 
        setDeals, 
        totalVolume,
        totalRevenue,
        pendingDeals
      }}
    >
      {children}
    </CrmDataContext.Provider>
  );
};
