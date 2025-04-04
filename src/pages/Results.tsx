
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementAnalysis } from '@/services/statementService';
import { toast } from "sonner";
import DemoDataAlert from '@/components/dashboard/DemoDataAlert';

const Results = () => {
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Results page loaded - checking for analysis data");
    
    // Get the analysis data from localStorage
    const storedData = localStorage.getItem('statementAnalysis');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved analysis data from localStorage:", parsedData);
        
        // Explicitly check for mock data flag
        if (parsedData.isMockData === true) {
          console.warn("Mock data detected - setting isMockData state to true");
          setIsMockData(true);
          toast.warning("You are viewing demonstration data, not your actual statement analysis.");
          
          // Ask if they want to upload a real statement
          setTimeout(() => {
            if (confirm("Would you like to upload a real statement instead of viewing sample data?")) {
              console.log("User chose to upload a real statement - clearing localStorage and navigating to home");
              localStorage.removeItem('statementAnalysis');
              navigate('/');
            }
          }, 1000);
        } else {
          console.log("This appears to be real analysis data");
          setIsMockData(false);
        }
        
        setAnalysis(parsedData);
        setLoading(false);
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
            <div className="flex justify-center mt-8">
              <Button onClick={handleReturnHome}>Return to Home</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-b from-orange-50 to-transparent py-12 px-6 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Statement Analysis</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isMockData 
                  ? "This is sample demonstration data, not based on your actual statement."
                  : "We've analyzed your merchant statement and found several insights that could help you reduce costs."}
              </p>
              
              {isMockData && (
                <Button 
                  onClick={handleReturnHome}
                  variant="outline"
                  className="mt-4"
                >
                  Upload Real Statement
                </Button>
              )}
            </div>
            
            {isMockData && <DemoDataAlert />}
            
            {analysis && <Dashboard analysisData={analysis} />}
            <CallToAction />
          </>
        )}
      </main>
    </div>
  );
};

export default Results;
