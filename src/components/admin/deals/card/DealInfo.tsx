
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, User, BadgePercent, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
            Deal Information
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onToggleSection('details')}
          >
            {expandedSection === 'details' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent className={expandedSection !== null && expandedSection !== 'details' ? 'hidden' : ''}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Value:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="font-semibold text-lg flex items-center text-green-700">
                    <DollarSign className="h-4 w-4" />
                    {deal.value.toLocaleString()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-sm">Deal value: ${deal.value.toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Primary Contact:</span>
            <div className="font-medium">{deal.contactName}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Assigned To:</span>
            <div className="font-medium flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5 opacity-70" />
              {getTeamMemberName(deal.assignedTo)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expected Commission:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="font-medium flex items-center text-orange-700">
                    <BadgePercent className="h-3.5 w-3.5 mr-1.5" />
                    ${(deal.value * 0.35).toLocaleString()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-sm">35% of deal value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealInfo;
