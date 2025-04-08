
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DealForm, { DealFormValues } from '../DealForm';
import { TeamMember } from '@/contexts/CrmDataContext';

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: DealFormValues;
  onSubmit: (values: DealFormValues) => void;
  isEditing: boolean;
  teamMembers: TeamMember[];
}

const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  defaultValues,
  onSubmit,
  isEditing,
  teamMembers
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details for this deal.' 
              : 'Fill in the information below to add a new deal.'}
          </DialogDescription>
        </DialogHeader>
        
        <DealForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          teamMembers={teamMembers}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DealDialog;
