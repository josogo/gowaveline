
import React, { useState, Suspense, lazy } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApplicationFilters } from './ApplicationFilters';
import { useApplications } from './hooks/useApplications';
import { ApplicationsGrid } from './ApplicationsGrid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Lazy load the dialog components to reduce initial bundle size
const ApplicationDialog = lazy(() => import('./ApplicationDialog')
  .then(module => ({ default: module.ApplicationDialog })));

const DeclineRemoveDialog = lazy(() => import('./DeclineRemoveDialog'));

export const ApplicationsList: React.FC = () => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{
    open: boolean;
    action: null | "declined" | "removed";
  }>({ open: false, action: null });

  const {
    loading,
    filteredApplications,
    applications,
    handleFilterChange,
    fetchApplications,
  } = useApplications();

  const handleOpenApplication = async (app: any) => {
    try {
      // Fetch the latest application data from the database
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
          setSelectedApplication(data);
          setDialogOpen(true);
          return;
        }
      }
      
      // If we're here, either there was no ID or we didn't find data
      setSelectedApplication(app.rawData || app);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to load application details");
      
      // Fall back to the passed app data
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
        return;
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
      // Refresh the applications list
      fetchApplications();
      
    } catch (e: any) {
      toast.error(e.message || "Failed, please try again.");
    }
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
