
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useApplicationFlow(merchantApplication: any) {
  const [step, setStep] = useState<"init" | "main">(
    merchantApplication ? "main" : "init"
  );
  const [initialData, setInitialData] = useState<any>(
    merchantApplication ? merchantApplication.application_data : null
  );
  const [activeTab, setActiveTab] = useState(merchantApplication?.currentTab || 'business');
  const [applicationProgress, setApplicationProgress] = useState(
    merchantApplication?.progress || 0
  );
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [formData, setFormData] = useState(merchantApplication?.application_data || {});
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [merchantAppId, setMerchantAppId] = useState(merchantApplication?.id);
  const [declineRemoveDialog, setDeclineRemoveDialog] = useState<{
    open: boolean;
    action: null | "declined" | "removed";
  }>({ open: false, action: null });
  const [cardActionApp, setCardActionApp] = useState<any>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const tabs = [
    { id: 'business', label: 'Business' },
    { id: 'ownership', label: 'Owners' },
    { id: 'operations', label: 'Operations' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'financial', label: 'Financial' },
    { id: 'processing', label: 'Processing' },
    { id: 'documents', label: 'Documents' },
  ];

  // Update form data with the current tab's data
  const updateFormData = useCallback((tabData: any) => {
    setFormData(prevData => ({
      ...prevData,
      ...tabData
    }));
  }, []);

  // Save the current form data to the database
  const saveApplicationData = useCallback(async () => {
    if (!merchantAppId) return false;
    
    try {
      console.log("Saving application data:", formData);
      
      const applicationData = {
        ...formData,
        progress: applicationProgress,
        currentTab: activeTab,
      };
      
      const { error } = await supabase
        .from('merchant_applications')
        .update({
          application_data: applicationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantAppId);
      
      if (error) {
        console.error("Error saving application data:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in saveApplicationData:", error);
      return false;
    }
  }, [merchantAppId, formData, applicationProgress, activeTab]);

  // Save data when navigating between tabs
  useEffect(() => {
    if (merchantAppId) {
      saveApplicationData();
    }
  }, [activeTab, merchantAppId, saveApplicationData]);

  const handleNext = useCallback(async () => {
    // Save current tab data before moving to next tab
    const saved = await saveApplicationData();
    if (!saved) {
      toast.error("Failed to save your progress. Please try again.");
      return;
    }
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      setApplicationProgress(Math.min(100, ((currentIndex + 2) / tabs.length) * 100));
    } else {
      setShowBankRouting(true);
    }
  }, [activeTab, tabs, saveApplicationData, setActiveTab, setApplicationProgress, setShowBankRouting]);

  const handlePrevious = useCallback(async () => {
    // Save current tab data before moving to previous tab
    const saved = await saveApplicationData();
    if (!saved) {
      toast.error("Failed to save your progress. Please try again.");
      return;
    }
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      setApplicationProgress(Math.max(0, ((currentIndex) / tabs.length) * 100));
    }
  }, [activeTab, tabs, saveApplicationData, setActiveTab, setApplicationProgress]);

  const handleSaveDraft = useCallback(async () => {
    const saved = await saveApplicationData();
    if (saved) {
      toast.success("Application draft saved successfully");
    } else {
      toast.error("Failed to save application draft. Please try again.");
    }
  }, [saveApplicationData]);

  const handleInitialNext = useCallback(async (values: any) => {
    try {
      setInitialData(values);
      setFormData({ 
        business: values,  // Store initial data in the business tab
      });
      
      const { data, error } = await supabase
        .from('merchant_applications')
        .insert([
          {
            merchant_name: values.businessName,
            merchant_email: values.email,
            application_data: {
              business: values,
              progress: 14, // Initial progress (1/7 tabs)
              currentTab: 'business'
            },
            completed: false,
            otp: (Math.floor(100000 + Math.random() * 900000)).toString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        toast.error("Failed to create application. Please try again.");
        return;
      }
      
      setMerchantAppId(data.id);
      setApplicationProgress(14); // Set initial progress
      toast.success("New application created!");
      setStep("main");
    } catch (error) {
      console.error("Error in handleInitialNext:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }, [setInitialData, setFormData, setMerchantAppId, setStep, setApplicationProgress]);

  const handleSendToMerchant = useCallback(() => {
    saveApplicationData().then(saved => {
      if (saved) {
        setShowSendDialog(true);
      } else {
        toast.error("Failed to save application before sending. Please try again.");
      }
    });
  }, [saveApplicationData, setShowSendDialog]);

  const handleMerchantSubmit = useCallback(async () => {
    if (!merchantAppId) return;
    try {
      // First save any pending changes
      await saveApplicationData();
      
      const { error } = await import('@/services/merchantApplicationService')
        .then(service => service.completeMerchantApplication(merchantAppId));
      if (!error) {
        toast.success("Application submitted, thank you!");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleMerchantSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }, [merchantAppId, saveApplicationData]);

  const handleDeclineRemove = useCallback((action: "declined" | "removed", appData?: any) => {
    setCardActionApp(appData || merchantApplication);
    setDeclineRemoveDialog({ open: true, action });
    setShowActionMenu(false);
  }, [merchantApplication, setCardActionApp, setDeclineRemoveDialog, setShowActionMenu]);

  const processDeclineRemove = useCallback(async (reason: string) => {
    const app = cardActionApp || merchantApplication;
    try {
      const { error: updateError } = await supabase
        .from("merchant_applications")
        .update({
          status: declineRemoveDialog.action,
          action_reason: reason,
          actioned_by: "admin",
          actioned_at: new Date().toISOString(),
        })
        .eq("id", app.id);

      const { error: logError } = await supabase
        .from("applications_action_log")
        .insert({
          application_id: app.id,
          action: declineRemoveDialog.action,
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
    } catch (e: any) {
      toast.error(e.message || "Failed, please try again.");
    }
  }, [cardActionApp, merchantApplication, declineRemoveDialog, setDeclineRemoveDialog]);

  const getAllFormData = useCallback(() => {
    return {
      ...formData,
      progress: applicationProgress,
      currentTab: activeTab,
    };
  }, [formData, applicationProgress, activeTab]);

  return {
    step,
    setStep,
    initialData,
    setInitialData,
    activeTab,
    setActiveTab,
    applicationProgress,
    setApplicationProgress,
    showBankRouting,
    setShowBankRouting,
    formData,
    setFormData,
    updateFormData,
    showSendDialog,
    setShowSendDialog,
    merchantAppId,
    setMerchantAppId,
    declineRemoveDialog,
    setDeclineRemoveDialog,
    cardActionApp,
    setCardActionApp,
    showActionMenu,
    setShowActionMenu,
    tabs,
    handleNext,
    handlePrevious,
    handleSaveDraft,
    handleInitialNext,
    handleSendToMerchant,
    handleMerchantSubmit: handleMerchantSubmit || (() => {}),
    handleDeclineRemove: handleDeclineRemove || (() => {}),
    processDeclineRemove: processDeclineRemove || (() => {}),
    getAllFormData,
    saveApplicationData,
  };
}
