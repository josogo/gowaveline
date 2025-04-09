
import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import TeamHeader from './team/TeamHeader';
import TeamContent from './team/TeamContent';
import { useTeamManagement } from './team/hooks/useTeamManagement';

const TeamManagement = () => {
  const {
    isDialogOpen,
    setIsDialogOpen,
    isDetailOpen,
    setIsDetailOpen,
    editingMember,
    selectedMember,
    searchQuery,
    fetchAgreements,
    handleAddEdit,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleSearchChange
  } = useTeamManagement();

  // Fetch agreements on component mount
  useEffect(() => {
    fetchAgreements();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <TeamHeader 
            isDialogOpen={isDialogOpen} 
            setIsDialogOpen={setIsDialogOpen}
            editingMember={editingMember}
            onSubmit={handleAddEdit}
          />
        </CardHeader>
        <CardContent>
          <TeamContent 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            selectedMember={selectedMember}
            isDetailOpen={isDetailOpen}
            onDetailClose={() => setIsDetailOpen(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
