
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationProgressBar } from '../ApplicationProgressBar';

interface ApplicationHeaderProps {
  onClose?: () => void;
  progress: number;
}

export const ApplicationHeader = ({ onClose, progress }: ApplicationHeaderProps) => {
  return (
    <div className="space-y-4 sticky top-0 bg-white z-30 pb-4 border-b">
      {onClose && (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <ApplicationProgressBar progress={progress} />
    </div>
  );
};
