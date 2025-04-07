
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, FileText, Calendar, Mail, SlidersHorizontal, LogOut, DollarSign, Phone, Settings, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MobileNavigationProps {
  handleLogout: () => void;
  isActive: (path: string) => boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ handleLogout, isActive }) => {
  const navigate = useNavigate();

  const mobileNavItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Team', path: '/admin/team-management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals', path: '/admin/deals' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Calendar', path: '/admin/calendar-integration' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail', path: '/admin/gmail-integration' },
  ];

  const moreNavItems = [
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission', path: '/admin/commission-tracking' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contacts', path: '/admin/contacts' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Industries', path: '/admin/industry-documents' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' }
  ];

  return (
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
  );
};

export default MobileNavigation;
