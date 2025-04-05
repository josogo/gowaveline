
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
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, FileCheck } from 'lucide-react';

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
            <DialogContent className="w-[95%] max-w-[525px] h-auto max-h-[80vh] overflow-y-auto p-4 sm:p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-0 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl text-orange-500">Upload Your Statement</DialogTitle>
                <DialogDescription className="text-orange-500">
                  Fill out your information and upload your statement to see how much you could be saving monthly
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your Company" 
                              {...field} 
                              required
                              className="border-gray-300" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              {...field} 
                              required
                              className="border-gray-300" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              {...field} 
                              required
                              className="border-gray-300" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="pb-6">
                      <FileUpload contactInfo={form.getValues()} />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        type="button"
                        onClick={() => {
                          const contactInfo = form.getValues();
                          // Validate form
                          if (!contactInfo.companyName || !contactInfo.email || !contactInfo.phone) {
                            toast.error("Please fill in all required fields");
                            return;
                          }
                          toast.success("Information submitted successfully!");
                          setOpen(false);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white py-2"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Information
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const contactInfo = form.getValues();
                          // Validate form
                          if (!contactInfo.companyName || !contactInfo.email || !contactInfo.phone) {
                            toast.error("Please fill in all required fields");
                            return;
                          }
                          navigate('/results');
                        }}
                        className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white py-2"
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        See Savings
                      </Button>
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
