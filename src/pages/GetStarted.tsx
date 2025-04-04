
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { File, FileText, UploadCloud, X, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  businessName: z.string().min(2, { message: 'Business name is required.' }),
  website: z.string().optional(),
  monthlyVolume: z.string().min(1, { message: 'Please enter your desired monthly volume.' }),
});

type FormValues = z.infer<typeof formSchema>;

const GetStarted = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      businessName: '',
      website: '',
      monthlyVolume: '',
    },
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    
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
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) return <File className="h-8 w-8 text-teal-500" />;
    return <File className="h-8 w-8 text-[#0EA5E9]" />;
  };

  const onSubmit = async (data: FormValues) => {
    setUploading(true);
    
    try {
      // Prepare data to send via EmailJS
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        business_name: data.businessName,
        website: data.website || 'Not provided',
        monthly_volume: data.monthlyVolume,
        has_statement: file ? 'Yes' : 'No',
        file_name: file ? file.name : 'No file uploaded',
        to_email: 'jordan@gowaveline.com' // This would be used in the EmailJS template
      };
      
      // Here you would normally send the email with the file attachment
      // For demo purposes, we'll just simulate a successful send
      console.log('Sending lead data to jordan@gowaveline.com:', templateParams);
      
      // Simulating EmailJS send (you would need to implement the actual EmailJS configuration)
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY');
      
      toast.success('Thank you for your interest!', {
        description: 'Your information has been sent. We will contact you shortly.',
      });
      
      // Reset the form
      form.reset();
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was a problem submitting your information. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#0EA5E9]">Get Started with Waveline</h1>
            <p className="text-xl text-[#0EA5E9] text-center mb-12">
              Fill out the form below and we'll get back to you within 24 hours to discuss your payment processing needs.
            </p>
            
            <div className="bg-white shadow-lg rounded-lg p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0EA5E9]">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0EA5E9]">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0EA5E9]">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0EA5E9]">Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0EA5E9]">Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourbusiness.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="monthlyVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0EA5E9]">Desired Monthly Processing Volume</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $50,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <p className="text-[#0EA5E9] font-medium">Upload Your Merchant Statement (Optional)</p>
                    <p className="text-sm text-muted-foreground">
                      This helps us provide a more accurate analysis of your current rates.
                    </p>
                    
                    {!file ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragActive ? 'border-[#0EA5E9] bg-[#0EA5E9]/5' : 'border-gray-300 hover:border-[#0EA5E9]/50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-4">
                          <UploadCloud className={`h-12 w-12 ${isDragActive ? 'text-[#0EA5E9]' : 'text-gray-400'}`} />
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-[#0EA5E9]">
                              {isDragActive ? "Drop the file here" : "Drag & drop your merchant statement"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Supports PDF, CSV and Excel files (max 10MB).
                            </p>
                          </div>
                          <Button variant="outline" className="border-[#0EA5E9] text-[#0EA5E9]">Browse files</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium truncate max-w-[200px] md:max-w-[400px] text-[#0EA5E9]">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={removeFile}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={uploading}
                          type="button"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white py-6 text-lg"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GetStarted;
