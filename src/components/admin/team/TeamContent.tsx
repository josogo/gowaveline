
import React, { useEffect } from 'react';
import TeamSearch from './TeamSearch';
import TeamMembersTable from './TeamMembersTable';
import TeamMemberDetail from './TeamMemberDetail';
import { TeamMember } from './form';
import { adaptCrmTeamMemberToFormTeamMember } from './types';
import { useCrmData } from '@/contexts/CrmDataContext';

interface TeamContentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onViewDetails: (member: TeamMember) => void;
  selectedMember: TeamMember | null;
  isDetailOpen: boolean;
  onDetailClose: () => void;
}

const TeamContent: React.FC<TeamContentProps> = ({
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  onViewDetails,
  selectedMember,
  isDetailOpen,
  onDetailClose
}) => {
  const { teamMembers } = useCrmData();

  // Convert CRM team members to the form team member type
  const adaptedTeamMembers = teamMembers.map(adaptCrmTeamMemberToFormTeamMember);

  // Filter members based on search query
  const filteredMembers = adaptedTeamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TeamSearch 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange} 
      />
      
      <TeamMembersTable 
        members={filteredMembers}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetails={onViewDetails}
      />

      {selectedMember && (
        <TeamMemberDetail
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          member={selectedMember}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default TeamContent;
