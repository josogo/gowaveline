
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { analyzeStatement } from '@/services/statementService';
import { sendEmailNotification } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import DropZone from './DropZone';
import FileDisplay from './FileDisplay';
import UploadProgress from './UploadProgress';
import UploadActions from './UploadActions';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

export interface FileUploadProps {
  contactInfo?: ContactInfo;
  // Add new props needed for AgreementUploadModal
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (acceptedFiles: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  contactInfo,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFilesChange
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem('statementAnalysis');
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped on DropZone:", acceptedFiles);
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    
    const allowedTypes = accept ? accept.split(',') : ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    // Check if the file type is valid based on MIME type or extension
    const isTypeValid = allowedTypes.some(type => {
      // Check MIME type
      if (selectedFile.type && type.includes('/') && selectedFile.type.match(new RegExp(type.replace('*', '.*')))) {
        return true;
      }
      // Check extension
      if (type.startsWith('.') && selectedFile.name.toLowerCase().endsWith(type.toLowerCase())) {
        return true;
      }
      return false;
    });
    
    if (!isTypeValid) {
      console.log("File type not allowed:", selectedFile.type);
      toast.error("Please upload a file with the correct format");
      return;
    }
    
    if (selectedFile.size > maxSize) {
      console.log("File too large:", selectedFile.size);
      toast.error(`File size should be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }
    
    console.log("File accepted:", selectedFile.name);
    setFile(selectedFile);
    
    // Call the onFilesChange prop if it exists
    if (onFilesChange) {
      onFilesChange(acceptedFiles);
    }
  }, [accept, maxSize, onFilesChange]);
  
  const removeFile = () => {
    setFile(null);
    setProgress(0);
    if (onFilesChange) {
      onFilesChange([]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    console.log("Starting upload process");
    localStorage.removeItem('statementAnalysis');
    
    setUploading(true);
    setProgress(10);
    
    try {
      console.log("Analyzing file:", file.name, file.type, file.size);
      console.log("Contact info:", contactInfo);
      
      // Send notification email
      await sendEmailNotification(file, contactInfo);
      
      // Use a simpler progress callback
      const onProgressUpdate = (value: number) => {
        console.log("Progress update:", value);
        setProgress(value);
      };
      
      const analysisData = await analyzeStatement(file, onProgressUpdate);
      console.log("Analysis complete:", analysisData);
      
      // Store the data and navigate to results
      localStorage.setItem('statementAnalysis', JSON.stringify(analysisData));
      
      if (!analysisData.success) {
        toast.error(analysisData.message || "Analysis failed. Please try a different file format.");
      } else {
        const hasAnyData = 
          analysisData.effectiveRate !== "N/A" || 
          analysisData.monthlyVolume !== "N/A" || 
          analysisData.pricingModel !== "N/A";
        
        if (hasAnyData) {
          toast.success("Analysis complete!");
        } else {
          toast.warning("Limited data extracted. Try uploading a clearer PDF or CSV version.");
        }
      }
      
      // Navigate to results page
      navigate('/results');
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("There was a problem analyzing your statement. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSendStatement = async () => {
    if (!file) return;
    
    toast.loading("Sending statement to WaveLine team...");
    setUploading(true);
    
    try {
      // Create a storage bucket for statements if it doesn't exist
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const statementsBucketExists = buckets?.some(bucket => bucket.name === 'statements');
        
        if (!statementsBucketExists) {
          await supabase.storage.createBucket('statements', {
            public: false,
            fileSizeLimit: 10485760, // 10MB
          });
        }
      } catch (error) {
        console.warn("Bucket error (may already exist):", error);
      }
      
      // Upload file to Supabase Storage
      const timeStamp = new Date().getTime();
      const fileName = `${timeStamp}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('statements')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      
      // Get file URL
      const { data: urlData } = await supabase.storage
        .from('statements')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // URL valid for 7 days
      
      const fileUrl = urlData?.signedUrl || '';
      
      // Send notification email with attachment info
      await sendEmailNotification(file, contactInfo);
      
      toast.success("Statement sent successfully to the WaveLine team!");
      toast.dismiss();
      
      removeFile();
      
    } catch (error) {
      console.error("Error sending statement:", error);
      toast.error("Failed to send statement. Please try again or contact support.");
      toast.dismiss();
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="w-full">
      {!file ? (
        <DropZone 
          onDrop={onDrop}
          accept={accept}
        />
      ) : (
        <div className="space-y-4">
          <FileDisplay 
            file={file} 
            uploading={uploading} 
            removeFile={removeFile} 
          />
          
          <UploadProgress progress={progress} uploading={uploading} />
          
          {!onFilesChange && (
            <UploadActions 
              uploading={uploading} 
              file={file} 
              onSend={handleSendStatement} 
              onAnalyze={handleUpload}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
