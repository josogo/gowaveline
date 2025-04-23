
import React from 'react';
import { ApplicationCard } from './ApplicationCard';
import { EmptyApplications } from './EmptyApplications';

interface ApplicationsGridProps {
  filteredApplications: any[];
  loading: boolean;
  applications: any[];
  onOpenApplication: (app: any) => void;
}

export const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({
  filteredApplications,
  loading,
  applications,
  onOpenApplication,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredApplications.map(app => (
        <ApplicationCard
          key={app.id}
          application={app}
          onClick={() => onOpenApplication(app)}
        />
      ))}
      {filteredApplications.length === 0 && !loading && (
        <EmptyApplications applicationsCount={applications.length} />
      )}
    </div>
  );
};
