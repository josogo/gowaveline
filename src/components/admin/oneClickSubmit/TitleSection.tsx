
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TitleSectionProps {
  onOpenNewApp?: () => void;
}

export const TitleSection: React.FC<TitleSectionProps> = ({ onOpenNewApp }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">One Click Submit</h1>
        <p className="text-muted-foreground mt-1">
          Smart merchant application management
        </p>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-blue-500 to-blue-600"
        onClick={onOpenNewApp}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Application
      </Button>
    </div>
  );
};

export default TitleSection;
