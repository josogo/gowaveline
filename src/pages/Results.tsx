
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatementAnalysis } from '@/services/statementService';
import { toast } from "sonner";

const Results = () => {
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the analysis data from localStorage
    const storedData = localStorage.getItem('statementAnalysis');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved analysis data from localStorage:", parsedData);
        
        // Check if it's mock data and notify the user
        if (parsedData.isMockData) {
          toast.info("You are viewing demonstration data, not your actual statement analysis.");
        }
        
        setAnalysis(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing stored analysis data:', err);
        setError('Error retrieving analysis data. Please try uploading your statement again.');
        setLoading(false);
      }
    } else {
      setError('No analysis data found. Please upload a merchant statement first.');
      setLoading(false);
    }
  }, []);

  const handleReturnHome = () => {
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
        <Footer />
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
            
            {analysis && <Dashboard analysisData={analysis} />}
            <CallToAction />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
