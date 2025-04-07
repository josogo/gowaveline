
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TrainingHubHeaderProps {
  title: string;
  subtitle: string;
}

const TrainingHubHeader: React.FC<TrainingHubHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-orange-500">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <Badge variant="outline" className="bg-[#0EA5E9]/10 text-[#0EA5E9] px-3 py-1">
        Admin Access
      </Badge>
    </div>
  );
};

export default TrainingHubHeader;
