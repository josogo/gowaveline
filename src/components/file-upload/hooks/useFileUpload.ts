
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { analyzeStatement } from '@/services/statementService';
import { sendEmailNotification } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

interface UseFileUploadOptions {
  contactInfo?: ContactInfo;
  onFilesChange?: (files: File[]) => void;
  maxSize?: number;
  accept?: string;
}

export const useFileUpload = ({ 
  contactInfo, 
  onFilesChange,
  maxSize = 10 * 1024 * 1024,
  accept
}: UseFileUploadOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped on DropZone:", acceptedFiles);
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    
    const allowedTypes = accept ? accept.split(',') : ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    const isTypeValid = allowedTypes.some(type => {
      if (selectedFile.type && type.includes('/') && selectedFile.type.match(new RegExp(type.replace('*', '.*')))) {
        return true;
      }
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

  const handleAnalyze = async () => {
    if (!file) return;
    
    console.log("Starting upload process");
    localStorage.removeItem('statementAnalysis');
    
    setUploading(true);
    setProgress(10);
    
    try {
      console.log("Analyzing file:", file.name, file.type, file.size);
      console.log("Contact info:", contactInfo);
      
      await sendEmailNotification(file, contactInfo);
      
      const onProgressUpdate = (value: number) => {
        console.log("Progress update:", value);
        setProgress(value);
      };
      
      const analysisData = await analyzeStatement(file, onProgressUpdate);
      console.log("Analysis complete:", analysisData);
      
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
      
      navigate('/results');
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("There was a problem analyzing your statement. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSend = async () => {
    if (!file) return;
    
    toast.loading("Sending statement to WaveLine team...");
    setUploading(true);
    
    try {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const statementsBucketExists = buckets?.some(bucket => bucket.name === 'statements');
        
        if (!statementsBucketExists) {
          await supabase.storage.createBucket('statements', {
            public: false,
            fileSizeLimit: 10485760,
          });
        }
      } catch (error) {
        console.warn("Bucket error (may already exist):", error);
      }
      
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
      
      const { data: urlData } = await supabase.storage
        .from('statements')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);
      
      const fileUrl = urlData?.signedUrl || '';
      
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
