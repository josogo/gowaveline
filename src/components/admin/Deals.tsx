
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
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
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Edit, 
  FileText, 
  Save, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  BarChart,
  ChevronDown,
  CheckCircle2,
  XCircle, 
  AlertCircle,
  CalendarDays,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Enhanced deal data with additional fields
const initialDeals = [
  {
    id: 1,
    merchant: "ABC E-commerce",
    amount: "$15,000",
    date: "2025-01-15",
    rep: "John Smith",
    repId: "1",
    repAvatar: "https://i.pravatar.cc/150?img=1",
    status: "Pending",
    priority: "Medium",
    notes: "Client interested in high-risk solution",
    contactName: "Alice Johnson",
    contactEmail: "alice@abcshop.com",
    contactPhone: "555-987-6543",
    products: ["Payment Gateway", "Chargeback Protection"],
    documents: ["proposal.pdf"]
  },
  {
    id: 2,
    merchant: "XYZ Health Services",
    amount: "$32,500",
    date: "2025-01-08",
    rep: "Sarah Johnson",
    repId: "2",
    repAvatar: "https://i.pravatar.cc/150?img=2",
    status: "Won",
    priority: "High",
    notes: "Switching from Square, needs setup by end of month",
    contactName: "Mark Williams",
    contactEmail: "mark@xyzhealth.com",
    contactPhone: "555-123-4567",
    products: ["Payment Gateway", "Virtual Terminal", "ACH Processing"],
    documents: ["contract.pdf", "statement_analysis.pdf"]
  },
  {
    id: 3,
    merchant: "Global Fitness",
    amount: "$8,750",
    date: "2025-01-22",
    rep: "Michael Brown",
    repId: "3",
    repAvatar: "https://i.pravatar.cc/150?img=3",
    status: "Lost",
    priority: "Low",
    notes: "Went with competitor offering lower rates",
    contactName: "John Miller",
    contactEmail: "john@globalfitness.com",
    contactPhone: "555-222-3333",
    products: ["Payment Gateway"],
    documents: []
  },
  {
    id: 4,
    merchant: "Tech Solutions Inc",
    amount: "$21,300",
    date: "2025-01-28",
    rep: "Lisa Davis",
    repId: "4",
    repAvatar: "https://i.pravatar.cc/150?img=4",
    status: "Negotiating",
    priority: "High",
    notes: "Need to follow up about interchange fees",
    contactName: "Sam Wilson",
    contactEmail: "sam@techsolutions.com",
    contactPhone: "555-444-5555",
    products: ["Payment Gateway", "Point of Sale", "Fraud Protection"],
    documents: ["proposal.pdf", "rate_comparison.pdf"]
  },
  {
    id: 5,
    merchant: "Organic Grocers",
    amount: "$12,800",
    date: "2025-02-05",
    rep: "Robert Wilson",
    repId: "5",
    repAvatar: "https://i.pravatar.cc/150?img=5",
    status: "Pending",
    priority: "Medium",
    notes: "",
    contactName: "Emily Chase",
    contactEmail: "emily@organicgrocers.com",
    contactPhone: "555-666-7777",
    products: ["Payment Gateway", "Point of Sale"],
    documents: []
  }
];

