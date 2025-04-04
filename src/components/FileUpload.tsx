
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, File, FileText, UploadCloud, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { analyzeStatement, StatementAnalysis } from '@/services/statementService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem('statementAnalysis');
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    setError(null);
    setDebugInfo(null);
    
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
    setError(null);
    setDebugInfo(null);
  };
  
  const resetApp = () => {
    localStorage.removeItem('statementAnalysis');
    setFile(null);
    setProgress(0);
    setError(null);
    setDebugInfo(null);
    setUploading(false);
    toast.info("Application reset. Please upload a new statement.");
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    console.log("Clearing any existing analysis data from localStorage");
    localStorage.removeItem('statementAnalysis');
    
    setUploading(true);
    setProgress(0);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log("Starting file analysis:", file.name, file.type);
      
      const analysisData = await analyzeStatement(file, (progressValue) => {
        setProgress(progressValue);
      });
      
      console.log("Analysis data received, isMockData=", analysisData.isMockData);
      
      localStorage.setItem('statementAnalysis', JSON.stringify(analysisData));
      
      const noDataExtracted = 
        analysisData.effectiveRate === "N/A" && 
        analysisData.monthlyVolume === "N/A" && 
        analysisData.pricingModel === "N/A" &&
        analysisData.chargebackRatio === "N/A" && 
        analysisData.fees.monthlyFee === "N/A" &&
        analysisData.fees.pciFee === "N/A";
        
      if (noDataExtracted) {
        toast.warning("We couldn't extract all data from your statement, but we'll show what we found.");
      } else {
        toast.success("Analysis complete!");
      }
      
      setTimeout(() => {
        navigate('/results');
      }, 1000);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      const isGeminiError = 
        error instanceof Error && 
        (
          error.message.includes('Gemini') ||
          error.message.includes('Edge Function returned a non-2xx status code')
        );
      
      if (isGeminiError) {
        setError("Processing requires Gemini API configuration. Please check that your Gemini API key is configured correctly.");
        setDebugInfo("The system needs the Gemini API key to be configured in Supabase Edge Function Secrets.");
      } else {
        setError(error instanceof Error ? error.message : 'Unknown error');
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setProgress(0);
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
          
          {uploading && !error && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-right text-muted-foreground">{progress}%</p>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetApp}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Application
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={removeFile}
                  >
                    Try New File
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm text-orange-700">
              <p className="font-medium">Debug Information:</p>
              <p className="font-mono text-xs mt-1 break-all">{debugInfo}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            {!error ? (
              <Button 
                onClick={handleUpload} 
                disabled={uploading || !file}
                className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white"
              >
                {uploading ? 'Analyzing...' : 'Analyze Statement'}
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={removeFile}
                >
                  Try New File
                </Button>
                <Button
                  onClick={resetApp}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
                >
                  Reset Application
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
