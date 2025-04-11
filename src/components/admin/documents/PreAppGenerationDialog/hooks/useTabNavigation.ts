
import { useState } from 'react';

export type TabId = 'structure' | 'business' | 'principal' | 'banking' | 'volume' | 'policies' | 'ecommerce';

/**
 * Custom hook for managing tab navigation in multi-step forms
 */
export const useTabNavigation = (initialTab: TabId = 'structure') => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // This function handles the type conversion from string to TabId
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  const goToNextTab = () => {
    if (activeTab === 'structure') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('ecommerce');
  };

  const goToPrevTab = () => {
    if (activeTab === 'ecommerce') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('structure');
  };

  return {
    activeTab,
    setActiveTab,
    handleTabChange, // New function for the Tabs component
    goToNextTab,
    goToPrevTab
  };
};
