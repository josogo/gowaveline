
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Mail, 
  DollarSign,
  Scroll,
  ContactIcon,
  Settings,
  Building,
  FileArchive,
  SendToBack,
  Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCrmNavigation } from '@/hooks/use-crm-navigation';

// Change from a default export to a named export
export const AdminSidebar = () => {
  const location = useLocation();
  const crmNav = useCrmNavigation();

  // Define navigation items
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Team', href: '/admin/team-management', icon: Users },
    { name: 'Deals', href: '/admin/deals', icon: FileText },
    { name: 'Calendar', href: '/admin/calendar-integration', icon: Calendar },
    { name: 'Emails', href: '/admin/gmail-integration', icon: Mail },
    { name: 'Commissions', href: '/admin/commission-tracking', icon: DollarSign },
    { name: 'Training', href: '/admin/training-hub', icon: Scroll },
    { name: 'Contacts', href: '/admin/contacts', icon: ContactIcon },
    { name: 'One Click Submit', href: '/admin/one-click-submit', icon: SendToBack },
    { name: 'Marketing Materials', href: '/admin/marketing-materials', icon: Megaphone },
    { name: 'Industries', href: '/admin/industry-documents', icon: Building },
    { name: 'Documents', href: '/admin/documents', icon: FileArchive },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="h-full md:h-screen w-60 flex-col border-r border-gray-200 bg-white px-6 overflow-y-auto">
      <div className="flex h-30 shrink-0 items-center justify-center">
        <Link to="/admin/dashboard">
          <img
            className="h-40 w-auto"
            src="/lovable-uploads/1e017aad-3d36-4922-992f-f27b55733ec4.png"
            alt="Waveline"
          />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                          'h-5 w-5 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto pb-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <a href="/">
                <span>Back to Website</span>
              </a>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
