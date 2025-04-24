
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import FileUpload from '@/components/file-upload';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { TeamMember } from './TeamMemberForm';

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
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for authorization token when the component mounts
    const checkAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthToken(session?.access_token || null);
      } catch (error) {
        console.error("Error retrieving auth session:", error);
      }
    };
    
    checkAuthSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthToken(session?.access_token || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    
    // Check if we have auth token
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
      
      // Include the token in the Authorization header
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
          <div className="space-y-2">
            <Label htmlFor="agreementType">Agreement Type</Label>
            <Select 
              value={agreementType} 
              onValueChange={setAgreementType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agreement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agent Agreement">Agent Agreement</SelectItem>
                <SelectItem value="Non-Disclosure Agreement">Non-Disclosure Agreement</SelectItem>
                <SelectItem value="Non-Compete Agreement">Non-Compete Agreement</SelectItem>
                <SelectItem value="Commission Agreement">Commission Agreement</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={effectiveDate}
                    onSelect={setEffectiveDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Expiration Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Upload Document</Label>
            <FileUpload
              accept=".pdf,.doc,.docx"
              maxFiles={1}
              maxSize={5 * 1024 * 1024} // 5MB
              onFilesChange={handleFileChange}
            />
          </div>
          
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
