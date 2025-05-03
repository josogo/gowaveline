
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUploadSection } from './documentUpload';
import { Button } from '@/components/ui/button';
import { CheckCircle, Save, X } from 'lucide-react';

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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 border-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-blue-800">
              {application?.businessName || 'Merchant Application'} - Document Management
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="h-full pb-16">
              {application?.id ? (
                <>
                  <DocumentUploadSection applicationId={application.id} />
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">Application ID: {application.id}</span>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-amber-600 bg-amber-50 rounded-md border border-amber-200">
                  <p>No application ID available. Documents will be stored temporarily.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-auto pt-4 pb-4 px-6 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
