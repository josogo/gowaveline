
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Deal } from '@/contexts/CrmDataContext';
import { Contact } from '@/components/admin/contacts/types';
import { DealCard } from '../DealCard';

interface DealDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDeal: Deal | null;
  onEdit: () => void;
  onStatusChange: (status: 'pending' | 'closed' | 'lost') => void;
  onUploadDocument: () => void;
  getTeamMemberName: (id: string) => string;
  getRelatedContacts: (dealId: string) => Contact[];
  handleLinkContact: (contactId: string) => void;
  contacts: Contact[];
  setEditingContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  getDocumentTypeLabel: (type: string) => string;
  getStatusBadgeColor: (status: string) => string;
}

const DealDetailDialog: React.FC<DealDetailDialogProps> = ({
  isOpen,
  onClose,
  selectedDeal,
  onEdit,
  onStatusChange,
  onUploadDocument,
  getTeamMemberName,
  getRelatedContacts,
  handleLinkContact,
  contacts,
  setEditingContact,
  getDocumentTypeLabel,
  getStatusBadgeColor
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-0">
        {selectedDeal && (
          <DealCard 
            deal={selectedDeal} 
            onClose={onClose}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onUploadDocument={onUploadDocument}
            getTeamMemberName={getTeamMemberName}
            getRelatedContacts={getRelatedContacts}
            handleLinkContact={handleLinkContact}
            contacts={contacts}
            setEditingContact={setEditingContact}
            getDocumentTypeLabel={getDocumentTypeLabel}
            getStatusBadgeColor={getStatusBadgeColor}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DealDetailDialog;
