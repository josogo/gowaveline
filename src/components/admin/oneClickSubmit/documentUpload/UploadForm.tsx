
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentUpload } from '../hooks';
import { toast } from 'sonner';

interface UploadFormProps {
  applicationId: string;
  documentType: string;
  onUploadSuccess?: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
  applicationId,
  documentType: initialDocType,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(initialDocType);
  const { uploadDocument, uploading, uploadProgress } = useDocumentUpload(applicationId);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }
      
      setSelectedFile(file);
    }
  };
  
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!applicationId) {
      toast.error('No application ID available');
      return;
    }
    
    try {
      await uploadDocument({
        file: selectedFile,
        applicationId,
        documentType,
        onSuccess: () => {
          toast.success('Document uploaded successfully');
          setSelectedFile(null);
          if (onUploadSuccess) onUploadSuccess();
        },
        onError: (error) => {
          toast.error(`Upload failed: ${error.message}`);
        }
      });
    } catch (error: any) {
      toast.error(`Upload error: ${error.message}`);
    }
  };
  
  // Document type options based on category
  const documentTypeOptions = {
    bank_statement: 'Bank Statement',
    processing_statement: 'Processing Statement', 
    business_license: 'Business License',
    voided_check: 'Voided Check',
    ein_letter: 'EIN Letter',
    articles_of_incorporation: 'Articles of Incorporation',
    website_terms: 'Website Terms & Conditions',
    privacy_policy: 'Privacy Policy',
    identity_document: 'Identity Document',
    other: 'Other Document'
  } as const;

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upload Document</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <div>
              <Select 
                value={documentType} 
                onValueChange={handleDocumentTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypeOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-1">
              <input
                type="file"
                id="documentFile"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="documentFile">
                <div className={`flex items-center justify-center w-full h-10 border-2 border-dashed rounded-md ${selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} cursor-pointer transition-colors`}>
                  <div className="flex items-center">
                    <Upload className={`h-4 w-4 ${selectedFile ? 'text-blue-500' : 'text-gray-500'} mr-2`} />
                    <span className={`text-sm ${selectedFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {selectedFile ? selectedFile.name : 'Choose file...'}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!selectedFile || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
          
          {uploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
