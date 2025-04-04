
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Deal {
  id: string;
  merchantName: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  rep: string;
  date: string;
  notes: string;
}

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      merchantName: "The Coffee Shop",
      amount: "$45,000",
      status: "pending",
      rep: "John Smith",
      date: "2025-03-28",
      notes: "Waiting for final documentation"
    },
    {
      id: '2',
      merchantName: "Fitness Center Inc.",
      amount: "$120,000",
      status: "approved",
      rep: "Sarah Johnson",
      date: "2025-03-25",
      notes: "Approved with standard rates"
    },
    {
      id: '3',
      merchantName: "Tech Solutions LLC",
      amount: "$87,500",
      status: "rejected",
      rep: "Michael Brown",
      date: "2025-03-22",
      notes: "High risk profile, insufficient documentation"
    },
    {
      id: '4',
      merchantName: "Downtown Restaurant",
      amount: "$65,000",
      status: "pending",
      rep: "Lisa Davis",
      date: "2025-03-21",
      notes: "Waiting for bank verification"
    },
    {
      id: '5',
      merchantName: "Beauty Salon & Spa",
      amount: "$38,000",
      status: "approved",
      rep: "Robert Wilson",
      date: "2025-03-18",
      notes: "Approved with promotional rates"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = deals.filter(deal => {
    // Filter by status if a status filter is applied
    if (filterStatus && filterStatus !== 'all' && deal.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !deal.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !deal.rep.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const updateDealStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === id ? { ...deal, status } : deal
      )
    );
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    toast.success(`Deal ${statusText}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">Deals Management</CardTitle>
          <CardDescription>Monitor and manage all merchant deals and applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by merchant or rep..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select
              value={filterStatus || 'all'}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="sm:max-w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Deal</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new merchant deal.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="merchant" className="text-right">
                        Merchant
                      </label>
                      <Input
                        id="merchant"
                        placeholder="Merchant name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="amount" className="text-right">
                        Amount
                      </label>
                      <Input
                        id="amount"
                        placeholder="Processing amount"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="rep" className="text-right">
                        Sales Rep
                      </label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select sales rep" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="michael">Michael Brown</SelectItem>
                          <SelectItem value="lisa">Lisa Davis</SelectItem>
                          <SelectItem value="robert">Robert Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="notes" className="text-right">
                        Notes
                      </label>
                      <Input
                        id="notes"
                        placeholder="Deal notes"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-[#0EA5E9]" onClick={() => toast.success('Deal added successfully!')}>
                      Add Deal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Rep</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.merchantName}</TableCell>
                      <TableCell>{deal.amount}</TableCell>
                      <TableCell className="hidden md:table-cell">{deal.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{deal.rep}</TableCell>
                      <TableCell>{getStatusBadge(deal.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{deal.merchantName}</DialogTitle>
                                <DialogDescription>
                                  Deal ID: {deal.id} • Submitted on {deal.date}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                                    <p className="text-lg font-semibold">{deal.amount}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Rep</p>
                                    <p className="text-lg font-semibold">{deal.rep}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <div className="mt-1">{getStatusBadge(deal.status)}</div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                                  <p className="mt-1">{deal.notes}</p>
                                </div>
                              </div>
                              <DialogFooter className="flex justify-between">
                                {deal.status === "pending" && (
                                  <>
                                    <Button
                                      variant="destructive"
                                      onClick={() => updateDealStatus(deal.id, 'rejected')}
                                    >
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => updateDealStatus(deal.id, 'approved')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  </>
                                )}
                                {deal.status !== "pending" && (
                                  <Button
                                    variant="outline"
                                    onClick={() => updateDealStatus(deal.id, 'pending')}
                                  >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Set to Pending
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No deals found matching the criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {filteredDeals.length} of {deals.length} total deals
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Deals;
