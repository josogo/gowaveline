
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCrmData, Deal, DealDocument } from '@/contexts/CrmDataContext';
import { Contact } from '@/components/admin/contacts/types';
import { DealFormValues } from '../DealForm';
import { DocumentFormValues } from '../DocumentForm';
import { DealsState } from '../types';

export const useDealsActions = (
  state: DealsState,
  setState: React.Dispatch<React.SetStateAction<DealsState>>
) => {
  const { deals, setDeals, linkContactToDeal } = useCrmData();
  const navigate = useNavigate();

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
        processingVolume: values.processingVolume,
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

  return {
    openEditDialog,
    openAddDialog,
    openDealDetail,
    closeDealDetail,
    closeDialog,
    openDocumentUpload,
    closeDocumentUpload,
    handleSearchChange,
    handleSubmit,
    handleDocumentSubmit,
    handleDelete,
    handleStatusChange,
    handleSortChange,
    handleLinkContact,
    handleSetEditingContact
  };
};
