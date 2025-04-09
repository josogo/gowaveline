
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TeamMemberForm from './TeamMemberForm';
import { TeamMember, TeamMemberFormData } from './form';

interface TeamMemberDialogProps {
  editingMember: TeamMember | null;
  onSubmit: (data: TeamMemberFormData) => void;
}

const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  editingMember,
  onSubmit
}) => {
  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
        <DialogDescription>
          {editingMember 
            ? 'Update the details for this team member.' 
            : 'Fill in the information below to add a new team member.'}
        </DialogDescription>
      </DialogHeader>
      <TeamMemberForm onSubmit={onSubmit} editingMember={editingMember} />
    </DialogContent>
  );
};

export default TeamMemberDialog;
