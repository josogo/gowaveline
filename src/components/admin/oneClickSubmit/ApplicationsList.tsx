import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApplicationFilters } from './ApplicationFilters';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useSearchParams } from 'react-router-dom';

// Lazy load the dialog components to reduce initial bundle size
const ApplicationDialog = lazy(() => import('./ApplicationDialog')
  .then(module => ({ default: module.ApplicationDialog })));

const DeclineRemoveDialog = lazy(() => import('./DeclineRemoveDialog'));
const ApplicationFlow = lazy(() => import('./ApplicationFlow'));

export const ApplicationsList: React.FC = () => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appFlowOpen, setAppFlowOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{
    open: boolean;
    action: null | "declined" | "removed";
  }>({ open: false, action: null });

  const [searchParams] = useSearchParams();
  const openAppId = searchParams.get('openApp');

  const {
    loading,
    filteredApplications,
    applications,
    handleFilterChange,
    fetchApplications,
  } = useApplications();
  
  useEffect(() => {
    if (openAppId) {
      const fetchAndOpenApplication = async () => {
        try {
          const { data, error } = await supabase
            .from('merchant_applications')
            .select('*')
            .eq('id', openAppId)
            .single();
          
          if (error) {
            throw error;
          }
          
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

  const handleOpenApplication = async (app: any) => {
    try {
      if (app.id) {
        const { data, error } = await supabase
          .from('merchant_applications')
          .select('*')
          .eq('id', app.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log("Opening application with data:", data);
          setSelectedApplication(data);
          setAppFlowOpen(true);
          return;
        }
      }
      
      setSelectedApplication(app.rawData || app);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to load application details");
      
      setSelectedApplication(app.rawData || app);
      setDialogOpen(true);
    }
  };

  const handleDeclineApplication = (app: any) => {
    setSelectedApplication(app);
    setDeclineRemoveDialog({ open: true, action: "declined" });
  };

  const handleRemoveApplication = (app: any) => {
    setSelectedApplication(app);
    setDeclineRemoveDialog({ open: true, action: "removed" });
  };

  const processDeclineRemove = async (reason: string) => {
    if (!selectedApplication) return;
    
    try {
      const appId = selectedApplication.id || selectedApplication.rawData?.id;
      
      if (!appId) {
        toast.error("Invalid application data");
        return Promise.resolve();
      }
      
      const { error: updateError } = await supabase
        .from("merchant_applications")
        .update({
          status: declineRemoveDialog.action,
          action_reason: reason,
          actioned_by: "admin",
          actioned_at: new Date().toISOString(),
        })
        .eq("id", appId);

      const { error: logError } = await supabase
        .from("applications_action_log")
        .insert({
          application_id: appId,
          action: declineRemoveDialog.action || '',
          reason,
          actioned_by: "admin",
          actioned_at: new Date().toISOString(),
        });

      if (updateError || logError) {
        throw new Error(updateError?.message || logError?.message || "Failed to process request.");
      }
      
      toast.success(
        declineRemoveDialog.action === "declined"
          ? "Application declined and logged"
          : "Application removed and logged"
      );
      
      setDeclineRemoveDialog({ open: false, action: null });
      fetchApplications();
      
    } catch (e: any) {
      toast.error(e.message || "Failed, please try again.");
    }
    return Promise.resolve();
  };

  const handleCloseApplicationFlow = () => {
    setAppFlowOpen(false);
    fetchApplications();
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
      <Suspense fallback={<div className="p-4 text-center">Loading details...</div>}>
        {dialogOpen && (
          <ApplicationDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            application={selectedApplication}
          />
        )}
        {appFlowOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="container mx-auto py-8 px-4">
              <ApplicationFlow 
                merchantApplication={selectedApplication}
                onClose={handleCloseApplicationFlow}
              />
            </div>
          </div>
        )}
        {declineRemoveDialog.open && (
          <DeclineRemoveDialog
            open={declineRemoveDialog.open}
            onOpenChange={(open) => 
              setDeclineRemoveDialog({ open, action: open ? declineRemoveDialog.action : null })
            }
            action={declineRemoveDialog.action || "declined"}
            onSubmit={processDeclineRemove}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ApplicationsList;
