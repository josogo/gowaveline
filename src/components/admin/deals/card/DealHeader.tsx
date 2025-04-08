
import React from 'react';
import { Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Deal } from '@/contexts/CrmDataContext';

interface DealHeaderProps {
  deal: Deal;
  getStatusBadgeColor: (status: string) => string;
}

const DealHeader: React.FC<DealHeaderProps> = ({ deal, getStatusBadgeColor }) => {
  return (
    <div className="sticky top-0 bg-white z-10 border-b p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{deal.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created on {new Date(deal.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Badge 
          variant="outline" 
          className={`${getStatusBadgeColor(deal.status)} px-3 py-1 text-sm font-medium flex items-center`}
        >
          {deal.status === 'pending' && <span className="h-3.5 w-3.5 mr-1.5">⏳</span>}
          {deal.status === 'closed' && <span className="h-3.5 w-3.5 mr-1.5">✅</span>}
          {deal.status === 'lost' && <X className="h-3.5 w-3.5 mr-1.5" />}
          {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
        </Badge>
      </div>
    </div>
  );
};

export default DealHeader;
