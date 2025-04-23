
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessDetailsForm } from './forms/BusinessDetailsForm';
import { OwnershipForm } from './forms/OwnershipForm';
import { OperationalDetailsForm } from './forms/OperationalDetailsForm';
import { MarketingForm } from './forms/MarketingForm';
import { FinancialInfoForm } from './forms/FinancialInfoForm';
import { ProcessingInfoForm } from './forms/ProcessingInfoForm';
import { DocumentsForm } from './forms/DocumentsForm';
import { MerchantInitialForm } from './forms/MerchantInitialForm';
import { SendToMerchantDialog } from './SendToMerchantDialog';
import DeclineRemoveDialog from "./DeclineRemoveDialog";
import { BankRoutingSystem } from './BankRoutingSystem';
import { ArrowRight, ArrowLeft, CheckCircle, Save, SendHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useApplicationFlow } from './useApplicationFlow';
import { ApplicationActionMenu } from './ApplicationActionMenu';
import { ApplicationProgressBar } from './ApplicationProgressBar';

interface ApplicationFlowProps {
  merchantApplication?: any;
  onClose?: () => void;
}

export const ApplicationFlow: React.FC<ApplicationFlowProps> = ({
  merchantApplication,
  onClose
}) => {
  const flow = useApplicationFlow(merchantApplication);

  if (flow.showBankRouting) {
    return <BankRoutingSystem onBack={() => flow.setShowBankRouting(false)} />;
  }

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Application</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-1" /> Close
          </Button>
        </div>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <ApplicationProgressBar progress={flow.applicationProgress} />
          </div>

          {merchantApplication && (
            <div className="flex justify-end mb-2">
              <ApplicationActionMenu
                merchantApplication={merchantApplication}
                showActionMenu={flow.showActionMenu}
                setShowActionMenu={flow.setShowActionMenu}
                handleDeclineRemove={flow.handleDeclineRemove}
              />
            </div>
          )}

          {!merchantApplication && flow.step === "init" ? (
            <MerchantInitialForm onNext={flow.handleInitialNext} />
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
                value={flow.activeTab}
                onValueChange={(value) => {
                  // Save data before changing tabs
                  flow.saveApplicationData().then(() => {
                    flow.setActiveTab(value);
                  });
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-7 w-full mb-6">
                  {flow.tabs.map(tab => (
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
                  onClick={flow.handlePrevious}
                  disabled={flow.activeTab === 'business'}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={flow.handleSendToMerchant}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                  >
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    Send to Merchant
                  </Button>
                
                  <Button variant="outline" onClick={flow.handleSaveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button onClick={flow.handleNext}>
                    {flow.activeTab === 'documents' ? (
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
        open={flow.showSendDialog}
        onOpenChange={flow.setShowSendDialog}
        applicationData={flow.getAllFormData()}
      />

      <DeclineRemoveDialog
        open={!!flow.declineRemoveDialog.action}
        onOpenChange={open =>
          flow.setDeclineRemoveDialog({ open, action: open ? flow.declineRemoveDialog.action : null })
        }
        action={flow.declineRemoveDialog.action || "declined"}
        onSubmit={flow.processDeclineRemove}
      />
    </div>
  );
};

export default ApplicationFlow;
