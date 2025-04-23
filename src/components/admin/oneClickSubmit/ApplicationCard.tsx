
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationCardProps {
  application: {
    id: string;
    businessName: string;
    status: 'incomplete' | 'complete' | 'submitted';
    lastEdited: string;
    progress: number;
  };
  onClick: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onClick }) => {
  const getStatusBadge = () => {
    switch (application.status) {
      case 'complete':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Complete</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500">Submitted</Badge>;
      default:
        return <Badge className="bg-amber-500"><Clock className="mr-1 h-3 w-3" /> Incomplete</Badge>;
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md cursor-pointer transition-all border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{application.businessName}</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="h-3 w-3 mr-1" />
          Last edited {formatDistanceToNow(new Date(application.lastEdited))} ago
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span>Progress</span>
            <span>{application.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${application.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
