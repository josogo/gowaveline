
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Banknote, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCrmData } from '@/contexts/CrmDataContext';
import type { TeamMember } from '../form';

interface DealsTabProps {
  member: TeamMember;
  onClose: () => void;
}

const DealsTab: React.FC<DealsTabProps> = ({ member, onClose }) => {
  const navigate = useNavigate();
  const { deals } = useCrmData();
  
  // Filter deals assigned to this team member
  const memberDeals = deals.filter(deal => deal.assignedTo === member.id);
  
  const handleViewDeal = (dealId: string) => {
    navigate(`/admin/deals?dealId=${dealId}`);
    onClose();
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Banknote className="h-5 w-5 text-orange-500" />
        Assigned Deals
      </h3>
      
      {memberDeals.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-muted-foreground">No deals assigned to this team member yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memberDeals.map(deal => (
            <Card key={deal.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{deal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact: {deal.contactName} • Revenue: ${deal.value}
                  </p>
                  {deal.processingVolume && (
                    <p className="text-sm text-muted-foreground">
                      Monthly Processing: ${deal.processingVolume}
                    </p>
                  )}
                </div>
                <Badge className={`${
                  deal.status === 'closed' ? 'bg-green-100 text-green-800' :
                  deal.status === 'lost' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {deal.status}
                </Badge>
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDeal(deal.id)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealsTab;
