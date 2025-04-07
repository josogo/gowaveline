
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface AdminHeaderProps {
  adminUser: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isMobile: boolean;
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminUser,
  sidebarOpen,
  setSidebarOpen,
  showNotifications,
  setShowNotifications,
  isMobile,
  handleLogout
}) => {
  const navigate = useNavigate();
  
  const notifications = [
    { id: 1, title: 'New deal submitted', description: 'John Smith added a new deal', time: '10 min ago', unread: true },
    { id: 2, title: 'Commission payout processed', description: 'April commissions have been processed', time: '2 hours ago', unread: true },
    { id: 3, title: 'Team meeting reminder', description: 'Weekly team meeting at 3:00 PM', time: '5 hours ago', unread: false },
    { id: 4, title: 'New training module available', description: 'Check out our latest payment processing guide', time: 'Yesterday', unread: false },
  ];

  return (
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
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
    </header>
  );
};

export default AdminHeader;
