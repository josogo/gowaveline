
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { TeamMember } from './TeamMemberForm';
import { useAuthToken } from './hooks/useAuthToken';
import { DateSelectionFields } from './components/DateSelectionFields';
import { AgreementTypeSelect } from './components/AgreementTypeSelect';
import { UploadSection } from './components/UploadSection';

interface AgreementUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMember: TeamMember;
}

const AgreementUploadModal: React.FC<AgreementUploadModalProps> = ({
  isOpen,
  onClose,
  teamMember
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [agreementType, setAgreementType] = useState<string>('Agent Agreement');
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const authToken = useAuthToken();

  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !agreementType) {
      toast.error("Please select a file and agreement type");
      return;
    }
    
    if (!authToken) {
      toast.error("You must be logged in to upload documents. Please log in and try again.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', agreementType);
      formData.append('entityId', teamMember.id);
      formData.append('entityType', 'agent');
      formData.append('userName', 'Admin');
      
      if (effectiveDate) {
        formData.append('effectiveDate', format(effectiveDate, 'yyyy-MM-dd'));
      }
      
      if (expirationDate) {
        formData.append('expirationDate', format(expirationDate, 'yyyy-MM-dd'));
      }
      
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }
      
      toast.success(`Agreement uploaded successfully for ${teamMember.name}`);
      onClose();
    } catch (error) {
      console.error("Error uploading agreement:", error);
      toast.error("Failed to upload agreement: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Agreement for {teamMember.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AgreementTypeSelect value={agreementType} onChange={setAgreementType} />
          
          <DateSelectionFields
            effectiveDate={effectiveDate}
            expirationDate={expirationDate}
            onEffectiveDateChange={setEffectiveDate}
            onExpirationDateChange={setExpirationDate}
          />
          
          <UploadSection onFileChange={handleFileChange} />
          
          {!authToken && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-700 text-sm">
              You need to be logged in to upload agreements. If you are logged in and still see this message, 
              please refresh the page or try logging in again.
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !file || !authToken}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : "Upload Agreement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementUploadModal;
