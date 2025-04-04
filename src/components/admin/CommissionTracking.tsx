
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
import { DollarSign, Download, Calendar, Filter, ChevronUp, ChevronDown, Flag, Info, Plus, Trash2, Edit, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface Commission {
  id: string;
  merchantName: string;
  rep: string | null;
  repPercentage: string;
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

interface Agent {
  id: string;
  name: string;
  defaultCommissionRate: string;
  email: string;
  status: 'active' | 'inactive';
}

interface Merchant {
  id: string;
  name: string;
  monthlyVolume: string;
  monthlyResidual: string;
  agentId: string | null;
}

const CommissionTracking = () => {
  // Agent state
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'John Smith',
      defaultCommissionRate: '40%',
      email: 'john@example.com',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      defaultCommissionRate: '45%',
      email: 'sarah@example.com',
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Brown',
      defaultCommissionRate: '40%',
      email: 'michael@example.com',
      status: 'active'
    },
    {
      id: '4',
      name: 'Lisa Davis',
      defaultCommissionRate: '35%',
      email: 'lisa@example.com',
      status: 'active'
    },
    {
      id: '5',
      name: 'Robert Wilson',
      defaultCommissionRate: '40%',
      email: 'robert@example.com',
      status: 'active'
    }
  ]);

  // Merchant state
  const [merchants, setMerchants] = useState<Merchant[]>([
    {
      id: '1',
      name: 'The Coffee Shop',
      monthlyVolume: '$45,000',
      monthlyResidual: '$1,125',
      agentId: '1'
    },
    {
      id: '2',
      name: 'Fitness Center Inc.',
      monthlyVolume: '$120,000',
      monthlyResidual: '$2,800',
      agentId: '2'
    },
    {
      id: '3',
      name: 'Tech Solutions LLC',
      monthlyVolume: '$87,500',
      monthlyResidual: '$1,450',
      agentId: '3'
    },
    {
      id: '4',
      name: 'Downtown Restaurant',
      monthlyVolume: '$65,000',
      monthlyResidual: '$1,300',
      agentId: '4'
    },
    {
      id: '5',
      name: 'Beauty Salon & Spa',
      monthlyVolume: '$38,000',
      monthlyResidual: '$800',
      agentId: null
    }
  ]);

  // Commissions state
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: '1',
      merchantName: "The Coffee Shop",
      rep: "John Smith",
      repPercentage: "40%",
      amount: "$1,125",
      percentage: "20%",
      payout: "$450",
      status: "pending",
      date: "2025-04-01"
    },
    {
      id: '2',
      merchantName: "Fitness Center Inc.",
      rep: "Sarah Johnson",
      repPercentage: "45%",
      amount: "$2,800",
      percentage: "25%",
      payout: "$1,250",
      status: "paid",
      date: "2025-03-28"
    },
    {
      id: '3',
      merchantName: "Tech Solutions LLC",
      rep: "Michael Brown",
      repPercentage: "40%",
      amount: "$1,450",
      percentage: "20%",
      payout: "$580",
      status: "processing",
      date: "2025-03-21"
    },
    {
      id: '4',
      merchantName: "Downtown Restaurant",
      rep: "Lisa Davis",
      repPercentage: "35%",
      amount: "$1,300",
      percentage: "20%",
      payout: "$520",
      status: "pending",
      date: "2025-04-02"
    },
    {
      id: '5',
      merchantName: "Beauty Salon & Spa",
      rep: null,
      repPercentage: "0%",
      amount: "$800",
      percentage: "20%",
      payout: "$0",
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
  
  // UI state
  const [filterOption, setFilterOption] = useState('all');
  const [currentRep, setCurrentRep] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [isAddMerchantOpen, setIsAddMerchantOpen] = useState(false);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('commissions');
  
  // Form state
  const [newMerchant, setNewMerchant] = useState({
    name: '',
    monthlyVolume: '',
    monthlyResidual: '',
    agentId: ''
  });
  
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    defaultCommissionRate: ''
  });

  // Filtered data
  const filteredCommissions = commissions.filter(commission => {
    if (filterOption !== 'all' && commission.status !== filterOption) return false;
    if (currentRep !== 'all' && commission.rep !== currentRep) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  const uniqueReps = Array.from(new Set(commissions.map(comm => comm.rep).filter(Boolean) as string[]));
  
  const totalPendingAmount = filteredCommissions
    .filter(comm => comm.status === 'pending')
    .reduce((sum, comm) => sum + parseFloat(comm.payout.replace('$', '').replace(',', '')), 0);
    
  const totalPaidAmount = filteredCommissions
    .filter(comm => comm.status === 'paid')
    .reduce((sum, comm) => sum + parseFloat(comm.payout.replace('$', '').replace(',', '')), 0);
  
  // Functions
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

  const handleAddMerchant = () => {
    // Convert input values to currency format
    const volume = newMerchant.monthlyVolume.startsWith('$') 
      ? newMerchant.monthlyVolume 
      : `$${parseFloat(newMerchant.monthlyVolume).toLocaleString()}`;
    
    const residual = newMerchant.monthlyResidual.startsWith('$') 
      ? newMerchant.monthlyResidual 
      : `$${parseFloat(newMerchant.monthlyResidual).toLocaleString()}`;
    
    // Create new merchant
    const merchant: Merchant = {
      id: `m-${Date.now()}`,
      name: newMerchant.name,
      monthlyVolume: volume,
      monthlyResidual: residual,
      agentId: newMerchant.agentId || null
    };
    
    setMerchants([...merchants, merchant]);
    
    // If agent is assigned, create commission
    if (newMerchant.agentId) {
      const agent = agents.find(a => a.id === newMerchant.agentId);
      if (agent) {
        // Extract percentage value
        const agentRate = parseInt(agent.defaultCommissionRate.replace('%', '')) / 100;
        const residualAmount = parseFloat(newMerchant.monthlyResidual.replace('$', '').replace(',', ''));
        const payout = (residualAmount * agentRate).toFixed(2);
        
        const commission: Commission = {
          id: `c-${Date.now()}`,
          merchantName: newMerchant.name,
          rep: agent.name,
          repPercentage: agent.defaultCommissionRate,
          amount: residual,
          percentage: agent.defaultCommissionRate,
          payout: `$${payout}`,
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        };
        
        setCommissions([...commissions, commission]);
      }
    }
    
    setNewMerchant({
      name: '',
      monthlyVolume: '',
      monthlyResidual: '',
      agentId: ''
    });
    
    setIsAddMerchantOpen(false);
    toast.success('Merchant added successfully');
  };
  
  const handleAddAgent = () => {
    const agent: Agent = {
      id: `a-${Date.now()}`,
      name: newAgent.name,
      email: newAgent.email,
      defaultCommissionRate: newAgent.defaultCommissionRate.includes('%') 
        ? newAgent.defaultCommissionRate 
        : `${newAgent.defaultCommissionRate}%`,
      status: 'active'
    };
    
    setAgents([...agents, agent]);
    setNewAgent({
      name: '',
      email: '',
      defaultCommissionRate: ''
    });
    
    setIsAddAgentOpen(false);
    toast.success('Agent added successfully');
  };
  
  const recalculateCommissions = () => {
    // For each merchant with an agent, calculate commission
    const newCommissions: Commission[] = [];
    
    merchants.forEach(merchant => {
      if (merchant.agentId) {
        const agent = agents.find(a => a.id === merchant.agentId);
        if (agent) {
          // Extract values
          const agentRate = parseInt(agent.defaultCommissionRate.replace('%', '')) / 100;
          const residualAmount = parseFloat(merchant.monthlyResidual.replace('$', '').replace(',', ''));
          const payout = (residualAmount * agentRate).toFixed(2);
          
          // Create or update commission
          const existingCommIndex = commissions.findIndex(c => 
            c.merchantName === merchant.name && c.rep === agent.name
          );
          
          if (existingCommIndex >= 0) {
            const existing = { ...commissions[existingCommIndex] };
            existing.amount = merchant.monthlyResidual;
            existing.percentage = agent.defaultCommissionRate;
            existing.repPercentage = agent.defaultCommissionRate;
            existing.payout = `$${payout}`;
            newCommissions.push(existing);
          } else {
            const commission: Commission = {
              id: `c-${Date.now()}-${merchant.id}`,
              merchantName: merchant.name,
              rep: agent.name,
              repPercentage: agent.defaultCommissionRate,
              amount: merchant.monthlyResidual,
              percentage: agent.defaultCommissionRate,
              payout: `$${payout}`,
              status: 'pending',
              date: new Date().toISOString().split('T')[0]
            };
            newCommissions.push(commission);
          }
        }
      }
    });
    
    setCommissions(newCommissions);
    toast.success('Commissions recalculated');
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
      <Tabs defaultValue="commissions" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
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
                
                <Button 
                  variant="outline" 
                  className="sm:ml-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                
                <Button 
                  onClick={recalculateCommissions}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Recalculate
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Rep</TableHead>
                      <TableHead className="hidden md:table-cell">Residual</TableHead>
                      <TableHead className="hidden md:table-cell">Rep %</TableHead>
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
                          <TableCell>{commission.rep || 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">{commission.amount}</TableCell>
                          <TableCell className="hidden md:table-cell">{commission.repPercentage}</TableCell>
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
        
        <TabsContent value="merchants">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-500">Merchant Management</CardTitle>
                  <CardDescription>Manage merchants and their monthly residuals</CardDescription>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsAddMerchantOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Merchant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Merchant</TableHead>
                      <TableHead className="font-semibold">Monthly Volume</TableHead>
                      <TableHead className="font-semibold">Monthly Residual</TableHead>
                      <TableHead className="font-semibold">Agent</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchants.map((merchant) => {
                      const assignedAgent = agents.find(a => a.id === merchant.agentId);
                      return (
                        <TableRow key={merchant.id}>
                          <TableCell className="font-medium">{merchant.name}</TableCell>
                          <TableCell>{merchant.monthlyVolume}</TableCell>
                          <TableCell>{merchant.monthlyResidual}</TableCell>
                          <TableCell>
                            {assignedAgent ? (
                              <div className="flex items-center gap-2">
                                {assignedAgent.name}
                                <Badge variant="outline" className="bg-orange-50 text-orange-800">
                                  {assignedAgent.defaultCommissionRate}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <Dialog open={isAddMerchantOpen} onOpenChange={setIsAddMerchantOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Merchant</DialogTitle>
                    <DialogDescription>
                      Add a new merchant and set their monthly processing details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Merchant Name
                        </label>
                        <Input 
                          value={newMerchant.name} 
                          onChange={(e) => setNewMerchant({...newMerchant, name: e.target.value})}
                          placeholder="Enter merchant name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Monthly Processing Volume
                        </label>
                        <Input 
                          value={newMerchant.monthlyVolume} 
                          onChange={(e) => setNewMerchant({...newMerchant, monthlyVolume: e.target.value})}
                          placeholder="$50,000"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Monthly Residual
                        </label>
                        <Input 
                          value={newMerchant.monthlyResidual} 
                          onChange={(e) => setNewMerchant({...newMerchant, monthlyResidual: e.target.value})}
                          placeholder="$1,200"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Assign Agent (Optional)
                        </label>
                        <Select
                          value={newMerchant.agentId}
                          onValueChange={(value) => setNewMerchant({...newMerchant, agentId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an agent (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} ({agent.defaultCommissionRate})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMerchantOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMerchant}>
                      Add Merchant
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-500">Agent Management</CardTitle>
                  <CardDescription>Manage agents and their commission rates</CardDescription>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsAddAgentOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Agent</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Default Rate</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{agent.defaultCommissionRate}</TableCell>
                        <TableCell>
                          {agent.status === 'active' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Agent</DialogTitle>
                    <DialogDescription>
                      Add a new sales agent and set their default commission rate
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Agent Name
                        </label>
                        <Input 
                          value={newAgent.name} 
                          onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                          placeholder="Enter agent name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Email Address
                        </label>
                        <Input 
                          type="email"
                          value={newAgent.email} 
                          onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                          placeholder="agent@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Default Commission Rate
                        </label>
                        <Input 
                          value={newAgent.defaultCommissionRate} 
                          onChange={(e) => setNewAgent({...newAgent, defaultCommissionRate: e.target.value})}
                          placeholder="40%"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAgentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAgent}>
                      Add Agent
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionTracking;
