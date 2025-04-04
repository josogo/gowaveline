
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from '@/components/file-upload';
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CallToAction = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      companyName: "",
      email: "",
      phone: ""
    }
  });

  const handleSubmit = async (data) => {
    try {
      toast.success("Your information has been submitted!");
      setOpen(false);
      // Form submission is handled in the FileUpload component
    } catch (error) {
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
            <DialogContent className="w-[95%] max-w-[525px] h-auto max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#0EA5E9]">Upload Your Statement</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="pb-6">
                      <FileUpload contactInfo={form.getValues()} />
                    </div>
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
