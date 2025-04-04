
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementAnalysis } from '@/services/statementService';
import { toast } from "sonner";

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
        
        // Check if this is mock data from the simulation
        if (parsedData.isMockData === true) {
          console.warn("Mock data detected - displaying simulation notice");
          setIsMockData(true);
          // We don't show an error toast here because we'll display a banner instead
        } else {
          console.log("Real analysis data found");
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
                We've analyzed your merchant statement and found several insights that could help you reduce costs.
              </p>
            </div>
            
            {isMockData && (
              <div className="container mx-auto px-6 mb-8">
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Simulation Mode</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    This is simulated data for testing purposes. The Gemini API encountered an issue processing your actual statement.
                    Try uploading a different file format or contact support if the issue persists.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {analysis && <Dashboard analysisData={analysis} />}
            <CallToAction />
          </>
        )}
      </main>
    </div>
  );
};

export default Results;
