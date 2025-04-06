
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { analyzeStatement } from '@/services/statementService';
import { sendEmailNotification } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import DropZone from './file-upload/DropZone';
import FileDisplay from './file-upload/FileDisplay';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

interface FileUploadProps {
  contactInfo?: ContactInfo;
}

const FileUpload: React.FC<FileUploadProps> = ({ contactInfo }) => {
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
    <div className="w-full">
      {!file ? (
        <DropZone onDrop={onDrop} />
      ) : (
        <div className="space-y-4">
          <FileDisplay 
            file={file} 
            uploading={uploading} 
            removeFile={removeFile} 
          />
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-right text-muted-foreground">{progress}%</p>
            </div>
          )}
          
          <div className="flex gap-4 justify-end">
            <Button 
              onClick={handleSendStatement} 
              disabled={uploading || !file}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Statement
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploading || !file}
              className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Analyze Statement'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
