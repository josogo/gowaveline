import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useCrmData, Deal, DealDocument } from '@/contexts/CrmDataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Contact } from '@/components/admin/contacts/types';

import DealsHeader from './DealsHeader';
import DealsTable from './DealsTable';
import DealForm, { DealFormValues } from './DealForm';
import DocumentForm, { DocumentFormValues } from './DocumentForm';
import { DealDialogType, DealsState } from './types';
import { DealCard } from './DealCard';

const DealsContent = () => {
  const { deals, setDeals, teamMembers, contacts, linkContactToDeal } = useCrmData();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const dealIdFromUrl = queryParams.get('dealId');

  const [state, setState] = useState<DealsState>({
    isDialogOpen: false,
    isDetailOpen: false,
    isDocUploadOpen: false,
    editingDeal: null,
    selectedDeal: null,
    searchQuery: '',
    sortField: 'createdAt',
    sortDirection: 'desc',
    editingContact: null
  });

  useEffect(() => {
    if (dealIdFromUrl) {
      const deal = deals.find(d => d.id === dealIdFromUrl);
      if (deal) {
        setState(prev => ({
          ...prev,
          selectedDeal: deal,
          isDetailOpen: true
        }));
      }
    }
  }, [dealIdFromUrl, deals]);

  const openEditDialog = (deal: Deal) => {
    setState(prev => ({
      ...prev,
      editingDeal: deal.id,
      isDialogOpen: true
    }));
  };
  
  const openAddDialog = () => {
    setState(prev => ({
      ...prev,
      editingDeal: null,
      isDialogOpen: true
    }));
  };
  
  const openDealDetail = (deal: Deal) => {
    setState(prev => ({
      ...prev,
      selectedDeal: deal,
      isDetailOpen: true
    }));
    navigate(`/admin/deals?dealId=${deal.id}`, { replace: true });
  };
  
  const closeDealDetail = () => {
    setState(prev => ({
      ...prev,
      isDetailOpen: false,
      selectedDeal: null
    }));
    navigate('/admin/deals', { replace: true });
  };

  const closeDialog = () => {
    setState(prev => ({
      ...prev,
      isDialogOpen: false
    }));
  };

  const closeDocumentUpload = () => {
    setState(prev => ({
      ...prev,
      isDocUploadOpen: false
    }));
  };

  const openDocumentUpload = () => {
    setState(prev => ({
      ...prev,
      isDocUploadOpen: true
    }));
  };

  const handleSearchChange = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  const handleSubmit = (values: DealFormValues) => {
    if (state.editingDeal) {
      setDeals(prev => prev.map(deal => 
        deal.id === state.editingDeal ? {
          ...deal,
          ...values
        } : deal
      ));
      toast.success('Deal updated successfully');
    } else {
      const newDeal: Deal = {
        id: Date.now().toString(),
        name: values.name,
        value: values.value,
        status: values.status,
        contactName: values.contactName,
        assignedTo: values.assignedTo,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDeals(prev => [...prev, newDeal]);
      toast.success('Deal created successfully');
    }
    
    setState(prev => ({
      ...prev,
      isDialogOpen: false
    }));
  };
  
  const handleDocumentSubmit = (values: DocumentFormValues) => {
    if (!state.selectedDeal) return;
    
    const mockDocument: DealDocument = {
      id: Date.now().toString(),
      name: values.name,
      type: values.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileUrl: '#',
      fileType: 'application/pdf',
      fileSize: 1024 * 1024 * 2
    };
    
    setDeals(prev => prev.map(deal => {
      if (deal.id === state.selectedDeal!.id) {
        const documents = deal.documents || [];
        return {
          ...deal,
          documents: [...documents, mockDocument]
        };
      }
      return deal;
    }));
    
    setState(prev => ({
      ...prev,
      isDocUploadOpen: false
    }));
    
    toast.success('Document uploaded successfully');
  };
  
  const handleDelete = (id: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== id));
    toast.success('Deal deleted successfully');
  };
  
  const handleStatusChange = (id: string, status: 'pending' | 'closed' | 'lost') => {
    setDeals(prev => prev.map(deal => 
      deal.id === id ? { ...deal, status } : deal
    ));
    toast.success(`Deal marked as ${status}`);
  };
  
  const handleSortChange = (field: keyof Deal) => {
    setState(prev => {
      if (prev.sortField === field) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
        };
      } else {
        return {
          ...prev,
          sortField: field,
          sortDirection: 'asc'
        };
      }
    });
  };
  
  const handleLinkContact = (contactId: string) => {
    if (!state.selectedDeal) return;
    linkContactToDeal(contactId, state.selectedDeal.id);
    toast.success('Contact linked to deal');
  };

  const handleSetEditingContact = (contact: Contact | null) => {
    setState(prev => ({
      ...prev,
      editingContact: contact
    }));
  };
  
  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => 
        deal.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (state.sortField === 'value') {
          return state.sortDirection === 'asc' 
            ? a.value - b.value 
            : b.value - a.value;
        } else {
          const valueA = a[state.sortField]?.toString() || '';
          const valueB = b[state.sortField]?.toString() || '';
          return state.sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
  }, [deals, state.searchQuery, state.sortField, state.sortDirection]);
  
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
  
  const getRelatedContacts = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal || !deal.relatedContacts) return [];
    return contacts.filter(contact => deal.relatedContacts?.includes(contact.id));
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

  const getFormDefaultValues = () => {
    if (state.editingDeal) {
      const deal = deals.find(d => d.id === state.editingDeal);
      return {
        name: deal?.name || '',
        value: deal?.value || 0,
        contactName: deal?.contactName || '',
        status: deal?.status as 'pending' | 'closed' | 'lost',
        assignedTo: deal?.assignedTo || ''
      };
    }
    
    return {
      name: '',
      value: 0,
      contactName: '',
      status: 'pending' as const,
      assignedTo: ''
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <DealsHeader 
          onAddDeal={openAddDialog} 
          searchQuery={state.searchQuery}
          onSearchChange={handleSearchChange}
        />
        <CardContent>
          <DealsTable 
            deals={filteredDeals}
            sortField={state.sortField}
            sortDirection={state.sortDirection}
            onSortChange={handleSortChange}
            onStatusChange={handleStatusChange}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onDealSelect={openDealDetail}
            getStatusBadgeColor={getStatusBadgeColor}
            getTeamMemberName={getTeamMemberName}
          />
        </CardContent>
      </Card>
      
      <Dialog open={state.isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{state.editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
            <DialogDescription>
              {state.editingDeal 
                ? 'Update the details for this deal.' 
                : 'Fill in the information below to add a new deal.'}
            </DialogDescription>
          </DialogHeader>
          
          <DealForm 
            defaultValues={getFormDefaultValues()}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
            teamMembers={teamMembers}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={state.isDetailOpen} onOpenChange={closeDealDetail}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-0">
          {state.selectedDeal && (
            <DealCard 
              deal={state.selectedDeal} 
              onClose={closeDealDetail}
              onEdit={() => openEditDialog(state.selectedDeal!)}
              onStatusChange={(status) => handleStatusChange(state.selectedDeal!.id, status)}
              onUploadDocument={openDocumentUpload}
              getTeamMemberName={getTeamMemberName}
              getRelatedContacts={getRelatedContacts}
              handleLinkContact={handleLinkContact}
              contacts={contacts}
              setEditingContact={handleSetEditingContact}
              getDocumentTypeLabel={getDocumentTypeLabel}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={state.isDocUploadOpen} onOpenChange={closeDocumentUpload}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for this deal.
            </DialogDescription>
          </DialogHeader>
          
          <DocumentForm 
            onSubmit={handleDocumentSubmit}
            onCancel={closeDocumentUpload}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsContent;
