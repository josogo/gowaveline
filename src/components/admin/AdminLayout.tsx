
import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  FileText, 
  Mail, 
  DollarSign, 
  LogOut,
  Menu, 
  X,
  ChevronDown,
  BookOpen,
  Phone,
  Settings,
  SlidersHorizontal,
  Home,
  Bell,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useCrmNavigation } from '@/hooks/use-crm-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const crmNav = useCrmNavigation();
  const isMobile = useIsMobile();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('main');

  useEffect(() => {
    // Check if user is logged in
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

  // Close sidebar when route changes
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

  const navItems = [
    { icon: <BarChart className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Team Management', path: '/admin/team-management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals', path: '/admin/deals' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail Integration', path: '/admin/gmail-integration' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission Tracking', path: '/admin/commission-tracking' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Training Hub', path: '/admin/training-hub' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contacts', path: '/admin/contacts' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' }
  ];

  // Enhanced mobile navigation items with more descriptive labels
  const mobileNavItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Team', path: '/admin/team-management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals', path: '/admin/deals' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Training', path: '/admin/training-hub' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail', path: '/admin/gmail-integration' },
  ];

  const moreNavItems = [
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission', path: '/admin/commission-tracking' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contacts', path: '/admin/contacts' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' }
  ];
  
  // Mock notifications for UI purposes
  const notifications = [
    { id: 1, title: 'New deal submitted', description: 'John Smith added a new deal', time: '10 min ago', unread: true },
    { id: 2, title: 'Commission payout processed', description: 'April commissions have been processed', time: '2 hours ago', unread: true },
    { id: 3, title: 'Team meeting reminder', description: 'Weekly team meeting at 3:00 PM', time: '5 hours ago', unread: false },
    { id: 4, title: 'New training module available', description: 'Check out our latest payment processing guide', time: 'Yesterday', unread: false },
  ];
  
  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
            alt="Waveline Logo" 
            className="h-8 md:h-10"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <span className="ml-3 md:ml-4 text-lg md:text-xl font-semibold text-[#0EA5E9]">Admin</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notifications for mobile */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </div>
            </Button>
          )}
          
          {/* User dropdown - desktop */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={adminUser.profilePicture} alt={adminUser.name} />
                    <AvatarFallback className="bg-[#0EA5E9] text-white">
                      {adminUser.name?.charAt(0) || adminUser.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{adminUser.name || adminUser.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="px-2 py-2 border-b border-gray-100">
                  <p className="font-medium">{adminUser.name}</p>
                  <p className="text-sm text-muted-foreground">{adminUser.email}</p>
                </div>
                
                {/* Desktop notifications preview */}
                <div className="max-h-60 overflow-auto py-1">
                  {notifications.slice(0, 3).map(notification => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start px-3 py-2 cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{notification.title}</span>
                        {notification.unread && <Badge className="h-2 w-2 rounded-full bg-red-500 p-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuItem className="text-[#0EA5E9] text-center cursor-pointer">
                    View all notifications
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
              <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b">
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
                </div>
                
                {/* Tabs for mobile sidebar */}
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
                          <p className="text-xs mt-1">{notification.description}</p>
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
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Full-screen mobile notifications panel */}
      {isMobile && showNotifications && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex justify-between mb-4">
            <Button variant="ghost" size="sm" className="text-xs text-[#0EA5E9]">
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
          
          <div className="space-y-3 overflow-auto max-h-[calc(100vh-130px)]">
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
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Desktop Only */}
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
        
        {/* Bottom Nav Bar - Mobile Only - Enhanced with labels and better spacing */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around z-30 md:hidden">
          {mobileNavItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Button 
                key={index}
                variant="ghost"
                className={`flex flex-col items-center py-1 h-auto ${active ? 'text-[#0EA5E9]' : 'text-gray-500'}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="text-[10px] mt-1">{item.label}</span>
              </Button>
            );
          })}
          
          {/* More menu for additional items */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-1 h-auto text-gray-500"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="text-[10px] mt-1">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              {moreNavItems.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <DropdownMenuItem 
                    key={index}
                    className={`cursor-pointer ${active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 mb-16 md:mb-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
