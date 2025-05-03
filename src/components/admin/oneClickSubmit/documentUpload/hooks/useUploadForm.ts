
import { useState, useRef, useEffect } from 'react';
import { useDocumentUpload } from '../../hooks';
import { toast } from 'sonner';

interface UseUploadFormProps {
  applicationId: string;
  documentType?: string;
  onUploadSuccess?: () => void;
}

export const useUploadForm = ({
  applicationId,
  documentType: initialDocType = 'bank_statement',
  onUploadSuccess
}: UseUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(initialDocType);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, uploading, uploadProgress } = useDocumentUpload(applicationId);
  const isMountedRef = useRef(true);
  
  console.log("useUploadForm hook initialized with applicationId:", applicationId);
  
  // Set up cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const validateAndSetFile = (file: File) => {
    console.log("Validating file:", file.name);
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
      console.log("File validated and set:", file.name);
      setSelectedFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change detected");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
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
    console.log("Triggering file input click");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    
    console.log("Starting upload for file:", selectedFile.name, "applicationId:", applicationId);
    
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
        },
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      });
    } catch (error: any) {
      if (error.message !== 'Component unmounted' && isMountedRef.current) {
        toast.error(`Upload error: ${error.message}`);
      }
    }
  };

  return {
    selectedFile,
    documentType,
    isDragging,
    fileInputRef,
    uploading,
    uploadProgress,
    handleFileChange,
    handleDocumentTypeChange,
    handleDragOver,
    handleDragLeave, 
    handleDrop,
    handleRemoveFile,
    triggerFileInput,
    handleSubmit
  };
};
