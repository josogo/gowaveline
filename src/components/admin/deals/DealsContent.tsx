
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCrmData } from '@/contexts/CrmDataContext';
import { useLocation } from 'react-router-dom';

import DealsHeader from './DealsHeader';
import DealsTable from './DealsTable';
import { useDealsState, useDealsActions, useDealsHelpers } from './hooks';
import { DealDialog, DocumentDialog, DealDetailDialog } from './dialogs';

const DealsContent = () => {
  const { teamMembers, contacts } = useCrmData();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dealIdFromUrl = queryParams.get('dealId');

  // Custom hooks for state, actions, and helper functions
  const { state, setState, filteredDeals } = useDealsState(dealIdFromUrl);
  const {
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
  } = useDealsActions(state, setState);
  const {
    getStatusBadgeColor,
    getTeamMemberName,
    getRelatedContacts,
    getDocumentTypeLabel,
    getFormDefaultValues
  } = useDealsHelpers();

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
      
      {/* Dialogs */}
      <DealDialog 
        isOpen={state.isDialogOpen}
        onClose={closeDialog}
        defaultValues={getFormDefaultValues(state.editingDeal)}
        onSubmit={handleSubmit}
        isEditing={!!state.editingDeal}
        teamMembers={teamMembers}
      />
      
      <DealDetailDialog 
        isOpen={state.isDetailOpen}
        onClose={closeDealDetail}
        selectedDeal={state.selectedDeal}
        onEdit={() => state.selectedDeal && openEditDialog(state.selectedDeal)}
        onStatusChange={(status) => state.selectedDeal && handleStatusChange(state.selectedDeal.id, status)}
        onUploadDocument={openDocumentUpload}
        getTeamMemberName={getTeamMemberName}
        getRelatedContacts={getRelatedContacts}
        handleLinkContact={handleLinkContact}
        contacts={contacts}
        setEditingContact={handleSetEditingContact}
        getDocumentTypeLabel={getDocumentTypeLabel}
        getStatusBadgeColor={getStatusBadgeColor}
      />
      
      <DocumentDialog 
        isOpen={state.isDocUploadOpen}
        onClose={closeDocumentUpload}
        onSubmit={handleDocumentSubmit}
      />
    </div>
  );
};

export default DealsContent;
