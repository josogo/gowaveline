import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { File, FileText, UploadCloud, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { analyzeStatement } from '@/services/statementService';
import { supabase } from '@/integrations/supabase/client';

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
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    }
  });
  
  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };
  
  const sendEmailNotification = async (fileData: File, contactData?: ContactInfo) => {
    try {
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'statement',
          subject: 'New Statement Analysis Request',
          data: {
            company: contactData?.companyName || 'No company provided',
            email: contactData?.email || 'No email provided',
            phone: contactData?.phone || 'No phone provided',
            fileName: fileData.name,
            fileType: fileData.type,
            fileSize: fileData.size,
          }
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to send email notification');
      } else {
        console.log('Email notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
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
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) return <File className="h-8 w-8 text-teal-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };
  
  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <UploadCloud className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {isDragActive ? "Drop the file here" : "Drag & drop your merchant statement"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, CSV and Excel files (max 10MB).
              </p>
            </div>
            <Button variant="outline">Browse files</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.type)}
              <div>
                <p className="font-medium truncate max-w-[200px] md:max-w-[400px]">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={uploading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-right text-muted-foreground">{progress}%</p>
            </div>
          )}
          
          <div className="flex justify-end">
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
