
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lesson, ModuleDetail } from '@/components/training';
import { lessonContents } from '@/data';
import { getModuleContent } from '@/data/moduleContent';

interface TrainingDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedLesson: number | null;
  selectedModule: number | null;
}

const TrainingDialog: React.FC<TrainingDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedLesson,
  selectedModule
}) => {
  // Get module content if a module is selected
  const moduleContent = selectedModule !== null ? getModuleContent(selectedModule) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedLesson !== null ? "Lesson" : "Training Module"}
          </DialogTitle>
        </DialogHeader>
        {selectedLesson !== null && (
          <Lesson 
            lesson={lessonContents[selectedLesson]} 
            onClose={() => setIsOpen(false)} 
          />
        )}
        {selectedModule !== null && moduleContent && (
          <ModuleDetail
            module={moduleContent}
            onClose={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDialog;
