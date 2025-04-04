
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementAnalysis } from '@/services/statementService';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Results = () => {
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

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

  const handleEmailSubmit = () => {
    // This would normally send the email to a backend service
    console.log("Email submitted:", email);
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailDialog(false);
      setEmailSent(false);
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
            <p className="text-lg">Loading analysis results...</p>
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
              <h2 className="text-xl font-semibold mb-4">Can't analyze your statement?</h2>
              <p className="mb-4">
                Some statements have formats that are difficult to analyze automatically. 
                We'd be happy to analyze your statement manually and provide you with detailed insights within 24 hours.
              </p>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Here's what a sample analysis looks like:</h3>
                <Dashboard analysisData={getSampleAnalysis()} />
              </div>
              
              <Button 
                onClick={() => setShowEmailDialog(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Your Statement For Manual Analysis
              </Button>
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
              <Button onClick={handleTryAgain} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleReturnHome}>Return to Home</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-b from-orange-50 to-transparent py-12 px-6 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Statement Analysis</h1>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email for Custom Analysis</DialogTitle>
            <DialogDescription>
              Enter your email address below. We'll analyze your statement manually and get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <DialogFooter>
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
                Email sent successfully!
              </div>
            ) : (
              <Button onClick={handleEmailSubmit} disabled={!email.includes('@')}>
                Submit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Results;
