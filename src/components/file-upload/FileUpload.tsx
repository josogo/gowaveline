
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendEmailNotification } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface ContactForm {
  companyName: string;
  email: string;
  phone: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    companyName: '',
    email: '',
    phone: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Only accept the first file if multiple are dropped
      setFile(acceptedFiles[0]);
      setSuccessMessage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const processUpload = async (contactData?: {
    companyName?: string;
    email?: string;
    phone?: string;
  }) => {
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // Simulate processing delay - in a real app, replace with actual processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(50);

      // Send email notification with file details
      const emailSent = await sendEmailNotification(file, contactData);
      
      if (emailSent) {
        setProgress(90);
        
        // Insert lead data into Supabase if contact info was provided
        if (contactData?.email) {
          try {
            // Store lead in Supabase
            const { error } = await supabase
              .from('leads')
              .insert({
                business_name: contactData.companyName || 'Unknown Business',
                email: contactData.email,
                phone_number: contactData.phone || 'No phone provided',
                processing_volume: 'Not specified',
                website: null
              });
              
            if (error) {
              console.error('Error inserting lead data:', error);
              toast.error('Error saving your contact information');
            } else {
              console.log('Lead data saved successfully');
            }
          } catch (err) {
            console.error('Error in Supabase operation:', err);
          }
        }

        // Simulate completion
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(100);
        
        // Display success message
        setSuccessMessage('Your statement has been submitted successfully! Our team will analyze it and get back to you shortly.');
        toast.success('Statement submitted successfully!');
      } else {
        toast.error('Failed to submit statement');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('An error occurred while processing your file');
    } finally {
      setUploading(false);
      setShowContactDialog(false);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      setShowContactDialog(true);
    }
  };

  const handleSubmitWithInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await processUpload({
      companyName: contactForm.companyName,
      email: contactForm.email,
      phone: contactForm.phone
    });
  };

  const handleSubmitWithoutInfo = async () => {
    await processUpload();
  };

  return (
    <div className="w-full">
      {!file && !successMessage ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your statement here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to select a file
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, Excel, CSV (Max size: 10MB)
            </p>
          </div>
        </div>
      ) : successMessage ? (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-medium text-green-700">Success!</p>
              <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
            </div>
            <Button variant="outline" onClick={resetUpload}>
              Upload another statement
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-gray-500">
                  {(file?.size && (file.size / 1024 / 1024).toFixed(2)) || 0} MB
                </p>
              </div>
            </div>
            <button 
              onClick={resetUpload}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={uploading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {uploading ? (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-gray-500">
                {progress < 100 ? 'Processing your statement...' : 'Complete!'}
              </p>
            </div>
          ) : (
            <Button 
              className="mt-4 w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90" 
              onClick={handleUploadClick}
            >
              Upload & Analyze
            </Button>
          )}
        </div>
      )}

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md dialog-scroll-container">
          <DialogHeader>
            <DialogTitle>Help us serve you better</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitWithInfo} className="space-y-6 py-4">
            <div className="grid w-full gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your business name"
                  value={contactForm.companyName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={contactForm.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row justify-center mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSubmitWithoutInfo}
                className="order-1 sm:order-none"
              >
                Skip for now
              </Button>
              
              <Button 
                type="submit" 
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              >
                Submit Information
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
