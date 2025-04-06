
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample data for team performance
const teamPerformanceData = [
  { 
    name: 'John Smith', 
    deals: 5, 
    revenue: '$38,500', 
    convRate: '62%',
    totalVolume: '$425,000',
    commissionSplit: '35%'
  },
  { 
    name: 'Sarah Johnson', 
    deals: 7, 
    revenue: '$42,100', 
    convRate: '71%',
    totalVolume: '$520,000',
    commissionSplit: '35%' 
  },
  { 
    name: 'Michael Brown', 
    deals: 3, 
    revenue: '$27,300', 
    convRate: '54%',
    totalVolume: '$310,000', 
    commissionSplit: '30%'
  },
  { 
    name: 'Lisa Davis', 
    deals: 6, 
    revenue: '$35,900', 
    convRate: '67%',
    totalVolume: '$410,000',
    commissionSplit: '35%'
  },
  { 
    name: 'Robert Wilson', 
    deals: 4, 
    revenue: '$31,200', 
    convRate: '59%',
    totalVolume: '$290,000',
    commissionSplit: '30%'
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <AdminLayout>
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
      
      {/* New Training Hub Card */}
      <Card className="mb-8 border-[#0EA5E9]/20 bg-gradient-to-r from-blue-50 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#0EA5E9]/10 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-[#0EA5E9]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0EA5E9]">New! Training Hub</h3>
                <p className="text-gray-600 mt-1">Comprehensive onboarding experience for your team</p>
              </div>
            </div>
            <Button 
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              onClick={() => navigate('/admin/training-hub')}
            >
              Explore Resources
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity and Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-500">Recent Activity</CardTitle>
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
            <CardTitle className="text-orange-500">Team Performance</CardTitle>
            <CardDescription>Sales rep metrics for current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformanceData.map((rep, index) => (
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
                      <p className="text-xs text-muted-foreground">Vol.</p>
                      <p className="font-medium">${rep.totalVolume.replace('$', '')}</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-muted-foreground">Split</p>
                      <p className="font-medium">{rep.commissionSplit}</p>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-orange-500">Commission Structure</CardTitle>
            <CardDescription>Current payout rates for sales representatives</CardDescription>
          </div>
          <div className="bg-orange-100 rounded-full p-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left font-medium">Processing Volume</TableHead>
                  <TableHead className="text-left font-medium">Commission Rate</TableHead>
                  <TableHead className="text-left font-medium">Upfront Bonus</TableHead>
                  <TableHead className="text-left font-medium">Residual Split</TableHead>
                  <TableHead className="text-left font-medium">Active Reps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-200">
                  <TableCell className="py-3">$0 - $50,000/month</TableCell>
                  <TableCell className="py-3">20%</TableCell>
                  <TableCell className="py-3">$100</TableCell>
                  <TableCell className="py-3">30%</TableCell>
                  <TableCell className="py-3">2</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200">
                  <TableCell className="py-3">$50,001 - $100,000/month</TableCell>
                  <TableCell className="py-3">25%</TableCell>
                  <TableCell className="py-3">$200</TableCell>
                  <TableCell className="py-3">35%</TableCell>
                  <TableCell className="py-3">3</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200">
                  <TableCell className="py-3">$100,001 - $500,000/month</TableCell>
                  <TableCell className="py-3">30%</TableCell>
                  <TableCell className="py-3">$500</TableCell>
                  <TableCell className="py-3">40%</TableCell>
                  <TableCell className="py-3">1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">$500,001+/month</TableCell>
                  <TableCell className="py-3">35%</TableCell>
                  <TableCell className="py-3">$1,000</TableCell>
                  <TableCell className="py-3">50%</TableCell>
                  <TableCell className="py-3">1</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
