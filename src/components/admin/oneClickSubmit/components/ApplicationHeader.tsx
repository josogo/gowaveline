
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationProgress } from './ApplicationProgress';

interface ApplicationHeaderProps {
  onClose?: () => void;
  progress: number;
  isSaving?: boolean;
  lastEdited?: string;
}

export const ApplicationHeader = ({ onClose, progress, isSaving, lastEdited }: ApplicationHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-blue-700">
          Merchant Application
        </h1>
        
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-sm text-gray-500 italic animate-pulse">
              Saving...
            </span>
          )}
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <ApplicationProgress progress={progress} lastEdited={lastEdited} />
    </div>
  );
};
