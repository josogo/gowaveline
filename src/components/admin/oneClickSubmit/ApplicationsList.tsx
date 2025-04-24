
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApplicationFilters } from './ApplicationFilters';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    error,
    filteredApplications,
    applications,
    handleFilterChange,
    fetchApplications,
  } = useApplications();
  
  useEffect(() => {
    if (openAppId) {
      const fetchAndOpenApplication = async () => {
        try {
          console.log("Fetching application with ID:", openAppId);
          const { data, error } = await supabase
            .from('merchant_applications')
            .select('*')
            .eq('id', openAppId)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching application:", error);
            throw error;
          }
          
          if (data) {
            console.log("Successfully fetched application:", data.id);
            setSelectedApplication(data);
            setAppFlowOpen(true);
          } else {
            console.error("Application not found with ID:", openAppId);
            toast.error("Application not found");
          }
        } catch (error) {
          console.error("Error fetching application:", error);
          toast.error("Failed to load application details");
        }
      };
      
      fetchAndOpenApplication();
      
      // Clean up URL parameter after attempting to fetch
      const url = new URL(window.location.href);
      url.searchParams.delete('openApp');
      window.history.replaceState({}, '', url);
    }
  }, [openAppId]);

  const handleOpenApplication = async (app: any) => {
    try {
      if (app.id) {
        console.log("Fetching detailed application data for:", app.id);
        const { data, error } = await supabase
          .from('merchant_applications')
          .select('*')
          .eq('id', app.id)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error fetching application details:", error);
          throw error;
        }
        
        if (data) {
          console.log("Opening application with data:", data);
          setSelectedApplication(data);
          setAppFlowOpen(true);
          return;
        } else {
          console.warn("No data returned for application ID:", app.id);
        }
      }
      
      console.log("Using provided application data:", app);
      setSelectedApplication(app.rawData || app);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to load application details");
      
      // Fallback to using whatever data we have
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

      if (declineRemoveDialog.action === "removed") {
        // Delete the application completely
        const { error: deleteError } = await supabase
          .from("merchant_applications")
          .delete()
          .eq("id", appId);

        if (deleteError) {
          throw new Error(deleteError.message);
        }

        toast.success("Application removed successfully");
      } else {
        // Handle decline action
        const { error: updateError } = await supabase
          .from("merchant_applications")
          .update({
            status: declineRemoveDialog.action,
            action_reason: reason,
            actioned_by: "admin",
            actioned_at: new Date().toISOString(),
          })
          .eq("id", appId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        toast.success("Application declined and logged");
      }

      // Log the action
      const { error: logError } = await supabase
        .from("applications_action_log")
        .insert({
          application_id: appId,
          action: declineRemoveDialog.action || '',
          reason,
          actioned_by: "admin",
          actioned_at: new Date().toISOString(),
        });

      if (logError) {
        console.error("Error logging action:", logError);
      }
      
      setDeclineRemoveDialog({ open: false, action: null });
      fetchApplications();
      
    } catch (e: any) {
      console.error("Error processing action:", e);
      toast.error(e.message || "Failed, please try again.");
    }
    return Promise.resolve();
  };

  const handleCloseApplicationFlow = () => {
    setAppFlowOpen(false);
    fetchApplications();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error loading applications</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchApplications()}
            className="self-start flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

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
