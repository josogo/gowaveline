
import { useCallback } from 'react';
import { useApplicationTabs } from './useApplicationTabs';
import { UseFormReturn } from 'react-hook-form';

export const useApplicationNavigation = (
  form: UseFormReturn<any>,
  updateFormData: (data: any) => void,
  saveApplicationData: () => void,
  setActiveTab: (tab: string) => void,
  setApplicationProgress: (progress: number) => void
) => {
  const tabs = useApplicationTabs();

  const handleTabChange = useCallback((tabId: string) => {
    // Always save the current form values before changing tabs
    const currentFormValues = form.getValues();
    console.log("Saving data before tab change. Current values:", currentFormValues);
    
    // Set currentTab in the form values to help track position
    currentFormValues.currentTab = tabId;
    
    // Update the formData state with current form values
    updateFormData(currentFormValues);
    
    // Force save to storage/backend
    saveApplicationData();
    
    // Change tab after saving
    setActiveTab(tabId);
    
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const progressPerStep = 100 / tabs.length;
    const newProgress = Math.ceil((newTabIndex + 1) * progressPerStep);
    setApplicationProgress(newProgress);
  }, [form, updateFormData, saveApplicationData, setActiveTab, setApplicationProgress, tabs]);

  const navigateTab = useCallback((direction: 'next' | 'prev') => {
    const activeTab = form.getValues('currentTab') || tabs[0].id;
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    // Always get latest form values 
    const currentFormValues = form.getValues();
    console.log(`Navigating ${direction}, current tab: ${activeTab}, index: ${currentTabIndex}, values:`, currentFormValues);
    
    // Store the current tab in form values
    currentFormValues.currentTab = activeTab;
    
    // Update formData and ensure it's saved
    updateFormData(currentFormValues);
    saveApplicationData();
    
    if (direction === 'next' && currentTabIndex < tabs.length - 1) {
      const nextTab = tabs[currentTabIndex + 1].id;
      handleTabChange(nextTab);
    } else if (direction === 'prev' && currentTabIndex > 0) {
      const prevTab = tabs[currentTabIndex - 1].id;
      handleTabChange(prevTab);
    }
  }, [form, updateFormData, saveApplicationData, handleTabChange, tabs]);

  return {
    handleTabChange,
    navigateTab
  };
};
