
import { useState, useEffect } from 'react';
import { calculateProgress } from '../utils/applicationUtils';

export function useApplicationProgress(merchantApplication?: any) {
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('business');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeApplication = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!merchantApplication) {
          throw new Error("No application data provided");
        }
        
        // Initialize active tab from application data if available
        const appData = merchantApplication.application_data;
        if (appData && appData.currentTab) {
          setActiveTab(appData.currentTab);
        }
        
        // Calculate progress based on application data
        const progress = calculateProgress(appData || {});
        setApplicationProgress(progress);
        
        console.log(`Application loaded: Active tab set to ${appData?.currentTab || 'business'}, progress: ${progress}%`);
        
      } catch (err: any) {
        console.error("Error initializing application:", err);
        setError(err.message || "Failed to load application data");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApplication();
  }, [merchantApplication]);
  
  return { 
    applicationProgress, 
    setApplicationProgress, 
    activeTab, 
    setActiveTab, 
    isLoading,
    error 
  };
}
