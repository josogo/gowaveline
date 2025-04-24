
import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ApplicationFilters } from './ApplicationFilters';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ApplicationDialogs } from './components/ApplicationDialogs';
import { useApplicationDialogs } from './hooks/useApplicationDialogs';

export const ApplicationsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const openAppId = searchParams.get('openApp');
  
  const {
    loading,
    filteredApplications,
    applications,
    handleFilterChange,
    fetchApplications,
  } = useApplications();

  const {
    dialogOpen,
    setDialogOpen,
    appFlowOpen,
    selectedApplication,
    handleCloseApplicationFlow,
    declineRemoveDialog,
    setDeclineRemoveDialog,
    handleOpenApplication,
    processDeclineRemove
  } = useApplicationDialogs(fetchApplications);

  useEffect(() => {
    if (openAppId) {
      const fetchAndOpenApplication = async () => {
        try {
          const { data, error } = await supabase
            .from('merchant_applications')
            .select('*')
            .eq('id', openAppId)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setSelectedApplication(data);
            setAppFlowOpen(true);
          }
        } catch (error) {
          console.error("Error fetching application:", error);
          toast.error("Failed to load application details");
        }
      };
      
      fetchAndOpenApplication();
      
      const url = new URL(window.location.href);
      url.searchParams.delete('openApp');
      window.history.replaceState({}, '', url);
    }
  }, [openAppId]);

  const handleDeclineApplication = (app: any) => {
    setSelectedApplication(app);
    setDeclineRemoveDialog({ open: true, action: "declined" });
  };

  const handleRemoveApplication = (app: any) => {
    setSelectedApplication(app);
    setDeclineRemoveDialog({ open: true, action: "removed" });
  };

  return (
    <div className="space-y-4">
      <ApplicationFilters onFilterChange={handleFilterChange} />
      <ApplicationsGrid
        filteredApplications={filteredApplications}
        loading={loading}
        applications={applications}
        onOpenApplication={handleOpenApplication}
        onDeclineApplication={handleDeclineApplication}
        onRemoveApplication={handleRemoveApplication}
      />
      <ApplicationDialogs
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        appFlowOpen={appFlowOpen}
        selectedApplication={selectedApplication}
        handleCloseApplicationFlow={handleCloseApplicationFlow}
        declineRemoveDialog={declineRemoveDialog}
        setDeclineRemoveDialog={setDeclineRemoveDialog}
        processDeclineRemove={processDeclineRemove}
      />
    </div>
  );
};

export default ApplicationsList;
