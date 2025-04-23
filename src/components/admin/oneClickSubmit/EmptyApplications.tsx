
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyApplicationsProps {
  applicationsCount: number;
}

export const EmptyApplications: React.FC<EmptyApplicationsProps> = ({ applicationsCount }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
    <FileText className="h-12 w-12 text-gray-400 mb-3" />
    <h3 className="text-lg font-medium">No applications found</h3>
    <p className="text-gray-500 mb-4">
      {applicationsCount > 0
        ? 'Try changing your filters to see more results'
        : 'Start by creating a new application'}
    </p>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Create New Application
    </Button>
  </div>
);
