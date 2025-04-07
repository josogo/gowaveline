
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  FileText, 
  Mail, 
  DollarSign, 
  BookOpen,
  Phone,
  Settings,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, X } from 'lucide-react';

interface AdminSidebarProps {
  adminUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminUser,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isActive,
  handleLogout
}) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <BarChart className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Team Management', path: '/admin/team-management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals', path: '/admin/deals' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail Integration', path: '/admin/gmail-integration' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Calendar Integration', path: '/admin/calendar-integration' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission Tracking', path: '/admin/commission-tracking' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Training Hub', path: '/admin/training-hub' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contacts', path: '/admin/contacts' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' }
  ];

  const notifications = [
    { id: 1, title: 'New deal submitted', description: 'John Smith added a new deal', time: '10 min ago', unread: true },
    { id: 2, title: 'Commission payout processed', description: 'April commissions have been processed', time: '2 hours ago', unread: true },
    { id: 3, title: 'Team meeting reminder', description: 'Weekly team meeting at 3:00 PM', time: '5 hours ago', unread: false },
    { id: 4, title: 'New training module available', description: 'Check out our latest payment processing guide', time: 'Yesterday', unread: false },
  ];

  // Desktop sidebar
  const DesktopSidebar = (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto sticky top-[73px] h-[calc(100vh-73px)]">
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <Button 
              key={index} 
              variant={active ? "secondary" : "ghost"}
              className={`w-full justify-start ${active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );

  // Mobile sidebar sheet content
  const MobileSidebar = (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={adminUser.profilePicture} alt={adminUser.name} />
              <AvatarFallback className="bg-[#0EA5E9] text-white">
                {adminUser.name?.charAt(0) || adminUser.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{adminUser.name}</p>
              <p className="text-sm text-muted-foreground">{adminUser.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="main">Navigation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications (2)</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'main' ? (
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Button 
                  key={index} 
                  variant={active ? "secondary" : "ghost"}
                  className={`w-full justify-start ${active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs text-[#0EA5E9]">
                Mark all as read
              </Button>
            </div>
            
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg ${notification.unread ? 'bg-[#0EA5E9]/5 border-l-2 border-[#0EA5E9]' : 'bg-white border border-gray-100'}`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm mt-1">{notification.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {DesktopSidebar}
      {sidebarOpen && <div className="md:hidden">{MobileSidebar}</div>}
    </>
  );
};

export default AdminSidebar;
