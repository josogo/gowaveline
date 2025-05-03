
import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationContent } from './ApplicationContent';
import { NavigationControls } from './NavigationControls';
import { useApplicationTabs } from '../hooks/useApplicationTabs';

interface ApplicationContentWrapperProps {
  form: UseFormReturn<any>;
  activeTab: string;
  handleTabChange: (tabId: string) => void;
  applicationProgress: number;
  isSaving: boolean;
  lastEdited: string;
  applicationNumber: string;
  handleClose: () => void;
  navigateTab: (direction: 'next' | 'prev') => void;
  handleSendToMerchant: () => void;
  handleBankRouting: () => void;
  readOnly: boolean;
}

export const ApplicationContentWrapper: React.FC<ApplicationContentWrapperProps> = ({
  form,
  activeTab,
  handleTabChange,
  applicationProgress,
  isSaving,
  lastEdited,
  applicationNumber,
  handleClose,
  navigateTab,
  handleSendToMerchant,
  handleBankRouting,
  readOnly
}) => {
  const tabs = useApplicationTabs();
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all">
      <div className="h-[90vh] overflow-y-auto p-4 md:p-8">
        <ApplicationHeader 
          onClose={handleClose} 
          progress={applicationProgress} 
          isSaving={isSaving}
          lastEdited={lastEdited}
          applicationNumber={applicationNumber}
        />
        
        <FormProvider {...form}>
          <ApplicationContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          
          <NavigationControls
            currentTabIndex={tabs.findIndex(tab => tab.id === activeTab)}
            totalTabs={tabs.length}
            onNavigate={navigateTab}
            onSendToMerchant={handleSendToMerchant}
            onBankRouting={handleBankRouting}
            readOnly={readOnly}
          />
        </FormProvider>
      </div>
    </div>
  );
};
