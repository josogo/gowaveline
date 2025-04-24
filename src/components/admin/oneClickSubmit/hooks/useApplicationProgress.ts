
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useApplicationProgress = (merchantApplication?: any) => {
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('business'); // Default to first tab
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from merchantApplication data or localStorage
  useEffect(() => {
    if (merchantApplication?.id) {
      setIsLoading(true);
      
      try {
        // First check localStorage for saved progress (most recent state)
        const savedStateStr = localStorage.getItem(`application_${merchantApplication.id}`);
        
        if (savedStateStr) {
          const savedState = JSON.parse(savedStateStr);
          console.log("Found saved application state:", savedState);
          
          // Set progress from saved state
          if (savedState.progress) {
            setApplicationProgress(savedState.progress);
          }
          
          // Set active tab from saved state
          if (savedState.activeTab) {
            setActiveTab(savedState.activeTab);
          }
          
          setIsLoading(false);
        } 
        // If no localStorage data, check if there's progress in the merchantApplication
        else if (merchantApplication.application_data?.progress) {
          setApplicationProgress(merchantApplication.application_data.progress);
          
          if (merchantApplication.application_data.currentTab) {
            setActiveTab(merchantApplication.application_data.currentTab);
          }
          
          setIsLoading(false);
        } else {
          // Fallback to default values
          setApplicationProgress(0);
          setActiveTab('business');
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading saved application state:", err);
        setIsLoading(false);
      }
    }
  }, [merchantApplication]);

  return {
    applicationProgress,
    setApplicationProgress,
    activeTab,
    setActiveTab,
    isLoading
  };
};
