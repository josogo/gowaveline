import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessDetailsForm } from './forms/BusinessDetailsForm';
import { OwnershipForm } from './forms/OwnershipForm';
import { OperationalDetailsForm } from './forms/OperationalDetailsForm';
import { MarketingForm } from './forms/MarketingForm';
import { FinancialInfoForm } from './forms/FinancialInfoForm';
import { ProcessingInfoForm } from './forms/ProcessingInfoForm';
import { DocumentsForm } from './forms/DocumentsForm';
import { BankRoutingSystem } from './BankRoutingSystem';
import { ArrowRight, ArrowLeft, CheckCircle, Save, SendHorizontal, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { MerchantInitialForm } from './forms/MerchantInitialForm';
import { SendToMerchantDialog } from './SendToMerchantDialog';
import { supabase } from "@/integrations/supabase/client";
import DeclineRemoveDialog from "./DeclineRemoveDialog";

export const ApplicationFlow: React.FC<{ merchantApplication?: any }> = ({
  merchantApplication,
}) => {
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

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Merchant Application
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${applicationProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Application Progress</span>
              <span>{Math.round(applicationProgress)}%</span>
            </div>
          </div>

          {merchantApplication && (
            <div className="flex justify-end mb-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="More actions"
                  className="rounded-full"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                >
                  <MoreHorizontal />
                </Button>
                {showActionMenu && (
                  <div className="absolute right-0 mt-2 w-40 z-10 bg-white shadow-lg rounded border">
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-amber-50 text-amber-800"
                      onClick={() => handleDeclineRemove("declined", merchantApplication)}
                    >
                      Decline Application
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-700"
                      onClick={() => handleDeclineRemove("removed", merchantApplication)}
                    >
                      Remove Application
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-500"
                      onClick={() => setShowActionMenu(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!merchantApplication && step === "init" ? (
            <MerchantInitialForm onNext={handleInitialNext} />
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Complete Your Application
                </h2>
                <p className="text-gray-600">
                  Please review and complete all remaining fields below. When
                  finished, click submit.
                </p>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-7 w-full mb-6">
                  {tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="text-xs sm:text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="business">
                  <BusinessDetailsForm />
                </TabsContent>
                
                <TabsContent value="ownership">
                  <OwnershipForm />
                </TabsContent>
                
                <TabsContent value="operations">
                  <OperationalDetailsForm />
                </TabsContent>
                
                <TabsContent value="marketing">
                  <MarketingForm />
                </TabsContent>
                
                <TabsContent value="financial">
                  <FinancialInfoForm />
                </TabsContent>
                
                <TabsContent value="processing">
                  <ProcessingInfoForm />
                </TabsContent>
                
                <TabsContent value="documents">
                  <DocumentsForm />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={activeTab === 'business'}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSendToMerchant}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                  >
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    Send to Merchant
                  </Button>
                
                  <Button variant="outline" onClick={handleSaveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button onClick={handleNext}>
                    {activeTab === 'documents' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <SendToMerchantDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        applicationData={getAllFormData()}
      />

      <DeclineRemoveDialog
        open={!!declineRemoveDialog.action}
        onOpenChange={open =>
          setDeclineRemoveDialog({ open, action: open ? declineRemoveDialog.action : null })
        }
        action={declineRemoveDialog.action || "declined"}
        onSubmit={processDeclineRemove}
      />
    </div>
  );
};

export default ApplicationFlow;
