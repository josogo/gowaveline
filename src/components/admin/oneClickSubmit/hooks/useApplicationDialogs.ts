
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useApplicationDialogs = (refetchApplications: () => void) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appFlowOpen, setAppFlowOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{
    open: boolean;
    action: null | "declined" | "removed";
  }>({
    open: false,
    action: null,
  });

  const handleOpenApplication = (app: any) => {
    console.log('Opening application:', app.id);
    setSelectedApplication(app);
    setAppFlowOpen(true);
  };

  const handleCloseApplicationFlow = () => {
    console.log('Closing application flow');
    // Close the application flow with proper cleanup
    setAppFlowOpen(false);
    
    // Add a small delay before clearing the selected application
    // This prevents any state inconsistencies during transition
    setTimeout(() => {
      setSelectedApplication(null);
      // Refetch applications to ensure we have the latest data
      refetchApplications();
    }, 100);
  };

  const processDeclineRemove = async (reason: string) => {
    if (!selectedApplication || !declineRemoveDialog.action) return;
    
    try {
      const action = declineRemoveDialog.action;
      const status = action === "declined" ? "declined" : "removed";
      
      const { error } = await supabase.from("merchant_applications")
        .update({
          status,
          action_reason: reason,
          actioned_at: new Date().toISOString(),
          actioned_by: "admin" // In a real app, use the actual admin ID
        })
        .eq("id", selectedApplication.id);
      
      if (error) throw error;
      
      // Log the action
      await supabase.from("applications_action_log").insert({
        application_id: selectedApplication.id,
        action: status,
        reason,
        actioned_by: "admin" // In a real app, use the actual admin ID
      });
      
      toast.success(`Application ${action} successfully`);
      setDeclineRemoveDialog({ open: false, action: null });
      refetchApplications();
      
    } catch (error: any) {
      console.error(`Error ${declineRemoveDialog.action} application:`, error);
      toast.error(`Failed to ${declineRemoveDialog.action} application: ${error.message}`);
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    appFlowOpen,
    setAppFlowOpen,
    selectedApplication,
    setSelectedApplication,
    handleCloseApplicationFlow,
    declineRemoveDialog,
    setDeclineRemoveDialog,
    handleOpenApplication,
    processDeclineRemove
  };
};
