
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, FileText, Calendar, Mail, LogOut, DollarSign, Phone, Settings, Briefcase, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Team', path: '/admin/team-management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals', path: '/admin/deals' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Calendar', path: '/admin/calendar-integration' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail', path: '/admin/gmail-integration' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission', path: '/admin/commission-tracking' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Training', path: '/admin/training-hub' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contacts', path: '/admin/contacts' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Industries', path: '/admin/industry-documents' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={adminUser.profilePicture} />
            <AvatarFallback className="bg-[#0EA5E9] text-white">
              {adminUser.name?.charAt(0) || adminUser.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{adminUser.name}</div>
            <div className="text-sm text-muted-foreground">{adminUser.email}</div>
          </div>
        </div>
      </div>
      
      <nav className="p-2 flex-1">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start ${active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
      
      <div className="p-3 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
