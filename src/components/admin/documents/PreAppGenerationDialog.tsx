
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createDocument } from './types';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  leadId: z.string().min(1, { message: 'Please select a lead' }),
});

type FormValues = z.infer<typeof formSchema>;

interface Lead {
  id: number;
  business_name: string;
  email: string;
  phone_number: string;
  processing_volume: string;
  website?: string;
}

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadId: '',
    },
  });
  
  // Fetch leads when dialog opens
  useEffect(() => {
    if (open) {
      fetchLeads();
    }
  }, [open]);
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    const lead = leads.find(l => l.id.toString() === values.leadId);
    
    if (!lead) {
      toast.error('Please select a valid lead');
      return;
    }
    
    setIsGenerating(true);
    setSelectedLead(lead);
    
    try {
      // Generate Pre-Application form using edge function
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          type: 'preapp',
          data: {
            businessName: lead.business_name,
            email: lead.email,
            phone: lead.phone_number,
            website: lead.website || 'N/A',
            processingVolume: lead.processing_volume,
            date: new Date().toLocaleDateString()
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }
      
      // Get PDF bytes from response
      const pdfBlob = await response.blob();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Upload to storage
      const fileName = `PreApp_${lead.business_name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Create document record
      await createDocument({
        name: `Pre-Application Form - ${lead.business_name}`,
        description: `Pre-Application form generated for ${lead.business_name}`,
        file_path: filePath,
        file_type: 'application/pdf',
        file_size: pdfBlob.size,
        uploaded_by: user.id,
        document_type: 'preapp',
        is_template: false,
        metadata: { leadId: lead.id }
      });
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Pre-Application form generated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error generating Pre-App form:', error);
      toast.error(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !isGenerating && onOpenChange(open)}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Generate Pre-Application Form</DialogTitle>
          <DialogDescription>
            Create a pre-filled application form for a lead
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Lead</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const lead = leads.find(l => l.id.toString() === value);
                        setSelectedLead(lead || null);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lead" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id.toString()}>
                            {lead.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {leads.length === 0 && (
                      <FormDescription className="text-amber-500">
                        No leads found. Please add leads first.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              
              {selectedLead && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Lead Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Business:</span> {selectedLead.business_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedLead.phone_number}</p>
                    <p><span className="font-medium">Processing Volume:</span> {selectedLead.processing_volume}</p>
                    {selectedLead.website && (
                      <p><span className="font-medium">Website:</span> {selectedLead.website}</p>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isGenerating || leads.length === 0}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Form
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
