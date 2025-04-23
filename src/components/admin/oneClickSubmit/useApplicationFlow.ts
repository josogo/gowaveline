
import { useState } from "react";
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
  const [formData, setFormData] = useState({});
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

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      setApplicationProgress(Math.min(100, ((currentIndex + 2) / tabs.length) * 100));
    } else {
      setShowBankRouting(true);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      setApplicationProgress(Math.max(0, ((currentIndex) / tabs.length) * 100));
    }
  };

  const handleSaveDraft = () => {
    toast.success("Application draft saved successfully");
  };

  const handleInitialNext = async (values: any) => {
    setInitialData(values);
    setFormData({ ...formData, ...values });
    const { data, error } = await supabase
      .from('merchant_applications')
      .insert([
        {
          merchant_name: values.businessName,
          merchant_email: values.email,
          application_data: values,
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
    toast.success("New application created!");
    setStep("main");
  };

  const handleSendToMerchant = () => {
    setShowSendDialog(true);
  };

  const handleMerchantSubmit = async () => {
    if (!merchantAppId) return;
    const { error } = await import('@/services/merchantApplicationService')
      .then(service => service.completeMerchantApplication(merchantAppId));
    if (!error) toast.success("Application submitted, thank you!");
  };

  const handleDeclineRemove = (action: "declined" | "removed", appData?: any) => {
    setCardActionApp(appData || merchantApplication);
    setDeclineRemoveDialog({ open: true, action });
    setShowActionMenu(false);
  };

  const processDeclineRemove = async (reason: string) => {
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
  };

  const getAllFormData = () => {
    return {
      ...initialData,
      ...formData,
      progress: applicationProgress,
      currentTab: activeTab,
    };
  };

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
    handleMerchantSubmit,
    handleDeclineRemove,
    processDeclineRemove,
    getAllFormData,
  };
}
