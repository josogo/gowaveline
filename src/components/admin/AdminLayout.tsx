
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  FileText, 
  Mail, 
  DollarSign, 
  LogOut,
  Menu, 
  X,
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  React.useEffect(() => {
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
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission Tracking', path: '/admin/commission-tracking' }
  ];

  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
            alt="Waveline Logo" 
            className="h-10"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <span className="ml-4 text-xl font-semibold text-[#0EA5E9]">Admin Portal</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <span>{adminUser.name || adminUser.email}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <span className="text-lg font-semibold">Menu</span>
                </div>
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item, index) => {
                    const isActive = window.location.pathname === item.path;
                    return (
                      <Button 
                        key={index} 
                        variant="ghost" 
                        className={`justify-start ${isActive ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : ''}`}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-auto py-4">
                  <Button 
                    variant="ghost" 
                    className="text-red-500 w-full justify-start"
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
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Desktop Only */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = window.location.pathname === item.path;
              return (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className={`w-full justify-start ${isActive ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </aside>
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
