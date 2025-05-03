
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileUp, Loader2, File, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentUpload } from '../hooks';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface UploadFormProps {
  applicationId: string;
  documentType?: string;
  onUploadSuccess?: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
  applicationId,
  documentType: initialDocType = 'bank_statement',
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(initialDocType);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, uploading, uploadProgress } = useDocumentUpload(applicationId);
  const isMountedRef = useRef(true);
  
  // Set up cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Document type options organized by category
  const documentCategories = {
    banking: [
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'voided_check', label: 'Voided Check' },
    ],
    business: [
      { value: 'business_license', label: 'Business License' },
      { value: 'ein_letter', label: 'EIN Letter' },
      { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
    ],
    processing: [
      { value: 'processing_statement', label: 'Processing Statement' },
    ],
    identity: [
      { value: 'drivers_license', label: 'Driver\'s License' },
      { value: 'passport', label: 'Passport' },
    ],
    other: [
      { value: 'contract', label: 'Contract' },
      { value: 'website_terms', label: 'Website Terms & Conditions' },
      { value: 'privacy_policy', label: 'Privacy Policy' },
      { value: 'other', label: 'Other Document' },
    ]
  };
  
  // Flatten categories for the select dropdown
  const allDocumentTypes = Object.values(documentCategories).flat();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, image, or document file.');
      return;
    }
    
    if (isMountedRef.current) {
      setSelectedFile(file);
    }
  };
  
  const handleDocumentTypeChange = (value: string) => {
    if (isMountedRef.current) {
      setDocumentType(value);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isMountedRef.current) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = () => {
    if (isMountedRef.current) {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isMountedRef.current) {
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    }
  };
  
  const handleRemoveFile = () => {
    if (isMountedRef.current) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          if (isMountedRef.current) {
            toast.success('Document uploaded successfully');
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            if (onUploadSuccess) onUploadSuccess();
          }
        },
        onError: (error) => {
          if (isMountedRef.current) {
            toast.error(`Upload failed: ${error.message}`);
          }
        }
      });
    } catch (error: any) {
      if (error.message !== 'Component unmounted' && isMountedRef.current) {
        toast.error(`Upload error: ${error.message}`);
      }
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Document Type
              </label>
              <Select 
                value={documentType} 
                onValueChange={handleDocumentTypeChange}
              >
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-1 py-1 font-semibold text-xs text-gray-500">BANKING</div>
                  {documentCategories.banking.map(({value, label}) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  
                  <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">BUSINESS</div>
                  {documentCategories.business.map(({value, label}) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  
                  <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">PROCESSING</div>
                  {documentCategories.processing.map(({value, label}) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  
                  <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">IDENTITY</div>
                  {documentCategories.identity.map(({value, label}) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  
                  <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">OTHER</div>
                  {documentCategories.other.map(({value, label}) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              
              {!selectedFile ? (
                <div 
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <Upload className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-blue-600 font-medium mb-1">Drag & drop or click to upload</p>
                  <p className="text-gray-500 text-sm text-center">
                    Supported formats: PDF, JPEG, PNG, DOC up to 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium truncate max-w-[200px] md:max-w-[400px] text-blue-700">{selectedFile.name}</p>
                      <p className="text-sm text-blue-500/80">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={uploading}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {selectedFile && (
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
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          )}
          
          {uploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-right text-gray-500">{Math.round(uploadProgress)}%</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
