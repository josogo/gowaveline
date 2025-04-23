
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

interface ApplicationStatusProps {
  status: string;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ status }) => {
  switch (status) {
    case 'complete':
      return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Complete</Badge>;
    case 'submitted':
      return <Badge className="bg-blue-500">Submitted</Badge>;
    case 'declined':
      return <Badge className="bg-amber-500">Declined</Badge>;
    case 'removed':
      return <Badge className="bg-red-500">Removed</Badge>;
    default:
      return <Badge className="bg-amber-500"><Clock className="mr-1 h-3 w-3" /> Incomplete</Badge>;
  }
};
