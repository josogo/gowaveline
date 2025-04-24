
import { useState } from 'react';

export const useActionMenu = () => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  return {
    showActionMenu,
    setShowActionMenu,
    selectedApplication,
    setSelectedApplication
  };
};
