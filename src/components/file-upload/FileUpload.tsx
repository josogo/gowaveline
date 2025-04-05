import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { analyzeStatement } from '@/services/statementService';
import { sendEmailNotification } from '@/services/notificationService';

// Components
import DropZone from './DropZone';
import FileDisplay from './FileDisplay';
import UploadActions from './UploadActions';
import UploadProgress from './UploadProgress';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

interface FileUploadProps {
  contactInfo?: ContactInfo;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ contactInfo, className }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem('statementAnalysis');
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    
    const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, CSV, or Excel file");
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }
    
    setFile(selectedFile);
  }, []);
  
  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    console.log("Starting upload process");
    localStorage.removeItem('statementAnalysis');
    
    setUploading(true);
    setProgress(10);
    
    try {
      console.log("Analyzing file:", file.name, file.type);
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
      
      setUploading(false);
      removeFile();
      
    } catch (error) {
      console.error("Error sending statement:", error);
      toast.error("Failed to send statement. Please try again or contact support.");
      toast.dismiss();
      setUploading(false);
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {!file ? (
        <DropZone onDrop={onDrop} />
      ) : (
        <div className="space-y-4">
          <FileDisplay 
            file={file} 
            uploading={uploading} 
            removeFile={removeFile} 
          />
          
          <UploadProgress 
            progress={progress}
            uploading={uploading}
          />
          
          <UploadActions 
            uploading={uploading}
            file={file}
            onSend={handleSendStatement}
            onAnalyze={handleUpload}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
