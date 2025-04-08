
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DealCardFooterProps {
  onClose: () => void;
}

const DealCardFooter: React.FC<DealCardFooterProps> = ({ onClose }) => {
  return (
    <div className="flex justify-end p-4 border-t">
      <Button 
        variant="ghost" 
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4 mr-1" />
        Close
      </Button>
    </div>
  );
};

export default DealCardFooter;
