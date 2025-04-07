
import React from 'react';
import { SheetContent } from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';

interface SheetSidebarProps {
  adminUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}

const SheetSidebar: React.FC<SheetSidebarProps> = ({
  adminUser,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isActive,
  handleLogout
}) => {
  return (
    <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
      <AdminSidebar 
        adminUser={adminUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isActive={isActive}
        handleLogout={handleLogout}
      />
    </SheetContent>
  );
};

export default SheetSidebar;
