
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileValidation } from './useFileValidation';
import { useFileStorage } from './useFileStorage';
import { useFileNotifications } from './useFileNotifications';
import { FileUploadOptions } from '../types';

export const useFileUpload = ({ 
  contactInfo, 
  onFilesChange,
  maxSize = 10 * 1024 * 1024,
  accept
}: FileUploadOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { validateFile } = useFileValidation({ maxSize, accept });
  const { uploadToStorage } = useFileStorage();
  const { sendNotification } = useFileNotifications();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped on DropZone:", acceptedFiles);
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    
    const validationResult = validateFile(selectedFile);
    if (!validationResult.isValid) {
      console.log(validationResult.error);
      return;
    }
    
    console.log("File accepted:", selectedFile.name);
    setFile(selectedFile);
    
    if (onFilesChange) {
      onFilesChange(acceptedFiles);
    }
  }, [accept, maxSize, onFilesChange, validateFile]);

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    if (onFilesChange) {
      onFilesChange([]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    await handleFileOperation('analyze', file, contactInfo);
  };

  const handleSend = async () => {
    if (!file) return;
    await handleFileOperation('send', file, contactInfo);
  };

  const handleFileOperation = async (operation: 'analyze' | 'send', file: File, contactInfo?: any) => {
    setUploading(true);
    setProgress(operation === 'analyze' ? 10 : 0);
    
    try {
      if (operation === 'analyze') {
        await sendNotification.handleAnalyzeOperation(file, setProgress);
      } else {
        await sendNotification.handleSendOperation(file, contactInfo);
      }
    } catch (error) {
      console.error(`Error in ${operation} operation:`, error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    file,
    uploading,
    progress,
    onDrop,
    removeFile,
    handleAnalyze,
    handleSend
  };
};
