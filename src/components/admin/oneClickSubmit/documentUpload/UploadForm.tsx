
import React, { useState, useRef, useEffect } from 'react';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileCheck, FileX, Upload, Loader2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface UploadFormProps {
  applicationId: string;
  documentType: string;
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
  applicationId, 
  documentType 
}) => {
  const { 
    uploading, 
    uploadProgress, 
    uploadError,
    uploadDocument, 
    resetUploadState
  } = useDocumentUpload(applicationId);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset selected file state when upload completes or errors
  useEffect(() => {
    if (!uploading && uploadProgress === 0) {
      console.log("Upload completed or reset, clearing selected file");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploading, uploadProgress]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      console.log('File selected:', file.name, file.size);
    } else {
      setSelectedFile(null);
      console.log('File selection cleared or canceled');
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    console.log(`Starting upload for file ${selectedFile.name} in category ${documentType}`);
    
    try {
      await uploadDocument({
        file: selectedFile,
        applicationId,
        documentType,
        onSuccess: () => {
          console.log("Upload success callback triggered");
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onError: (error) => {
          console.error("Upload error callback triggered:", error);
          // Reset file input on error
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      });
    } catch (err) {
      console.error("Error during upload submission:", err);
      // Ensure we reset even if there's an exception
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleCancelUpload = () => {
    console.log("Upload canceled by user");
    resetUploadState();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Determine if upload is in error state
  const isUploadError = uploadError !== null;
  
  return (
    <form onSubmit={handleUpload}>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          uploading ? 'bg-blue-50/50 opacity-75 cursor-not-allowed' : 
          selectedFile ? 'bg-blue-50 border-blue-300' : 'bg-white hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          id={`documentFile-${documentType}`}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          disabled={uploading}
        />
        <label 
          htmlFor={`documentFile-${documentType}`} 
          className={`block ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center justify-center">
            {selectedFile ? (
              <>
                <FileCheck className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-lg font-semibold text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - Click to change file
                </p>
              </>
            ) : (
              <>
                <FileCheck className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-lg font-semibold text-gray-800">
                  Click to select a file
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, images and document files (max 10MB)
                </p>
              </>
            )}
          </div>
        </label>
      </div>
      
      {/* Error state */}
      {isUploadError && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 mt-4">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 mt-1 mr-2" />
            <div className="flex-1">
              <AlertDescription>
                {uploadError?.message || 'An error occurred during upload'}
              </AlertDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-600" 
              onClick={() => resetUploadState()}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Progress bar for upload */}
      {uploading && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Uploading {selectedFile?.name}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress 
            value={uploadProgress} 
            className="h-2"
          />
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        {uploading && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelUpload}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <FileX className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          disabled={uploading || !selectedFile}
          className={`${
            selectedFile 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? 'Upload Document' : 'Select & Upload'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
