
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Banknote, Calendar, ChevronDown, ChevronUp, User, Users } from 'lucide-react';
import { Deal } from '@/contexts/CrmDataContext';

interface DealInfoProps {
  deal: Deal;
  getTeamMemberName: (id: string) => string;
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
}

const DealInfo: React.FC<DealInfoProps> = ({ 
  deal, 
  getTeamMemberName,
  expandedSection,
  onToggleSection
}) => {
  const createdDistance = formatDistance(
    new Date(deal.createdAt), 
    new Date(),
    { addSuffix: true }
  );
  
  return (
    <Card className="shadow-sm border-teal-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-teal-500" />
            Deal Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          <li className="py-2 flex items-center justify-between">
            <span className="text-muted-foreground">Created</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{createdDistance}</span>
            </div>
          </li>
          
          <li className="py-2 flex items-center justify-between">
            <span className="text-muted-foreground">Revenue</span>
            <div className="flex items-center gap-1">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">${deal.value}</span>
            </div>
          </li>
          
          {deal.processingVolume && (
            <li className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Processing</span>
              <div className="flex items-center gap-1">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">${deal.processingVolume}</span>
              </div>
            </li>
          )}
          
          <li className="py-2 flex items-center justify-between">
            <span className="text-muted-foreground">Contact Name</span>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{deal.contactName}</span>
            </div>
          </li>

          <li className="py-2 flex items-center justify-between">
            <span className="text-muted-foreground">Assigned To</span>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{getTeamMemberName(deal.assignedTo)}</span>
            </div>
          </li>
        </ul>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground"
          onClick={() => onToggleSection('details')}
        >
          {expandedSection === 'details' ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
        
        {expandedSection === 'details' && (
          <div className="mt-2 pt-2 border-t">
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Deal ID</span>
                <span className="text-xs text-muted-foreground font-mono">{deal.id}</span>
              </li>
              {/* Add more details here as needed */}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealInfo;
