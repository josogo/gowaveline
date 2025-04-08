
import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet } from '@/components/ui/sheet';
import {
  AdminHeader,
  AdminSidebar,
  MobileNavigation,
  NotificationsPanel,
  SheetSidebar
} from './layout';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('main');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userJson = localStorage.getItem('adminUser');

    if (!token || !userJson) {
      toast.error('Please log in to access the admin dashboard');
      navigate('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      setAdminUser(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader 
        adminUser={adminUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isMobile={isMobile}
        handleLogout={handleLogout}
      />
      
      {isMobile && (
        <NotificationsPanel 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications} 
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <div className="md:w-60 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetSidebar 
            adminUser={adminUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isActive={isActive}
            handleLogout={handleLogout}
          />
        </Sheet>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 mb-16 md:mb-0 md:ml-0">
          {children}
        </main>
      </div>
      
      <MobileNavigation handleLogout={handleLogout} isActive={isActive} />
    </div>
  );
};

export default AdminLayout;
