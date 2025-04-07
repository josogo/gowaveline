
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationsPanelProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  showNotifications, 
  setShowNotifications
}) => {
  const notifications = [
    { id: 1, title: 'New deal submitted', description: 'John Smith added a new deal', time: '10 min ago', unread: true },
    { id: 2, title: 'Commission payout processed', description: 'April commissions have been processed', time: '2 hours ago', unread: true },
    { id: 3, title: 'Team meeting reminder', description: 'Weekly team meeting at 3:00 PM', time: '5 hours ago', unread: false },
    { id: 4, title: 'New training module available', description: 'Check out our latest payment processing guide', time: 'Yesterday', unread: false },
  ];

  if (!showNotifications) return null;

  return (
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
  );
};

export default NotificationsPanel;
