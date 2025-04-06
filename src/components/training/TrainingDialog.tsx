
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lesson, ModuleDetail } from '@/components/training';
import { lessonContents } from '@/data/lessonContent';
import { moduleContentMap } from '@/data/moduleContent';

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
        {selectedModule !== null && moduleContentMap[selectedModule] && (
          <ModuleDetail
            module={moduleContentMap[selectedModule]}
            onClose={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDialog;
