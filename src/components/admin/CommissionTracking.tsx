import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, Calendar, Filter, ChevronUp, ChevronDown, Flag, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Commission {
  id: string;
  merchantName: string;
  rep: string;
  amount: string;
  percentage: string;
  payout: string;
  status: 'pending' | 'paid' | 'processing';
  date: string;
}

interface CommissionTier {
  level: string;
  volumeRange: string;
  commissionRate: string;
  upfrontBonus: string;
  residualSplit: string;
}

const CommissionTracking = () => {
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: '1',
      merchantName: "The Coffee Shop",
      rep: "John Smith",
      amount: "$45,000",
      percentage: "20%",
      payout: "$450",
      status: "pending",
      date: "2025-04-01"
    },
    {
      id: '2',
      merchantName: "Fitness Center Inc.",
      rep: "Sarah Johnson",
      amount: "$120,000",
      percentage: "25%",
      payout: "$1,250",
      status: "paid",
      date: "2025-03-28"
    },
    {
      id: '3',
      merchantName: "Tech Solutions LLC",
      rep: "Michael Brown",
      amount: "$87,500",
      percentage: "20%",
      payout: "$580",
      status: "processing",
      date: "2025-03-21"
    },
    {
      id: '4',
      merchantName: "Downtown Restaurant",
      rep: "Lisa Davis",
      amount: "$65,000",
      percentage: "20%",
      payout: "$520",
      status: "pending",
      date: "2025-04-02"
    },
    {
      id: '5',
      merchantName: "Beauty Salon & Spa",
      rep: "Robert Wilson",
      amount: "$38,000",
      percentage: "20%",
      payout: "$320",
      status: "paid",
      date: "2025-03-15"
    }
  ]);
  
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>([
    {
      level: "Tier 1",
      volumeRange: "$0 - $50,000/month",
      commissionRate: "20%",
      upfrontBonus: "$100",
      residualSplit: "30%"
    },
    {
      level: "Tier 2",
      volumeRange: "$50,001 - $100,000/month",
      commissionRate: "25%",
      upfrontBonus: "$200",
      residualSplit: "35%"
    },
    {
      level: "Tier 3",
      volumeRange: "$100,001 - $500,000/month",
      commissionRate: "30%",
      upfrontBonus: "$500",
      residualSplit: "40%"
    },
    {
      level: "Tier 4",
      volumeRange: "$500,001+/month",
      commissionRate: "35%",
      upfrontBonus: "$1,000",
      residualSplit: "50%"
    }
  ]);
  
  const [filterOption, setFilterOption] = useState('all');
  const [currentRep, setCurrentRep] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  
  const filteredCommissions = commissions.filter(commission => {
    if (filterOption !== 'all' && commission.status !== filterOption) return false;
    if (currentRep !== 'all' && commission.rep !== currentRep) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  const uniqueReps = Array.from(new Set(commissions.map(comm => comm.rep)));
  
  const totalPendingAmount = filteredCommissions
    .filter(comm => comm.status === 'pending')
    .reduce((sum, comm) => sum + parseFloat(comm.payout.replace('$', '').replace(',', '')), 0);
    
  const totalPaidAmount = filteredCommissions
    .filter(comm => comm.status === 'paid')
    .reduce((sum, comm) => sum + parseFloat(comm.payout.replace('$', '').replace(',', '')), 0);
  
  const updateCommissionStatus = (id: string, status: 'pending' | 'paid' | 'processing') => {
    setCommissions(prev => 
      prev.map(commission => 
        commission.id === id ? { ...commission, status } : commission
      )
    );
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    toast.success(`Commission updated to ${statusText}`);
  };
  
  const handleSaveTier = (tier: CommissionTier) => {
    if (editingTier) {
      setCommissionTiers(prev => 
        prev.map(t => t.level === editingTier.level ? tier : t)
      );
      toast.success(`Commission tier "${tier.level}" updated`);
    } else {
      setCommissionTiers(prev => [...prev, tier]);
      toast.success(`New commission tier added`);
    }
    setEditingTier(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="commissions" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="commissions">Commission Payouts</TabsTrigger>
          <TabsTrigger value="structure">Commission Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-orange-500">Commission Tracking</CardTitle>
              <CardDescription>Track and manage sales rep commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                      <p className="text-2xl font-bold">${totalPendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Paid (MTD)</p>
                      <p className="text-2xl font-bold">${totalPaidAmount.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Payout Date</p>
                      <p className="text-2xl font-bold">May 1, 2025</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={filterOption}
                  onValueChange={setFilterOption}
                >
                  <SelectTrigger className="sm:max-w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={currentRep}
                  onValueChange={setCurrentRep}
                >
                  <SelectTrigger className="sm:max-w-[200px]">
                    <SelectValue placeholder="Filter by rep" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reps</SelectItem>
                    {uniqueReps.map(rep => (
                      <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
                
                <Button variant="outline" className="sm:ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Rep</TableHead>
                      <TableHead className="hidden md:table-cell">Volume</TableHead>
                      <TableHead className="hidden md:table-cell">Rate</TableHead>
                      <TableHead>Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommissions.length > 0 ? (
                      filteredCommissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell className="font-medium">{commission.merchantName}</TableCell>
                          <TableCell>{commission.rep}</TableCell>
                          <TableCell className="hidden md:table-cell">{commission.amount}</TableCell>
                          <TableCell className="hidden md:table-cell">{commission.percentage}</TableCell>
                          <TableCell className="font-semibold">{commission.payout}</TableCell>
                          <TableCell>{getStatusBadge(commission.status)}</TableCell>
                          <TableCell>
                            {commission.status === 'pending' && (
                              <Button 
                                size="sm"
                                onClick={() => updateCommissionStatus(commission.id, 'paid')}
                              >
                                Mark Paid
                              </Button>
                            )}
                            {commission.status === 'processing' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                  >
                                    Update Status
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Commission Status</DialogTitle>
                                    <DialogDescription>
                                      Change the status for {commission.merchantName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Merchant</p>
                                        <p className="font-semibold">{commission.merchantName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Rep</p>
                                        <p className="font-semibold">{commission.rep}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Amount</p>
                                        <p className="font-semibold">{commission.payout}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => updateCommissionStatus(commission.id, 'pending')}
                                    >
                                      Mark Pending
                                    </Button>
                                    <Button
                                      onClick={() => updateCommissionStatus(commission.id, 'paid')}
                                    >
                                      Mark Paid
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {commission.status === 'paid' && (
                              <Badge variant="outline" className="bg-gray-100">Completed</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No commissions match the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-500">Commission Structure</CardTitle>
                  <CardDescription>Configure commission tiers and payout rates</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Edit Structure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Commission Structure</DialogTitle>
                      <DialogDescription>
                        Update the commission tier structure for sales representatives
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold mb-2">Tier Settings</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure the commission rates and bonuses for each tier based on monthly processing volume.
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        {commissionTiers.map((tier, index) => (
                          <div key={tier.level} className="border rounded-md p-4 relative">
                            <div className="absolute right-2 top-2">
                              <Badge variant="outline">
                                <Flag className="h-3 w-3 mr-1" />
                                {tier.level}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-sm font-medium">Volume Range</label>
                                <Input defaultValue={tier.volumeRange} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Commission Rate</label>
                                <Input defaultValue={tier.commissionRate} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Upfront Bonus</label>
                                <Input defaultValue={tier.upfrontBonus} />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Residual Split</label>
                                <Input defaultValue={tier.residualSplit} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => toast.success('Commission structure updated')}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Tier</TableHead>
                      <TableHead className="font-semibold">Processing Volume</TableHead>
                      <TableHead className="font-semibold">Commission Rate</TableHead>
                      <TableHead className="font-semibold">Upfront Bonus</TableHead>
                      <TableHead className="font-semibold">Residual Split</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionTiers.map((tier) => (
                      <TableRow key={tier.level}>
                        <TableCell className="font-medium">{tier.level}</TableCell>
                        <TableCell>{tier.volumeRange}</TableCell>
                        <TableCell>{tier.commissionRate}</TableCell>
                        <TableCell>{tier.upfrontBonus}</TableCell>
                        <TableCell>{tier.residualSplit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">About Our Commission Structure</h4>
                    <p className="text-sm text-blue-700">
                      Sales representatives can increase their commission tier by achieving higher monthly processing volumes. 
                      Tier advancements are evaluated at the end of each quarter. Representatives receive both upfront bonuses 
                      upon merchant approval and ongoing residual commissions based on merchant processing activity.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionTracking;
