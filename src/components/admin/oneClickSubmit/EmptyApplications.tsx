
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface EmptyApplicationsProps {
  applicationsCount: number;
}

export const EmptyApplications: React.FC<EmptyApplicationsProps> = ({ applicationsCount }) => (
  <LazyMotion features={domAnimation}>
    <m.div 
      className="col-span-full flex flex-col items-center justify-center py-8 md:py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FileText className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium">No applications found</h3>
      <p className="text-gray-500 mb-4 max-w-md px-4">
        {applicationsCount > 0
          ? 'Try changing your filters to see more results'
          : 'Start by creating a new application'}
      </p>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create New Application
      </Button>
    </m.div>
  </LazyMotion>
);

export default EmptyApplications;
