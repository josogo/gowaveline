
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useApplicationDialogs = (fetchApplications: () => void) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appFlowOpen, setAppFlowOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{
    open: boolean;
    action: null | "declined" | "removed";
  }>({ open: false, action: null });

  const handleCloseApplicationFlow = () => {
    setAppFlowOpen(false);
    fetchApplications();
  };

  const handleOpenApplication = async (app: any) => {
    try {
      if (app.id) {
        const { data, error } = await supabase
          .from('merchant_applications')
          .select('*')
          .eq('id', app.id)
          .maybeSingle();
        
        if (error) throw error;
        
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

  const processDeclineRemove = async (reason: string) => {
    if (!selectedApplication) return;
    
    try {
      const appId = selectedApplication.id || selectedApplication.rawData?.id;
      
      if (!appId) {
        toast.error("Invalid application data");
        return Promise.resolve();
      }

      if (declineRemoveDialog.action === "removed") {
        const { error: deleteError } = await supabase
          .from("merchant_applications")
          .delete()
          .eq("id", appId);

        if (deleteError) throw new Error(deleteError.message);
        toast.success("Application removed successfully");
      } else {
        const { error: updateError } = await supabase
          .from("merchant_applications")
          .update({
            status: declineRemoveDialog.action,
            action_reason: reason,
            actioned_by: "admin",
            actioned_at: new Date().toISOString(),
          })
          .eq("id", appId);

        if (updateError) throw new Error(updateError.message);
        toast.success("Application declined and logged");
      }

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
      toast.error(e.message || "Failed, please try again.");
    }
    return Promise.resolve();
  };

  return {
    dialogOpen,
    setDialogOpen,
    appFlowOpen,
    selectedApplication,
    handleCloseApplicationFlow,
    declineRemoveDialog,
    setDeclineRemoveDialog,
    handleOpenApplication,
    processDeclineRemove
  };
};
