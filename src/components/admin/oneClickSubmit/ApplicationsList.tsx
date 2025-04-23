
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationDialog } from './ApplicationDialog';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';

export const ApplicationsList: React.FC = () => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const {
    loading,
    filteredApplications,
    applications,
    handleFilterChange,
  } = useApplications();

  const handleOpenApplication = (app: any) => {
    setSelectedApplication(app);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <ApplicationFilters onFilterChange={handleFilterChange} />
      <ApplicationsGrid
        filteredApplications={filteredApplications}
        loading={loading}
        applications={applications}
        onOpenApplication={handleOpenApplication}
      />
      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selectedApplication?.rawData || selectedApplication}
      />
    </div>
  );
};

export default ApplicationsList;
