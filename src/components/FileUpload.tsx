
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, File, FileText, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    // Check file type
    const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, CSV, or Excel file");
      return;
    }
    
    // Check file size (limit to 10MB)
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
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Create form data to send file
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress updates - in a real implementation, you might use 
      // XMLHttpRequest with progress events
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 5;
        });
      }, 300);
      
      // For now, we're using a mock API endpoint
      // In a production app, replace with your actual API endpoint
      try {
        // Simulating API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // In a real scenario, you would be making an actual API call:
        // const response = await fetch('https://your-api.com/analyze', {
        //   method: 'POST',
        //   body: formData,
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to upload file');
        // }
        // 
        // const data = await response.json();
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Mock successful response
        const mockData = {
          success: true,
          effectiveRate: '2.95%',
          monthlyVolume: '$125,780',
          chargebackRatio: '0.15%',
          pricingModel: 'Tiered',
          fees: {
            monthlyFee: '$9.95',
            pciFee: '$14.95',
            statementFee: '$7.50',
            batchFee: '$0.25',
            transactionFees: '$0.10 per transaction'
          }
        };
        
        // Store analysis data in localStorage for the results page to use
        localStorage.setItem('statementAnalysis', JSON.stringify(mockData));
        
        toast.success("Analysis complete!");
        
        // Navigate to results page after a short delay
        setTimeout(() => {
          navigate('/results');
        }, 1000);
        
      } catch (error) {
        console.error('API Error:', error);
        toast.error("Failed to analyze statement. Please try again.");
        clearInterval(progressInterval);
        setProgress(0);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
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
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
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
                Supports PDF, CSV, and Excel files (max 10MB)
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
              {uploading ? 'Analyzing...' : 'Analyze Statement'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
