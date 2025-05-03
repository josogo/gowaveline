
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import FileDropZone from './components/FileDropZone';
import FilePreview from './components/FilePreview';
import UploadProgress from './components/UploadProgress';
import UploadButton from './components/UploadButton';
import { useUploadForm } from './hooks/useUploadForm';

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
  const {
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
  } = useUploadForm({
    applicationId,
    documentType: initialDocType,
    onUploadSuccess
  });
  
  console.log("UploadForm rendered with applicationId:", applicationId);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <DocumentTypeSelector 
              documentType={documentType}
              onDocumentTypeChange={handleDocumentTypeChange}
            />
            
            <div className="mt-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                data-testid="file-input"
              />
              
              {!selectedFile ? (
                <FileDropZone
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                />
              ) : (
                <FilePreview
                  file={selectedFile}
                  onRemove={handleRemoveFile}
                  uploading={uploading}
                />
              )}
            </div>
          </div>
          
          <UploadButton 
            uploading={uploading} 
            hasFile={!!selectedFile} 
          />
          
          <UploadProgress 
            uploading={uploading} 
            progress={uploadProgress} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
