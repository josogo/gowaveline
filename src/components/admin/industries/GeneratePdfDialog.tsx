
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
import { Industry, Lead } from './types';
import { Label } from '@/components/ui/label';

interface GeneratePdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: Industry;
  leads: Lead[];
}

export const GeneratePdfDialog: React.FC<GeneratePdfDialogProps> = ({ 
  open, 
  onOpenChange,
  industry,
  leads
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('blank');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      // Verify user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        console.error("Authentication error:", authError || "No active session found");
        toast.error("You must be logged in to generate a PDF. Please log in and try again.");
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
        }
      }

      console.log("Calling generate-pre-app function with:", { 
        industryId: industry.id,
        leadData 
      });

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { 
          industryId: industry.id,
          leadData
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Failed to generate PDF');
      }
      
      if (!data || !data.pdfBase64) {
        console.error("Invalid response from edge function:", data);
        throw new Error('Invalid response from server');
      }

      console.log("PDF data received successfully");
      
      // Convert the data to a Blob
      const base64Data = data.pdfBase64;
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
      link.download = `${industry.name.replace(/\s+/g, '_')}_pre_application.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      onOpenChange(false);
      toast.success('PDF generated successfully');
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
          <DialogTitle>Generate Pre-Application PDF</DialogTitle>
          <DialogDescription>
            Create a pre-application form for {industry?.name} industry
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
              The generated PDF will include the industry template and company logo (if available).
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={generating}
          >
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
