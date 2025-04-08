
import { useCrmData } from '@/contexts/CrmDataContext';
import { Contact } from '@/components/admin/contacts/types';

export const useDealsHelpers = () => {
  const { teamMembers, contacts, deals } = useCrmData();

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'lost': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(member => member.id === id);
    return member ? member.name : 'Unassigned';
  };
  
  const getRelatedContacts = (dealId: string): Contact[] => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal || !deal.relatedContacts) return [];
    
    // Convert CrmDataContext.Contact to admin/contacts/types.Contact
    return contacts.filter(contact => deal.relatedContacts?.includes(contact.id))
      .map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        type: contact.type || 'lead',
        status: contact.status || 'new',
        tags: contact.tags || [],
        createdAt: contact.createdAt
      }));
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'statement': return 'Merchant Statement';
      case 'bank': return 'Bank Statement';
      case 'corp_docs': return 'Corporation Documents';
      case 'license': return 'License';
      case 'void_check': return 'Void Check';
      case 'tax_return': return 'Tax Return';
      case 'other': return 'Other Document';
      default: return type;
    }
  };

  const getFormDefaultValues = (editingDealId: string | null) => {
    if (editingDealId) {
      const deal = deals.find(d => d.id === editingDealId);
      return {
        name: deal?.name || '',
        value: deal?.value || 0,
        processingVolume: deal?.processingVolume || 0,
        contactName: deal?.contactName || '',
        status: deal?.status as 'pending' | 'closed' | 'lost',
        assignedTo: deal?.assignedTo || ''
      };
    }
    
    return {
      name: '',
      value: 0,
      processingVolume: 0,
      contactName: '',
      status: 'pending' as const,
      assignedTo: ''
    };
  };

  return {
    getStatusBadgeColor,
    getTeamMemberName,
    getRelatedContacts,
    getDocumentTypeLabel,
    getFormDefaultValues
  };
};
