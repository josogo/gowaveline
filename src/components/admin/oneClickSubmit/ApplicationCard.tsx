
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, FileText, MoreVertical, Key } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApplicationListItem } from './hooks/useApplications';
import { toast } from 'sonner';

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
  const [showOTP, setShowOTP] = useState(false);

  // Get business name either directly or from application_data
  const getBusinessName = () => {
    if (application.businessName) {
      return application.businessName;
    }
    
    // Try to get from raw data
    if (application.rawData) {
      if (application.rawData.merchant_name) {
        return application.rawData.merchant_name;
      }
      
      // Try to get from application data
      if (application.rawData.application_data?.business?.businessName) {
        return application.rawData.application_data.business.businessName;
      }
    }
    
    return "Unnamed Business";
  };

  const getStatusBadge = () => {
    switch (application.status) {
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

  const handleCopyOTP = () => {
    if (application.rawData?.otp) {
      navigator.clipboard.writeText(application.rawData.otp);
      toast.success('OTP copied to clipboard');
    }
  };

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

        {/* OTP Section */}
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 flex items-center">
            <Key className="h-3 w-3 mr-1" />
            {showOTP ? (
              <span className="font-mono bg-gray-100 px-1 rounded">
                {application.rawData?.otp || 'N/A'}
              </span>
            ) : (
              <span>OTP: ******</span>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setShowOTP(!showOTP);
              }}
            >
              {showOTP ? 'Hide' : 'Show'} OTP
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleCopyOTP();
              }}
            >
              Copy OTP
            </Button>
          </div>
        </div>

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
      </div>
    </Card>
  );
};
