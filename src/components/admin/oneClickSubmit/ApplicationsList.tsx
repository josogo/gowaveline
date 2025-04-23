
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationDialog } from './ApplicationDialog';
import { useApplications } from './hooks/useApplications';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplications.map(app => (
          <ApplicationCard
            key={app.id}
            application={app}
            onClick={() => handleOpenApplication(app)}
          />
        ))}

        {filteredApplications.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-gray-500 mb-4">
              {applications.length > 0
                ? 'Try changing your filters to see more results'
                : 'Start by creating a new application'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Application
            </Button>
          </div>
        )}
      </div>

      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selectedApplication?.rawData || selectedApplication}
      />
    </div>
  );
};

export default ApplicationsList;
