
import { useState, useCallback, useEffect } from "react";

export function useApplicationProgress(merchantApplication: any) {
  const [applicationProgress, setApplicationProgress] = useState(
    merchantApplication?.application_data?.progress || 0
  );
  const [activeTab, setActiveTab] = useState(
    merchantApplication?.application_data?.currentTab || 'business'
  );

  useEffect(() => {
    if (merchantApplication) {
      setApplicationProgress(merchantApplication.application_data?.progress || 0);
      setActiveTab(merchantApplication.application_data?.currentTab || 'business');
    }
  }, [merchantApplication]);

  return { applicationProgress, setApplicationProgress, activeTab, setActiveTab };
}
