
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { PreAppGenerationDialog } from '../PreAppGenerationDialog';

interface PreAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PreAppModal: React.FC<PreAppModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  
  const handleOpenGenerationDialog = () => {
    setShowGenerationDialog(true);
    onOpenChange(false);
  };
  
  const handleGenerationSuccess = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              WaveLine Merchant Application
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-gray-600">
              Generate a pre-application form for merchants based on their business details.
            </p>
            
            <Button 
              className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
              onClick={handleOpenGenerationDialog}
            >
              Create New Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <PreAppGenerationDialog 
        open={showGenerationDialog} 
        onOpenChange={setShowGenerationDialog}
        onSuccess={handleGenerationSuccess}
      />
    </>
  );
};

export default PreAppModal;
