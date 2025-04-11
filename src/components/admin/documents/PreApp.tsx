
import React from 'react';
import { PreAppGenerationDialog } from './PreAppGenerationDialog/PreAppGenerationDialog';

interface PreAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PreAppModal: React.FC<PreAppModalProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  return (
    <PreAppGenerationDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
};
