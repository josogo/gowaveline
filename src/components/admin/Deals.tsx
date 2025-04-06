
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
import { PlusCircle, Edit, FileText, Save, Trash2 } from "lucide-react";

// Sample deal data
const initialDeals = [
  {
    id: 1,
    merchant: "ABC E-commerce",
    amount: "$15,000",
    date: "2025-01-15",
    rep: "John Smith",
    status: "Pending",
    notes: "Client interested in high-risk solution"
  },
  {
    id: 2,
    merchant: "XYZ Health Services",
    amount: "$32,500",
    date: "2025-01-08",
    rep: "Sarah Johnson",
    status: "Won",
    notes: "Switching from Square, needs setup by end of month"
  },
  {
    id: 3,
    merchant: "Global Fitness",
    amount: "$8,750",
    date: "2025-01-22",
    rep: "Michael Brown",
    status: "Lost",
    notes: "Went with competitor offering lower rates"
  },
  {
    id: 4,
    merchant: "Tech Solutions Inc",
    amount: "$21,300",
    date: "2025-01-28",
    rep: "Emma Wilson",
    status: "Negotiating",
    notes: "Need to follow up about interchange fees"
  },
  {
    id: 5,
    merchant: "Organic Grocers",
    amount: "$12,800",
    date: "2025-02-05",
    rep: "John Smith",
    status: "Pending",
    notes: ""
  }
];

const Deals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<any>(null);
  const [newDeal, setNewDeal] = useState({
    merchant: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    rep: "",
    status: "Pending",
    notes: ""
  });

  const handleAddDeal = () => {
    const dealToAdd = {
      ...newDeal,
      id: deals.length + 1
    };
    
    setDeals([...deals, dealToAdd]);
    setNewDeal({
      merchant: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      rep: "",
      status: "Pending",
      notes: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEditDeal = () => {
    const updatedDeals = deals.map(deal => 
      deal.id === currentDeal.id ? currentDeal : deal
    );
    
    setDeals(updatedDeals);
    setIsEditDialogOpen(false);
    setCurrentDeal(null);
  };

  const handleDeleteDeal = (dealId: number) => {
    const updatedDeals = deals.filter(deal => deal.id !== dealId);
    setDeals(updatedDeals);
  };

  const updateDealNotes = () => {
    const updatedDeals = deals.map(deal => 
      deal.id === currentDeal.id ? currentDeal : deal
    );
    
    setDeals(updatedDeals);
    setIsNotesDialogOpen(false);
  };

  const openEditDialog = (deal: any) => {
    setCurrentDeal({...deal});
    setIsEditDialogOpen(true);
  };

  const openNotesDialog = (deal: any) => {
    setCurrentDeal({...deal});
    setIsNotesDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#0EA5E9]">Deal Management</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#0EA5E9]">Add New Deal</DialogTitle>
              <DialogDescription>Enter the details of the new deal below.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="merchant" className="text-right">Merchant</Label>
                <Input
                  id="merchant"
                  value={newDeal.merchant}
                  onChange={(e) => setNewDeal({...newDeal, merchant: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input
                  id="amount"
                  value={newDeal.amount}
                  onChange={(e) => setNewDeal({...newDeal, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDeal.date}
                  onChange={(e) => setNewDeal({...newDeal, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rep" className="text-right">Representative</Label>
                <Input
                  id="rep"
                  value={newDeal.rep}
                  onChange={(e) => setNewDeal({...newDeal, rep: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select 
                  value={newDeal.status} 
                  onValueChange={(value) => setNewDeal({...newDeal, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Won">Won</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Negotiating">Negotiating</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                  className="col-span-3"
                  rows={3}
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
      
      <Table>
        <TableCaption>List of deals and their current status.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Representative</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.merchant}</TableCell>
              <TableCell>{deal.amount}</TableCell>
              <TableCell>{deal.date}</TableCell>
              <TableCell>{deal.rep}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  deal.status === 'Won' ? 'bg-green-100 text-green-800' : 
                  deal.status === 'Lost' ? 'bg-red-100 text-red-800' :
                  deal.status === 'Negotiating' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {deal.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openEditDialog(deal)}
                  >
                    <Edit className="h-4 w-4 text-[#0EA5E9]" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openNotesDialog(deal)}
                  >
                    <FileText className="h-4 w-4 text-orange-500" />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteDeal(deal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#0EA5E9]">Edit Deal</DialogTitle>
            <DialogDescription>Update the details of this deal.</DialogDescription>
          </DialogHeader>
          
          {currentDeal && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-merchant" className="text-right">Merchant</Label>
                <Input
                  id="edit-merchant"
                  value={currentDeal.merchant}
                  onChange={(e) => setCurrentDeal({...currentDeal, merchant: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">Amount</Label>
                <Input
                  id="edit-amount"
                  value={currentDeal.amount}
                  onChange={(e) => setCurrentDeal({...currentDeal, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={currentDeal.date}
                  onChange={(e) => setCurrentDeal({...currentDeal, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rep" className="text-right">Representative</Label>
                <Input
                  id="edit-rep"
                  value={currentDeal.rep}
                  onChange={(e) => setCurrentDeal({...currentDeal, rep: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select 
                  value={currentDeal.status} 
                  onValueChange={(value) => setCurrentDeal({...currentDeal, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Won">Won</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Negotiating">Negotiating</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
    </div>
  );
};

export default Deals;
