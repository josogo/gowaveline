
import React from 'react';
import { Card } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApplicationListItem } from './hooks/useApplications';
import { ApplicationStatus } from './components/ApplicationStatus';
import { ApplicationProgress } from './components/ApplicationProgress';
import { ApplicationOTP } from './components/ApplicationOTP';
import { useBusinessName } from './hooks/useBusinessName';

interface ApplicationCardProps {
  application: ApplicationListItem;
  onClick: () => void;
  onDecline?: (app: any) => void;
  onRemove?: (app: any) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onClick, 
  onDecline, 
  onRemove 
}) => {
  const getBusinessName = useBusinessName(application.businessName, application.rawData);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="p-4 hover:shadow-md cursor-pointer transition-all border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{getBusinessName()}</h3>
        <ApplicationStatus status={application.status} />
      </div>
      
      <ApplicationProgress 
        progress={application.progress} 
        lastEdited={application.lastEdited} 
      />

      <ApplicationOTP otp={application.rawData?.otp} />

      {/* Action menu */}
      {(onDecline || onRemove) && (
        <div className="mt-3 flex justify-end" onClick={handleActionClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onDecline && (
                <DropdownMenuItem 
                  className="text-amber-600"
                  onClick={() => onDecline(application)}
                >
                  Decline Application
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onRemove(application)}
                >
                  Remove Application
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  );
};
