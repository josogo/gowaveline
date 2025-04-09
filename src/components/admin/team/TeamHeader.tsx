
import React from 'react';
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import TeamMemberDialog from './TeamMemberDialog';
import { TeamMember, TeamMemberFormData } from './form';

interface TeamHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  editingMember: TeamMember | null;
  onSubmit: (data: TeamMemberFormData) => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  editingMember,
  onSubmit
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle className="text-2xl font-bold text-orange-500">Team Management</CardTitle>
        <CardDescription>Manage your sales team members and their roles</CardDescription>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </DialogTrigger>
        <TeamMemberDialog 
          editingMember={editingMember} 
          onSubmit={onSubmit} 
        />
      </Dialog>
    </div>
  );
};

export default TeamHeader;
