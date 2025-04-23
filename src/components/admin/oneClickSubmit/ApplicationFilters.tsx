
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ApplicationFiltersProps {
  onFilterChange: (filters: {
    searchTerm: string;
    status: string;
    sortBy: string;
  }) => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value, status, sortBy });
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ searchTerm, status: value, sortBy });
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({ searchTerm, status, sortBy: value });
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between mb-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search applications..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Business Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Business Name (Z-A)</SelectItem>
            <SelectItem value="progress-high">Highest Progress</SelectItem>
            <SelectItem value="progress-low">Lowest Progress</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