// Available sales reps for dropdown
const salesReps = [
  { id: "1", name: "John Smith", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Michael Brown", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "Lisa Davis", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "5", name: "Robert Wilson", avatar: "https://i.pravatar.cc/150?img=5" },
];

// Available products for deals
const productOptions = [
  "Payment Gateway", 
  "Virtual Terminal", 
  "Point of Sale", 
  "Mobile Processing", 
  "ACH Processing", 
  "Fraud Protection", 
  "Chargeback Protection", 
  "Gift Cards", 
  "Loyalty Program"
];

const Deals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [repFilter, setRepFilter] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  
  const [newDeal, setNewDeal] = useState({
    merchant: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    rep: "",
    repId: "",
    repAvatar: "",
    status: "Pending",
    priority: "Medium",
    notes: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    products: [] as string[],
    documents: [] as string[]
  });

  const handleAddDeal = () => {
    const selectedRep = salesReps.find(rep => rep.id === newDeal.repId);
    
    const dealToAdd = {
      ...newDeal,
      id: deals.length + 1,
      rep: selectedRep?.name || "",
      repAvatar: selectedRep?.avatar || "",
      products: selectedProducts,
      documents: uploadedDocuments
    };
    
    setDeals([...deals, dealToAdd]);
    setNewDeal({
      merchant: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      rep: "",
      repId: "",
      repAvatar: "",
      status: "Pending",
      priority: "Medium",
      notes: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      products: [],
      documents: []
    });
    setSelectedProducts([]);
    setUploadedDocuments([]);
    setIsAddDialogOpen(false);
    toast.success("Deal added successfully");
  };

  const handleEditDeal = () => {
    const selectedRep = salesReps.find(rep => rep.id === currentDeal.repId);
    
    const updatedDeal = {
      ...currentDeal,
      rep: selectedRep?.name || currentDeal.rep,
      repAvatar: selectedRep?.avatar || currentDeal.repAvatar,
      products: selectedProducts.length > 0 ? selectedProducts : currentDeal.products,
      documents: uploadedDocuments.length > 0 ? [...currentDeal.documents, ...uploadedDocuments] : currentDeal.documents
    };
    
    const updatedDeals = deals.map(deal => 
      deal.id === currentDeal.id ? updatedDeal : deal
    );
    
    setDeals(updatedDeals);
    setIsEditDialogOpen(false);
    setCurrentDeal(null);
    setSelectedProducts([]);
    setUploadedDocuments([]);
    toast.success("Deal updated successfully");
  };

  const handleDeleteDeal = (dealId: number) => {
    const updatedDeals = deals.filter(deal => deal.id !== dealId);
    setDeals(updatedDeals);
    toast.success("Deal deleted successfully");
  };

  const updateDealNotes = () => {
    const updatedDeals = deals.map(deal => 
      deal.id === currentDeal.id ? currentDeal : deal
    );
    
    setDeals(updatedDeals);
    setIsNotesDialogOpen(false);
    toast.success("Notes updated successfully");
  };

  const openEditDialog = (deal: any) => {
    setCurrentDeal({...deal});
    setSelectedProducts(deal.products || []);
    setIsEditDialogOpen(true);
  };

  const openNotesDialog = (deal: any) => {
    setCurrentDeal({...deal});
    setIsNotesDialogOpen(true);
  };

  const openDetailsDialog = (deal: any) => {
    setCurrentDeal({...deal});
    setIsDetailsDialogOpen(true);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocuments([...uploadedDocuments, file.name]);
      toast.success(`Document "${file.name}" uploaded`);
    }
  };

  const handleProductToggle = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter(p => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const filterDeals = () => {
    return deals.filter(deal => {
      // Search term filter
      const searchMatch = !searchTerm || 
        deal.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = !statusFilter || deal.status === statusFilter;
      
      // Priority filter
      const priorityMatch = !priorityFilter || deal.priority === priorityFilter;
      
      // Rep filter
      const repMatch = !repFilter || deal.repId === repFilter;
      
      return searchMatch && statusMatch && priorityMatch && repMatch;
    });
  };

  const filteredDeals = filterDeals();
  
  // Deal stats
  const totalValue = filteredDeals.reduce((sum, deal) => {
    const amount = parseFloat(deal.amount.replace(/[$,]/g, '')) || 0;
    return sum + amount;
  }, 0);
  
  const wonDeals = filteredDeals.filter(deal => deal.status === "Won").length;
  const pendingDeals = filteredDeals.filter(deal => deal.status === "Pending").length;
  const lostDeals = filteredDeals.filter(deal => deal.status === "Lost").length;

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setPriorityFilter(null);
    setRepFilter(null);
  };

  const exportDeals = () => {
    toast.success("Deals exported to CSV");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0EA5E9]">Deal Management</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportDeals}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-[#0EA5E9]">Add New Deal</DialogTitle>
                <DialogDescription>Enter the details of the new deal below.</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="merchant" className="mb-1 block">Merchant</Label>
                    <Input
                      id="merchant"
                      value={newDeal.merchant}
                      onChange={(e) => setNewDeal({...newDeal, merchant: e.target.value})}
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount" className="mb-1 block">Deal Amount</Label>
                    <Input
                      id="amount"
                      value={newDeal.amount}
                      onChange={(e) => setNewDeal({...newDeal, amount: e.target.value})}
                      placeholder="$0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName" className="mb-1 block">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={newDeal.contactName}
                      onChange={(e) => setNewDeal({...newDeal, contactName: e.target.value})}
                      placeholder="Primary contact"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactEmail" className="mb-1 block">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      value={newDeal.contactEmail}
                      onChange={(e) => setNewDeal({...newDeal, contactEmail: e.target.value})}
                      placeholder="email@example.com"
                      type="email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone" className="mb-1 block">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={newDeal.contactPhone}
                      onChange={(e) => setNewDeal({...newDeal, contactPhone: e.target.value})}
                      placeholder="555-123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="mb-1 block">Expected Close Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newDeal.date}
                      onChange={(e) => setNewDeal({...newDeal, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rep" className="mb-1 block">Sales Representative</Label>
                    <Select 
                      value={newDeal.repId} 
                      onValueChange={(value) => setNewDeal({...newDeal, repId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rep" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Representatives</SelectLabel>
                          {salesReps.map(rep => (
                            <SelectItem key={rep.id} value={rep.id}>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={rep.avatar} alt={rep.name} />
                                  <AvatarFallback>{rep.name[0]}</AvatarFallback>
                                </Avatar>
                                {rep.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="mb-1 block">Status</Label>
                    <Select 
                      value={newDeal.status} 
                      onValueChange={(value) => setNewDeal({...newDeal, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Negotiating">Negotiating</SelectItem>
                          <SelectItem value="Won">Won</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority" className="mb-1 block">Priority</Label>
                    <Select 
                      value={newDeal.priority} 
                      onValueChange={(value) => setNewDeal({...newDeal, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="mb-1 block">Documents</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={handleDocumentUpload}
                        className="flex-1"
                      />
                    </div>
                    {uploadedDocuments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Uploaded:</p>
                        <ul className="text-sm">
                          {uploadedDocuments.map((doc, index) => (
                            <li key={index} className="text-muted-foreground">{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-1 block">Products</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {productOptions.map((product) => (
                      <div key={product} className="flex items-center">
                        <input 
                          type="checkbox"
                          id={`product-${product}`}
                          checked={selectedProducts.includes(product)}
                          onChange={() => handleProductToggle(product)}
                          className="mr-2"
                        />
                        <Label htmlFor={`product-${product}`} className="text-sm cursor-pointer">
                          {product}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes" className="mb-1 block">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newDeal.notes}
                    onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                    className="min-h-20"
                    placeholder="Enter any additional notes about this deal"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600" 
                  onClick={handleAddDeal}
                >
                  Add Deal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Won Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            <p className="text-2xl font-bold">{wonDeals}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            <p className="text-2xl font-bold">{pendingDeals}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lost Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            <p className="text-2xl font-bold">{lostDeals}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Negotiating">Negotiating</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter || "all"} onValueChange={(value) => setPriorityFilter(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={repFilter || "all"} onValueChange={(value) => setRepFilter(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sales Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Representatives</SelectItem>
                {salesReps.map(rep => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableCaption>List of deals and their current status.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Representative</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    <div>
                      {deal.merchant}
                      <div className="text-xs text-muted-foreground mt-1">{deal.contactName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{deal.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {deal.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={deal.repAvatar} alt={deal.rep} />
                        <AvatarFallback className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                          {deal.rep.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {deal.rep}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      deal.status === 'Won' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                      deal.status === 'Lost' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                      deal.status === 'Negotiating' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                      'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }>
                      {deal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      deal.priority === 'High' ? 'border-red-500 text-red-600' : 
                      deal.priority === 'Medium' ? 'border-amber-500 text-amber-600' :
                      'border-green-500 text-green-600'
                    }>
                      {deal.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDetailsDialog(deal)}
                      >
                        <BarChart className="h-4 w-4 text-[#0EA5E9]" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(deal)}
                      >
                        <Edit className="h-4 w-4 text-[#0EA5E9]" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openNotesDialog(deal)}
                      >
                        <FileText className="h-4 w-4 text-orange-500" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No deals found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[#0EA5E9]">Edit Deal</DialogTitle>
            <DialogDescription>Update the details of this deal.</DialogDescription>
          </DialogHeader>
          
          {currentDeal && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-merchant" className="mb-1 block">Merchant</Label>
                  <Input
                    id="edit-merchant"
                    value={currentDeal.merchant}
                    onChange={(e) => setCurrentDeal({...currentDeal, merchant: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-amount" className="mb-1 block">Deal Amount</Label>
                  <Input
                    id="edit-amount"
                    value={currentDeal.amount}
                    onChange={(e) => setCurrentDeal({...currentDeal, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contactName" className="mb-1 block">Contact Name</Label>
                  <Input
                    id="edit-contactName"
                    value={currentDeal.contactName}
                    onChange={(e) => setCurrentDeal({...currentDeal, contactName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-contactEmail" className="mb-1 block">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    value={currentDeal.contactEmail}
                    onChange={(e) => setCurrentDeal({...currentDeal, contactEmail: e.target.value})}
                    type="email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contactPhone" className="mb-1 block">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    value={currentDeal.contactPhone}
                    onChange={(e) => setCurrentDeal({...currentDeal, contactPhone: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-date" className="mb-1 block">Expected Close Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={currentDeal.date}
                    onChange={(e) => setCurrentDeal({...currentDeal, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rep" className="mb-1 block">Sales Representative</Label>
                  <Select 
                    value={currentDeal.repId} 
                    onValueChange={(value) => setCurrentDeal({...currentDeal, repId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rep" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Representatives</SelectLabel>
                        {salesReps.map(rep => (
                          <SelectItem key={rep.id} value={rep.id}>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={rep.avatar} alt={rep.name} />
                                <AvatarFallback>{rep.name[0]}</AvatarFallback>
                              </Avatar>
                              {rep.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-status" className="mb-1 block">Status</Label>
                  <Select 
                    value={currentDeal.status} 
                    onValueChange={(value) => setCurrentDeal({...currentDeal, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Negotiating">Negotiating</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-priority" className="mb-1 block">Priority</Label>
                  <Select 
                    value={currentDeal.priority} 
                    onValueChange={(value) => setCurrentDeal({...currentDeal, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-1 block">Documents</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={handleDocumentUpload}
                      className="flex-1"
                    />
                  </div>
                  {currentDeal.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Current documents:</p>
                      <ul className="text-sm">
                        {currentDeal.documents.map((doc: string, index: number) => (
                          <li key={index} className="text-muted-foreground">{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">New uploads:</p>
                      <ul className="text-sm">
                        {uploadedDocuments.map((doc, index) => (
                          <li key={index} className="text-muted-foreground">{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-1 block">Products</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {productOptions.map((product) => (
                    <div key={product} className="flex items-center">
                      <input 
                        type="checkbox"
                        id={`edit-product-${product}`}
                        checked={selectedProducts.includes(product)}
                        onChange={() => handleProductToggle(product)}
                        className="mr-2"
                      />
                      <Label htmlFor={`edit-product-${product}`} className="text-sm cursor-pointer">
                        {product}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#0EA5E9] hover:bg-blue-600" 
              onClick={handleEditDeal}
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Deal Notes</DialogTitle>
            <DialogDescription>Add or update notes for {currentDeal?.merchant}.</DialogDescription>
          </DialogHeader>
          
          {currentDeal && (
            <div className="py-4">
              <Textarea
                value={currentDeal.notes}
                onChange={(e) => setCurrentDeal({...currentDeal, notes: e.target.value})}
                className="min-h-[150px]"
                placeholder="Enter notes about this deal..."
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600" 
              onClick={updateDealNotes}
            >
              <Save className="mr-2 h-4 w-4" /> Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Deal Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[#0EA5E9]">Deal Details</DialogTitle>
            <DialogDescription>Complete information for {currentDeal?.merchant}</DialogDescription>
          </DialogHeader>
          
          {currentDeal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Deal Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{currentDeal.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Close Date:</span>
                    <span>{currentDeal.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={
                      currentDeal.status === 'Won' ? 'bg-green-100 text-green-800' : 
                      currentDeal.status === 'Lost' ? 'bg-red-100 text-red-800' :
                      currentDeal.status === 'Negotiating' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }>{currentDeal.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="outline" className={
                      currentDeal.priority === 'High' ? 'border-red-500 text-red-600' : 
                      currentDeal.priority === 'Medium' ? 'border-amber-500 text-amber-600' :
                      'border-green-500 text-green-600'
                    }>{currentDeal.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Representative:</span>
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={currentDeal.repAvatar} alt={currentDeal.rep} />
                        <AvatarFallback>{currentDeal.rep[0]}</AvatarFallback>
                      </Avatar>
                      <span>{currentDeal.rep}</span>
                    </div>
                  </div>
                </div>
                
                {currentDeal.products && currentDeal.products.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentDeal.products.map((product: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentDeal.documents && currentDeal.documents.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Documents</h4>
                    <ul className="text-sm">
                      {currentDeal.documents.map((doc: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <FileText className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Name</p>
                    <p className="font-medium">{currentDeal.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{currentDeal.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{currentDeal.contactPhone}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes</h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    {currentDeal.notes || "No notes added yet"}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openEditDialog(currentDeal);
                  }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Deal
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deals;
