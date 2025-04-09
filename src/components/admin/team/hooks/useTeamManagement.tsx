
import { useState } from 'react';
import { toast } from 'sonner';
import { useCrmData } from '@/contexts/CrmDataContext';
import { TeamMember } from '../form';
import { adaptFormTeamMemberToCrmTeamMember } from '../types';

export const useTeamManagement = () => {
  const { teamMembers, setTeamMembers } = useCrmData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [agreements, setAgreements] = useState<any[]>([]);

  // Fetch agreements
  const fetchAgreements = async () => {
    try {
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/agent_agreements', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agreements');
      }
      
      const data = await response.json();
      setAgreements(data);
    } catch (error) {
      console.error("Error fetching agreements:", error);
    }
  };

  // Handle adding or editing a team member
  const handleAddEdit = (values: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      // Edit existing team member
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id ? adaptFormTeamMemberToCrmTeamMember({
            ...values,
            id: editingMember.id
          }) : member
        )
      );
      toast.success("Team member updated successfully!");
    } else {
      // Add new team member
      const newMemberId = Date.now().toString();
      const newMember = adaptFormTeamMemberToCrmTeamMember({
        id: newMemberId,
        ...values,
      });
      
      setTeamMembers(prev => [...prev, newMember]);
      toast.success("Team member added successfully!");
    }
    setIsDialogOpen(false);
    setEditingMember(null);
  };

  // Handle deleting a team member
  const handleDelete = async (id: string) => {
    try {
      // Check if there are any agreements for this team member
      const memberAgreements = agreements.filter(agreement => agreement.agent_id === id);
      
      // Delete agreements if they exist
      for (const agreement of memberAgreements) {
        // Use fetch API instead of SDK to work around type issues
        // Delete from storage
        await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/storage/v1/object/agent_agreements/${agreement.file_path}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
          }
        });
        
        // Delete from database
        await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/agent_agreements?id=eq.${agreement.id}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Remove team member from state
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      toast.success("Team member removed successfully!");
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error("Failed to remove team member");
    }
  };

  // Handle editing a team member
  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  // Handle viewing team member details
  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  // Handle search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isDetailOpen,
    setIsDetailOpen,
    editingMember,
    selectedMember,
    searchQuery,
    agreements,
    fetchAgreements,
    handleAddEdit,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleSearchChange
  };
};
