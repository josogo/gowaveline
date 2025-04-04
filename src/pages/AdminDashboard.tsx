
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Mail, 
  DollarSign, 
  BarChart, 
  ChevronDown, 
  LogOut,
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const navItems = [
    { icon: <BarChart className="h-5 w-5" />, label: 'Dashboard', active: true },
    { icon: <Users className="h-5 w-5" />, label: 'Team Management' },
    { icon: <FileText className="h-5 w-5" />, label: 'Deals' },
    { icon: <Mail className="h-5 w-5" />, label: 'Gmail Integration' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Commission Tracking' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
            alt="Waveline Logo" 
            className="h-10"
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
                  {navItems.map((item, index) => (
                    <Button 
                      key={index} 
                      variant="ghost" 
                      className={`justify-start ${item.active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : ''}`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
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
            {navItems.map((item, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                className={`w-full justify-start ${item.active ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : ''}`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
        </aside>
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Sales Reps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">5 require attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Processing Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$3.2M</div>
                <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Commission Payouts (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$24,550</div>
                <p className="text-xs text-muted-foreground mt-1">Next payout: May 1</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity and Team Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your team's latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Smith', action: 'submitted a new deal', time: '2 hours ago' },
                    { name: 'Sarah Johnson', action: 'closed Account #4921', time: '5 hours ago' },
                    { name: 'Michael Brown', action: 'updated merchant profile', time: 'Yesterday' },
                    { name: 'Lisa Davis', action: 'added new lead', time: 'Yesterday' },
                    { name: 'Robert Wilson', action: 'scheduled a demo', time: '2 days ago' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-semibold mr-3">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p><span className="font-medium">{item.name}</span> {item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Sales rep metrics for current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Smith', deals: 5, revenue: '$38,500', convRate: '62%' },
                    { name: 'Sarah Johnson', deals: 7, revenue: '$42,100', convRate: '71%' },
                    { name: 'Michael Brown', deals: 3, revenue: '$27,300', convRate: '54%' },
                    { name: 'Lisa Davis', deals: 6, revenue: '$35,900', convRate: '67%' },
                    { name: 'Robert Wilson', deals: 4, revenue: '$31,200', convRate: '59%' },
                  ].map((rep, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-semibold mr-3">
                          {rep.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{rep.name}</span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Deals</p>
                          <p className="font-medium">{rep.deals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="font-medium">{rep.revenue}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Conv.</p>
                          <p className="font-medium">{rep.convRate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Commission Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Structure</CardTitle>
              <CardDescription>Current payout rates for sales representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium">Processing Volume</th>
                      <th className="text-left py-3 px-4 font-medium">Commission Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Upfront Bonus</th>
                      <th className="text-left py-3 px-4 font-medium">Residual Split</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">$0 - $50,000/month</td>
                      <td className="py-3 px-4">20%</td>
                      <td className="py-3 px-4">$100</td>
                      <td className="py-3 px-4">30%</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">$50,001 - $100,000/month</td>
                      <td className="py-3 px-4">25%</td>
                      <td className="py-3 px-4">$200</td>
                      <td className="py-3 px-4">35%</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">$100,001 - $500,000/month</td>
                      <td className="py-3 px-4">30%</td>
                      <td className="py-3 px-4">$500</td>
                      <td className="py-3 px-4">40%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">$500,001+/month</td>
                      <td className="py-3 px-4">35%</td>
                      <td className="py-3 px-4">$1,000</td>
                      <td className="py-3 px-4">50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
