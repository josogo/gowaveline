
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationProgress } from "./ApplicationProgress";
import { format } from "date-fns";

interface ApplicationHeaderProps {
  onClose?: () => void;
  progress: number;
  isSaving: boolean;
  lastEdited?: string;
  applicationNumber?: string;
  lastSavedAt?: Date | null;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ 
  onClose, 
  progress, 
  isSaving,
  lastEdited,
  applicationNumber,
  lastSavedAt
}) => {
  // Validate dates before formatting
  const validLastEdited = lastEdited && !isNaN(new Date(lastEdited).getTime()) 
    ? new Date(lastEdited) 
    : null;
    
  const formattedDate = validLastEdited 
    ? format(validLastEdited, 'MMM d, yyyy h:mm a') 
    : 'Not available';
    
  const formattedSavedAt = lastSavedAt && !isNaN(lastSavedAt.getTime()) 
    ? format(lastSavedAt, 'h:mm:ss a') 
    : '';
  
  return (
    <div className="relative mb-6">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Merchant Application</h1>
          {applicationNumber && (
            <p className="text-sm text-gray-500">Application #{applicationNumber}</p>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Last edited: {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs ${isSaving ? 'text-amber-600' : 'text-teal-600'}`}>
              {isSaving ? 'Saving...' : lastSavedAt ? `Saved at ${formattedSavedAt}` : 'All changes saved'}
            </span>
            <span className={`h-2 w-2 rounded-full ${isSaving ? 'bg-amber-500' : 'bg-teal-500'}`}></span>
          </div>
        </div>
      </div>
      
      <ApplicationProgress progress={progress} />
    </div>
  );
};
