
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUploadSection } from './DocumentUploadSection';
import { Button } from '@/components/ui/button';
import { CheckCircle, Save } from 'lucide-react';

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
}

export const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  open,
  onOpenChange,
  application
}) => {
  const [activeTab, setActiveTab] = useState('documents');
  
  console.log('ApplicationDialog rendering with application:', application);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{application?.businessName || 'Merchant Application'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="h-full pb-16">
              {application?.id ? (
                <>
                  <DocumentUploadSection applicationId={application.id} />
                  <div className="text-xs text-muted-foreground mt-2">
                    Application ID: {application.id}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-amber-600 bg-amber-50 rounded-md">
                  <p>No application ID available. Documents will be stored temporarily.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-2 pt-2 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

