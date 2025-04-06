
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { TeamMemberForm, TeamMembersTable, TeamSearch } from './team';
import type { TeamMember } from './team';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Smith', email: 'john@gowaveline.com', phone: '555-123-4567', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '425,000' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@gowaveline.com', phone: '555-987-6543', role: 'Account Manager', commissionSplit: '35%', processingVolume: '520,000' },
    { id: '3', name: 'Michael Brown', email: 'michael@gowaveline.com', phone: '555-456-7890', role: 'Sales Representative', commissionSplit: '30%', processingVolume: '310,000' },
    { id: '4', name: 'Lisa Davis', email: 'lisa@gowaveline.com', phone: '555-789-0123', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '410,000' },
    { id: '5', name: 'Robert Wilson', email: 'robert@gowaveline.com', phone: '555-321-6540', role: 'Account Manager', commissionSplit: '30%', processingVolume: '290,000' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddEdit = (values: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      // Edit existing team member
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id ? { ...member, ...values } : member
        )
      );
      toast.success("Team member updated successfully!");
    } else {
      // Add new team member
      const newMember = {
        id: Date.now().toString(),
        ...values,
      };
      setTeamMembers(prev => [...prev, newMember]);
      toast.success("Team member added successfully!");
    }
    setIsDialogOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    toast.success("Team member removed successfully!");
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
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
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                  <DialogDescription>
                    {editingMember 
                      ? 'Update the details for this team member.' 
                      : 'Fill in the information below to add a new team member.'}
                  </DialogDescription>
                </DialogHeader>
                <TeamMemberForm onSubmit={handleAddEdit} editingMember={editingMember} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <TeamSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          <TeamMembersTable 
            members={filteredMembers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
