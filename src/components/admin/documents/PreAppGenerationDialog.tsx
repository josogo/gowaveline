
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Industry, Lead } from '../industries/types';
import { Label } from '@/components/ui/label';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('blank');
  const [generating, setGenerating] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');

  // Fetch industries and leads when the dialog opens
  React.useEffect(() => {
    if (open) {
      fetchIndustries();
      fetchLeads();
    }
  }, [open]);

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setIndustries(data || []);
      if (data && data.length > 0) {
        setSelectedIndustryId(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching industries:', error);
      toast.error('Failed to load industries');
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('business_name', { ascending: true });
      
      if (error) throw error;
      
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    }
  };

  const handleGenerate = async () => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    setGenerating(true);

    try {
      console.log("Starting PDF generation process");
      
      // Verify user is authenticated
      const { data, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error("Authentication error:", authError);
        toast.error("Authentication error. Please log in and try again.");
        setGenerating(false);
        return;
      }
      
      let leadData = null;
      if (selectedLeadId !== 'blank') {
        const lead = leads.find(l => l.id.toString() === selectedLeadId);
        if (lead) {
          leadData = {
            businessName: lead.business_name,
            email: lead.email,
            phone: lead.phone_number,
            website: lead.website,
            processingVolume: lead.processing_volume
          };
          console.log("Using lead data:", leadData);
        }
      }

      console.log("Calling generate-pre-app function with:", { 
        industryId: selectedIndustryId,
        leadData 
      });

      // Call the edge function
      const { data: responseData, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { 
          industryId: selectedIndustryId,
          leadData
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Failed to generate PDF');
      }
      
      console.log("Response from edge function:", responseData);
      
      if (!responseData || !responseData.pdfBase64) {
        console.error("Invalid response from edge function:", responseData);
        throw new Error('Invalid response from server');
      }

      console.log("PDF data received successfully, length:", responseData.pdfBase64.length);
      
      // Convert the data to a Blob
      const base64Data = responseData.pdfBase64;
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      
      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      const industryName = industries.find(i => i.id === selectedIndustryId)?.name || 'industry';
      link.download = `${industryName.replace(/\s+/g, '_')}_merchant_application.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      onSuccess();
      onOpenChange(false);
      toast.success('Merchant application generated successfully');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Merchant Application</DialogTitle>
          <DialogDescription>
            Create a merchant application form for your selected industry
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Industry Selection */}
          <div>
            <Label htmlFor="industry-select">Select Industry</Label>
            <Select 
              value={selectedIndustryId} 
              onValueChange={setSelectedIndustryId}
            >
              <SelectTrigger className="mt-2" id="industry-select">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Select the industry for this merchant application form.
            </p>
          </div>
          
          {/* Lead Selection */}
          <div>
            <Label htmlFor="lead-select">Select a lead (optional)</Label>
            <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
              <SelectTrigger className="mt-2" id="lead-select">
                <SelectValue placeholder="Select a lead to pre-fill data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Generate blank form</SelectItem>
                {leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id.toString()}>
                    {lead.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Select a lead to pre-fill the form with their information, or generate a blank form.
            </p>
          </div>
          
          <div className="flex p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
            <p className="text-sm text-blue-800">
              The generated application will include comprehensive sections for business structure, information, processing volumes, and more.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={generating || !selectedIndustryId}
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Merchant Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
