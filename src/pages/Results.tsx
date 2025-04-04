
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCw, Mail, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementAnalysis } from '@/services/statementService';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  businessName: z.string().min(2, { message: 'Business name is required.' }),
  monthlyVolume: z.string().min(1, { message: 'Please enter your desired monthly volume.' }),
});

type FormValues = z.infer<typeof formSchema>;

const Results = () => {
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      businessName: '',
      monthlyVolume: '',
    },
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setStatementFile(file);
    }
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

  useEffect(() => {
    console.log("Results page loaded - checking for analysis data");
    
    // Get the analysis data from localStorage
    const storedData = localStorage.getItem('statementAnalysis');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved analysis data from localStorage:", parsedData);
        
        if (!parsedData.success) {
          console.error("Analysis was not successful:", parsedData.error || "Unknown error");
          setError(parsedData.message || "There was a problem analyzing your statement. Please try again with a different file format.");
          setLoading(false);
          return;
        }
        
        setAnalysis(parsedData);
        setLoading(false);
        
        // Show appropriate toast based on data quality
        const hasAnyRealData = 
          parsedData.effectiveRate !== "N/A" || 
          parsedData.monthlyVolume !== "N/A" || 
          parsedData.pricingModel !== "N/A" || 
          parsedData.fees.monthlyFee !== "N/A" ||
          parsedData.fees.pciFee !== "N/A";
        
        if (!hasAnyRealData) {
          toast.warning("Limited data extracted. Try uploading a clearer PDF or CSV version.");
        }
      } catch (err) {
        console.error('Error parsing stored analysis data:', err);
        setError('Error retrieving analysis data. Please try uploading your statement again.');
        setLoading(false);
      }
    } else {
      console.warn("No analysis data found in localStorage");
      setError('No analysis data found. Please upload a merchant statement first.');
      setLoading(false);
    }
  }, [navigate]);

  const handleReturnHome = () => {
    // Clear stored data before returning home
    console.log("Clearing analysis data and returning to home page");
    localStorage.removeItem('statementAnalysis');
    navigate('/');
  };

  const handleTryAgain = () => {
    console.log("Returning to upload page");
    navigate('/');
  };

  const handleEmailSubmit = (data: FormValues) => {
    // This would normally send the email to a backend service
    if (!statementFile) {
      toast.error("Please upload your statement file");
      return;
    }
    
    console.log("Form data submitted:", data);
    console.log("File submitted:", statementFile);
    
    // Here you would integrate with a service to send the email with the file and form data
    // For example using EmailJS or a backend API
    
    // For now we'll just simulate a successful submission
    toast.success("Your statement has been submitted for manual analysis");
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailDialog(false);
      setEmailSent(false);
      setStatementFile(null);
      form.reset();
    }, 2000);
  };

  // Generate sample data for demonstration when real analysis fails
  const getSampleAnalysis = (): StatementAnalysis => {
    return {
      success: true,
      effectiveRate: "2.75%",
      monthlyVolume: "$45,230.50",
      chargebackRatio: "0.12%",
      pricingModel: "Interchange Plus",
      fees: {
        monthlyFee: "$25.00",
        pciFee: "$19.95",
        statementFee: "$10.00",
        batchFee: "$0.25",
        transactionFees: "$0.10 + 0.25%"
      },
      message: "Sample data is shown for demonstration purposes. This is not based on your actual statement."
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-[#0EA5E9]">Loading analysis results...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {error ? (
          <div className="container mx-auto py-16 px-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="mt-8 bg-orange-50 border border-orange-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#0EA5E9]">Can't analyze your statement?</h2>
              <p className="mb-4 text-[#0EA5E9]">
                Some statements have formats that are difficult to analyze automatically. 
                We'd be happy to analyze your statement manually and provide you with detailed insights within 24 hours.
              </p>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-[#0EA5E9]">Here's what a sample analysis looks like:</h3>
                <Dashboard analysisData={getSampleAnalysis()} />
              </div>
              
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={() => setShowEmailDialog(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white flex items-center gap-2 mx-auto"
                >
                  <Mail className="h-4 w-4" />
                  Email Your Statement For Manual Analysis
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Most statements don't show monthly volume clearly, which is why our automatic analysis might miss it.
                  Our manual analysis can find this data and more.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
              <Button onClick={handleTryAgain} variant="outline" className="border-[#0EA5E9] text-[#0EA5E9]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleReturnHome} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">Return to Home</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-b from-orange-50 to-transparent py-12 px-6 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0EA5E9]">Your Statement Analysis</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We've analyzed your merchant statement and extracted the available data.
              </p>
            </div>
            
            {analysis && <Dashboard analysisData={analysis} />}
            <CallToAction />
          </>
        )}
      </main>
      
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#0EA5E9]">Submit for Manual Analysis</DialogTitle>
            <DialogDescription>
              Please provide your information and upload your statement. We'll analyze it manually 
              and get back to you within 24 hours with detailed insights.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
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
                name="monthlyVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0EA5E9]">Desired Monthly Volume</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $50,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* File Upload Area */}
              <div className="space-y-2">
                <Label htmlFor="statement" className="text-[#0EA5E9]">
                  Your Statement
                </Label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-[#0EA5E9] bg-[#0EA5E9]/5' : 'border-gray-300 hover:border-[#0EA5E9]/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className={`h-8 w-8 ${isDragActive ? 'text-[#0EA5E9]' : 'text-gray-400'}`} />
                    <div>
                      {statementFile ? (
                        <p className="text-sm font-medium text-[#0EA5E9]">{statementFile.name}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {isDragActive ? "Drop file here" : "Drag & drop or click to upload your statement"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {statementFile && (
                  <p className="text-xs text-muted-foreground text-right">
                    {(statementFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>
              
              <DialogFooter className="pt-4">
                {emailSent ? (
                  <div className="flex items-center text-green-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Submitted successfully!
                  </div>
                ) : (
                  <Button 
                    type="submit"
                    disabled={!statementFile || form.formState.isSubmitting}
                    className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Analysis'
                    )}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
