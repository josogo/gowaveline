
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from 'lucide-react';

interface DealsHeaderProps {
  onAddDeal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DealsHeader: React.FC<DealsHeaderProps> = ({ 
  onAddDeal, 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-orange-500">Deals Management</CardTitle>
            <CardDescription>Track your pending and closed deals</CardDescription>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={onAddDeal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search deals..." 
            className="pl-10" 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default DealsHeader;
