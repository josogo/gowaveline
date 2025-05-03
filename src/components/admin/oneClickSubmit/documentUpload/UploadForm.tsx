
import React, { useState, useRef, useEffect } from 'react';
import { useDocumentUpload } from '../hooks';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileCheck, FileX, Upload, Loader2, AlertCircle, X, File, Image as ImageIcon, FileText } from 'lucide-react';
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
    resetUploadState,
    loadDocuments
  } = useDocumentUpload(applicationId);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef<boolean>(true);
  
  // Track component mounted state for async operations
  useEffect(() => {
    mountedRef.current = true;
    console.log(`UploadForm mounted for document type: ${documentType}, applicationId: ${applicationId}`);
    return () => {
      mountedRef.current = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [documentType, applicationId, previewUrl]);
  
  // Reset selected file state when upload completes or errors
  useEffect(() => {
    if (!uploading && uploadProgress === 0) {
      if (mountedRef.current) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    }
  }, [uploading, uploadProgress, previewUrl]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    console.log("Processing file:", file.name);
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upload button clicked");
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!applicationId) {
      toast.error('Application ID is required for uploading documents');
      return;
    }
    
    console.log(`Starting upload for ${selectedFile.name} of type ${documentType}`);
    
    try {
      // Store file in local variable to ensure it doesn't change during async operations
      const fileToUpload = selectedFile;
      
      await uploadDocument({
        file: fileToUpload,
        applicationId,
        documentType,
        onSuccess: () => {
          if (!mountedRef.current) return;
          
          console.log("Upload successful, resetting form");
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          // Clear preview
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          // Reload documents to refresh the list
          loadDocuments().catch(error => {
            console.error("Error reloading documents after upload:", error);
          });
          toast.success(`Document ${fileToUpload.name} uploaded successfully`);
        },
        onError: (error) => {
          if (!mountedRef.current) return;
          
          console.error("Upload failed:", error);
          toast.error(`Upload failed: ${error.message || "Unknown error"}`);
          // Reset file input on error
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onProgress: (progress) => {
          // This will be handled by the hook
        }
      });
    } catch (err: any) {
      console.error("Exception during upload:", err);
      if (!mountedRef.current) return;
      
      toast.error(`Upload error: ${err?.message || "Unknown error"}`);
      // Ensure we reset even if there's an exception
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };
  
  const handleCancelUpload = () => {
    console.log("Upload cancelled");
    resetUploadState();
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Determine if upload is in error state
  const isUploadError = uploadError !== null;

  // Generate file size text
  const getFileSizeText = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-12 w-12 text-blue-400 mb-2" />;
    
    if (selectedFile.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    } else if (selectedFile.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-blue-500" />;
    }
  };
  
  return (
    <form onSubmit={handleUpload}>
      {!selectedFile ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all
            ${isDragging ? 'border-blue-400 bg-blue-50' : 'hover:border-blue-300 hover:bg-blue-50/30'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
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
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-blue-400 mb-2" />
            <p className="text-lg font-medium text-gray-800">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF, images and document files (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <div className="mr-4 bg-white p-3 rounded-full">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-blue-800 truncate">{selectedFile.name}</p>
              <p className="text-sm text-blue-600">{getFileSizeText(selectedFile.size)}</p>
            </div>
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              onClick={handleCancelUpload} 
              disabled={uploading}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Show preview for images */}
          {previewUrl && (
            <div className="mt-4 border border-blue-200 rounded-md overflow-hidden bg-white">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-32 max-w-full mx-auto object-contain" 
              />
            </div>
          )}
        </div>
      )}
      
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
            indicatorClassName="bg-blue-600"
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
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400'
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
