
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import FileUpload from '@/components/file-upload';
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required")
});

const CallToAction = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: ""
    }
  });

  const handleSubmit = async (data) => {
    try {
      // Insert form data into Supabase
      const { error } = await supabase
        .from('leads')
        .insert({
          business_name: data.companyName,
          email: data.email,
          phone_number: data.phone,
          processing_volume: "To be determined", // Default value since we don't have this field
          website: null // Optional field
        });

      if (error) {
        throw error;
      }

      // Send notification email via edge function
      await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lead',
          subject: 'New Lead Submission',
          data: {
            company: data.companyName,
            email: data.email,
            phone: data.phone,
          }
        }),
      });
      
      toast.success("Your information has been submitted!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="relative py-16 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-teal-100 opacity-50"></div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready To Optimize Your Processing Costs?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Upload your statement now and discover how much you could save with our detailed analysis and recommendations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-6 text-lg rounded-md"
              >
                Submit Statement
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="w-[95%] max-w-[525px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-[#0EA5E9] border-0"
              onOpenAutoFocus={(e) => {
                // Prevent default focus behavior to avoid scrolling to bottom
                e.preventDefault();
                // Find the first input and focus it
                const firstInput = document.querySelector('input[name="companyName"]');
                if (firstInput) {
                  (firstInput as HTMLElement).focus();
                }
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl text-white">Upload Your Statement</DialogTitle>
                <DialogDescription className="text-white/80">
                  Fill in your information and upload your statement for analysis.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 dialog-scroll-container">
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your Company" 
                              {...field} 
                              className="bg-white/90 border-white" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-200" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              {...field} 
                              className="bg-white/90 border-white" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-200" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              {...field}
                              className="bg-white/90 border-white" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-200" />
                        </FormItem>
                      )}
                    />
                    <div className="pb-6">
                      <FileUpload contactInfo={form.getValues()} />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white py-2"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Information
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
