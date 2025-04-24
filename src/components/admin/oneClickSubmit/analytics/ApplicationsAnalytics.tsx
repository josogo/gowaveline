
import React from 'react';
import { Card } from '@/components/ui/card';
import AnalyticsDashboard from './AnalyticsDashboard';
import { checkUserIsAdmin } from '@/components/admin/documents/api/userApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function ApplicationsAnalytics() {
  console.log("ApplicationsAnalytics component rendering");
  
  // Force refresh auth state when this component mounts
  React.useEffect(() => {
    const refreshAuth = async () => {
      try {
        // Refresh the session to make sure we have the latest auth state
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Error refreshing auth session:", error);
        } else {
          console.log("Auth session refreshed successfully");
        }
      } catch (err) {
        console.error("Exception during auth refresh:", err);
      }
    };
    
    refreshAuth();
  }, []);
  
  return (
    <Card className="w-full overflow-hidden">
      <AnalyticsDashboard />
    </Card>
  );
}

export default ApplicationsAnalytics;
