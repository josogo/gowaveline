
import React, { useState, Suspense, lazy } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApplicationFilters } from './ApplicationFilters';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';

// Lazy load the dialog component to reduce initial bundle size
const ApplicationDialog = lazy(() => import('./ApplicationDialog')
  .then(module => ({ default: module.ApplicationDialog })));

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
      <Suspense fallback={<div className="p-4 text-center">Loading details...</div>}>
        {dialogOpen && (
          <ApplicationDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            application={selectedApplication?.rawData || selectedApplication}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ApplicationsList;
