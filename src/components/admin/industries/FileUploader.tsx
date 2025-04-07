
import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Upload, 
  File,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industryId: string;
  fileType: 'template' | 'supporting' | 'logo';
  onSuccess: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  open, 
  onOpenChange, 
  industryId, 
  fileType,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const getTypeTitle = () => {
    switch (fileType) {
      case 'template': return 'Application Template';
      case 'logo': return 'Company Logo';
      case 'supporting': return 'Supporting Document';
      default: return 'Document';
    }
  };

  const getAcceptedFiles = () => {
    switch (fileType) {
      case 'template': return '.pdf';
      case 'logo': return '.jpg,.jpeg,.png';
      case 'supporting': return '.pdf,.doc,.docx,.jpg,.jpeg,.png';
      default: return undefined;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateFile = () => {
    if (!selectedFile) return false;
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'template' && fileExtension !== 'pdf') {
      toast.error('Template must be a PDF file');
      return false;
    }
    
    if (fileType === 'logo' && !['jpg', 'jpeg', 'png'].includes(fileExtension as string)) {
      toast.error('Logo must be a JPG or PNG file');
      return false;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return false;
    }
    
    return true;
  };

  const handleUpload = async () => {
    if (!validateFile() || !selectedFile) return;
    
    setUploading(true);
    try {
      // Check if we need to replace an existing file
      if (fileType === 'template' || fileType === 'logo') {
        // Check if file of this type already exists
        const { data: existingDocs } = await supabase
          .from('industry_documents')
          .select('*')
          .eq('industry_id', industryId)
          .eq('file_type', fileType);
          
        // If exists, delete old files first
        if (existingDocs && existingDocs.length > 0) {
          for (const doc of existingDocs) {
            await supabase.storage
              .from('industry-files')
              .remove([doc.file_path]);
              
            await supabase
              .from('industry_documents')
              .delete()
              .eq('id', doc.id);
          }
        }
      }
      
      // Generate file path
      const timestamp = new Date().getTime();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${timestamp}_${selectedFile.name}`;
      const filePath = `${industryId}/${fileType}/${fileName}`;
      
      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('industry-files')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (storageError) throw storageError;
      
      // Save metadata to database
      const { error: dbError } = await supabase
        .from('industry_documents')
        .insert([
          {
            industry_id: industryId,
            file_name: selectedFile.name,
            file_type: fileType,
            file_path: filePath,
            uploaded_by: adminUser?.id || null
          }
        ]);
        
      if (dbError) throw dbError;
      
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {getTypeTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center 
            ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <>
                <FileText className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-blue-700">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to select or drop your file here</p>
                <p className="text-sm text-gray-500 mt-1">
                  {fileType === 'template' && 'PDF file required'}
                  {fileType === 'logo' && 'JPG or PNG file required'}
                  {fileType === 'supporting' && 'PDF, DOC, or image files accepted'}
                </p>
              </>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={getAcceptedFiles()}
            />
          </div>
          
          {fileType === 'template' && (
            <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-2" />
              <p className="text-sm text-amber-800">
                For best results, use a fillable PDF form with standard field names like 
                "BusinessName", "Address", "Email", etc.
              </p>
            </div>
          )}
          
          {fileType === 'logo' && (
            <div className="flex p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <File className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
              <p className="text-sm text-blue-800">
                Logo will be placed in the top-right corner of generated PDF documents.
                For best results, use a transparent PNG with square dimensions.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload {getTypeTitle()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
