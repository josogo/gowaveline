
import React from 'react';
import { useApplicationFlow } from './hooks/useApplicationFlow';
import { LoadingState } from './components/LoadingState';
import { SendToMerchantDialog } from './SendToMerchantDialog';
import { ApplicationContentWrapper } from './components/ApplicationContentWrapper';
import BankRoutingSystem from './bankRouting/BankRoutingSystem';

export type ApplicationFlowProps = {
  merchantApplication?: any;
  readOnly?: boolean;
  onClose?: () => void;
};

export const ApplicationFlow: React.FC<ApplicationFlowProps> = ({ 
  merchantApplication, 
  readOnly = false,
  onClose
}) => {
  const {
    // State
    showSendDialog,
    setShowSendDialog,
    showBankRouting,
    setShowBankRouting,
    isSaving,
    isClosing,
    isLoading,
    
    // Form and data
    form,
    formData,
    
    // UI state
    activeTab,
    applicationProgress,
    
    // Application data
    lastEdited,
    applicationNumber,
    
    // Actions and handlers
    handleClose,
    handleTabChange,
    navigateTab,
    handleSendToMerchant,
    handleBankRouting
  } = useApplicationFlow(merchantApplication, onClose);

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <ApplicationContentWrapper 
        form={form}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        applicationProgress={applicationProgress}
        isSaving={isSaving}
        lastEdited={lastEdited}
        applicationNumber={applicationNumber}
        handleClose={handleClose}
        navigateTab={navigateTab}
        handleSendToMerchant={handleSendToMerchant}
        handleBankRouting={handleBankRouting}
        readOnly={readOnly || isClosing}
      />
      
      <SendToMerchantDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        applicationId={merchantApplication?.id}
        applicationData={formData}
        merchantEmail={merchantApplication?.merchant_email}
        merchantName={merchantApplication?.merchant_name}
      />
    </>
  );
};

export default ApplicationFlow;
