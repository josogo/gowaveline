
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import GrowthChart from '@/components/dashboard/GrowthChart';
import { BookOpen, TrendingUp, ChevronDown, ChevronUp, Filter, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

// Real data for team performance
const teamPerformanceData = [
  { 
    name: 'John Smith', 
    avatar: 'https://i.pravatar.cc/150?img=1',
    deals: 5, 
    revenue: '$38,500', 
    convRate: '62%',
    totalVolume: '$425,000',
    commissionSplit: '35%'
  },
  { 
    name: 'Sarah Johnson', 
    avatar: 'https://i.pravatar.cc/150?img=2',
    deals: 7, 
    revenue: '$42,100', 
    convRate: '71%',
    totalVolume: '$520,000',
    commissionSplit: '35%' 
  },
  { 
    name: 'Michael Brown', 
    avatar: 'https://i.pravatar.cc/150?img=3',
    deals: 3, 
    revenue: '$27,300', 
    convRate: '54%',
    totalVolume: '$310,000', 
    commissionSplit: '30%'
  },
  { 
    name: 'Lisa Davis', 
    avatar: 'https://i.pravatar.cc/150?img=4',
    deals: 6, 
    revenue: '$35,900', 
    convRate: '67%',
    totalVolume: '$410,000',
    commissionSplit: '35%'
  },
  { 
    name: 'Robert Wilson', 
    avatar: 'https://i.pravatar.cc/150?img=5',
    deals: 4, 
    revenue: '$31,200', 
    convRate: '59%',
    totalVolume: '$290,000',
    commissionSplit: '30%'
  },
];

// Monthly processing volume data for the growth chart
const growthChartData = [
  { month: 'Jan', volume: 2850000, growth: 0 },
  { month: 'Feb', volume: 2920000, growth: 2.5 },
  { month: 'Mar', volume: 3150000, growth: 7.9 },
  { month: 'Apr', volume: 3210000, growth: 1.9 },
  { month: 'May', volume: 3380000, growth: 5.3 },
  { month: 'Jun', volume: 3640000, growth: 7.7 },
  { month: 'Jul', volume: 3720000, growth: 2.2 },
  { month: 'Aug', volume: 3920000, growth: 5.4 },
  { month: 'Sep', volume: 4100000, growth: 4.6 },
  { month: 'Oct', volume: 4350000, growth: 6.1 },
  { month: 'Nov', volume: 4590000, growth: 5.5 },
  { month: 'Dec', volume: 4780000, growth: 4.1 },
];

// Sample activity data
const recentActivityData = [
  { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=1', action: 'submitted a new deal', time: '2 hours ago' },
  { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=2', action: 'closed Account #4921', time: '5 hours ago' },
  { name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=3', action: 'updated merchant profile', time: 'Yesterday' },
  { name: 'Lisa Davis', avatar: 'https://i.pravatar.cc/150?img=4', action: 'added new lead', time: 'Yesterday' },
  { name: 'Robert Wilson', avatar: 'https://i.pravatar.cc/150?img=5', action: 'scheduled a demo', time: '2 days ago' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAllTeamMembers, setShowAllTeamMembers] = useState(false);
  
  // Calculate real-time summary statistics
  const totalVolume = teamPerformanceData.reduce((sum, member) => {
    return sum + parseInt(member.totalVolume.replace(/[$,]/g, ''));
  }, 0);
  
  const totalDeals = teamPerformanceData.reduce((sum, member) => sum + member.deals, 0);
  
  const totalRevenue = teamPerformanceData.reduce((sum, member) => {
    return sum + parseInt(member.revenue.replace(/[$,]/g, ''));
  }, 0);

  // Determine how many team members to show based on toggle state and screen size
  const visibleTeamMembers = showAllTeamMembers ? teamPerformanceData : (isMobile ? teamPerformanceData.slice(0, 3) : teamPerformanceData);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          <div className="flex items-center gap-2 self-end md:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-1">
                  {selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedPeriod('today')}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod('week')}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod('month')}>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isMobile && (
              <Button variant="default">
                Export Report
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Tabs for Content Sections */}
        {isMobile && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Sales Reps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamPerformanceData.length}</div>
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
                    <div className="text-2xl font-bold">{totalDeals}</div>
                    <p className="text-xs text-muted-foreground mt-1">5 require attention</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(totalVolume/1000000).toFixed(1)}M</div>
                    <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Commission MTD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(totalRevenue/1000).toFixed(1)}K</div>
                    <p className="text-xs text-muted-foreground mt-1">Next: May 1</p>
                  </CardContent>
                </Card>
              </div>

              {/* New Training Hub Card */}
              <Card className="border-[#0EA5E9]/20 bg-gradient-to-r from-blue-50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#0EA5E9]/10 p-2 rounded-full shrink-0">
                      <BookOpen className="h-6 w-6 text-[#0EA5E9]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#0EA5E9]">New! Training Hub</h3>
                      <p className="text-sm text-gray-600 mt-1 mb-3">Comprehensive onboarding for your team</p>
                      <Button 
                        className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 w-full"
                        size="sm"
                        onClick={() => navigate('/admin/training-hub')}
                      >
                        Explore Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Trend</CardTitle>
                  <CardDescription>Monthly processing volume (2025)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] w-full">
                    <GrowthChart data={growthChartData.slice(-6)} year={2025} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-orange-500">Team Performance</CardTitle>
                    <CardDescription>Sales rep metrics for current month</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visibleTeamMembers.map((rep, index) => (
                      <div key={index} className="flex flex-col pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={rep.avatar} alt={rep.name} />
                              <AvatarFallback className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                                {rep.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{rep.name}</span>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs mr-2 px-1">
                                  {rep.commissionSplit}
                                </Badge>
                                <span>{rep.convRate} conv. rate</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-3 px-2">
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
                        </div>
                      </div>
                    ))}
                    
                    {teamPerformanceData.length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-[#0EA5E9]"
                        onClick={() => setShowAllTeamMembers(!showAllTeamMembers)}
                      >
                        {showAllTeamMembers ? (
                          <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>Show All {teamPerformanceData.length} Members <ChevronDown className="ml-1 h-4 w-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-500">Recent Activity</CardTitle>
                  <CardDescription>Your team's latest updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivityData.map((item, index) => (
                      <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={item.avatar} alt={item.name} />
                          <AvatarFallback className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p><span className="font-medium">{item.name}</span> {item.action}</p>
                          <p className="text-sm text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Desktop Layout - same content as before for larger screens */}
        {!isMobile && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Sales Reps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{teamPerformanceData.length}</div>
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
                  <div className="text-3xl font-bold">{totalDeals}</div>
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
                  <div className="text-3xl font-bold">${(totalVolume/1000000).toFixed(1)}M</div>
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
                  <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
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
            
            {/* Growth Chart */}
            <div className="mb-8">
              <GrowthChart data={growthChartData} year={2025} />
            </div>
            
            {/* Recent Activity and Team Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-500">Recent Activity</CardTitle>
                  <CardDescription>Your team's latest updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivityData.map((item, index) => (
                      <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={item.avatar} alt={item.name} />
                          <AvatarFallback className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
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
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                              {rep.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
