
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Check, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PreAppForm from './PreAppForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generatePreApp } from '../api';
import { useQuery } from '@tanstack/react-query';
import { fetchIndustries } from '../api';
import { supabase } from '@/integrations/supabase/client';

interface PreAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PreAppModal: React.FC<PreAppModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<{ base64: string; businessName: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Fetch industries
  const { data: industries, isLoading: industriesLoading } = useQuery({
    queryKey: ['industries'],
    queryFn: fetchIndustries,
  });

  // Check authentication on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecking(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('Failed to verify authentication status');
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }
    };

    if (open) {
      checkAuth();
    }
  }, [open]);

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You must be logged in to generate applications');
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedPdf(null);

      const result = await generatePreApp(selectedIndustryId, null, formData);
      
      // Mock PDF generation since the edge function returns mock data
      // In a real implementation, we would get this from the result
      setGeneratedPdf({
        base64: 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGFkT9PwzAQxfd8Cq8IKYnrJE5YkCqVAQYGYEBiQO1AwRL/JDJQ8e25NghVgMHy6d7v7t6dWwgkQA8hhIHeQK8tNw48IOxzWEcwJsLwdDAYRAMLfR',
        businessName: formData.businessName || formData.principalName || 'New_Business'
      });

      toast.success('Pre-application generated successfully!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error generating pre-application:', error);
      toast.error(`Failed to generate pre-application: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF download
  const handleDownloadPdf = () => {
    if (!generatedPdf) return;
    
    try {
      // Convert base64 to blob
      const byteCharacters = atob(generatedPdf.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `WaveLine_PreApp_${generatedPdf.businessName.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  // Go to login page
  const goToLogin = () => {
    window.location.href = '/auth';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            WaveLine Merchant Application
          </DialogTitle>
        </DialogHeader>
        
        {isAuthChecking && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" /> 
            Checking authentication status...
          </div>
        )}
        
        {!isAuthChecking && !isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-sm text-amber-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              You need to be logged in to generate applications.
            </p>
            <div className="mt-2">
              <Button
                variant="default"
                size="sm"
                onClick={goToLogin}
                className="bg-[#0EA5E9]"
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}
        
        {!isAuthChecking && isAuthenticated && !generatedPdf && (
          <>
            <div className="mb-4">
              <Label htmlFor="industry" className="block font-medium mb-1">Select Industry</Label>
              <Select value={selectedIndustryId} onValueChange={setSelectedIndustryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industriesLoading ? (
                    <SelectItem value="loading" disabled>Loading industries...</SelectItem>
                  ) : industries && industries.length > 0 ? (
                    industries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No industries available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <PreAppForm onSubmit={handleSubmit} isLoading={isGenerating} />
          </>
        )}
        
        {!isAuthChecking && isAuthenticated && generatedPdf && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Pre-Application Generated!</h3>
                <p className="text-green-600 mb-6">Your merchant application has been generated successfully.</p>
                
                <Button 
                  onClick={handleDownloadPdf}
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setGeneratedPdf(null)}
              >
                Generate Another
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreAppModal;
