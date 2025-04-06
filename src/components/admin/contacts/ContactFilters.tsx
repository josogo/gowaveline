
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ContactFiltersProps {
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
  onSearchChange?: (query: string) => void;
  statusFilter?: string;
  typeFilter?: string;
  searchQuery?: string;
  onFilter?: (filters: Record<string, any>) => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  onStatusChange,
  onTypeChange,
  onSearchChange,
  statusFilter = 'all',
  typeFilter = 'all',
  searchQuery = '',
  onFilter
}) => {
  const [status, setStatus] = useState(statusFilter);
  const [type, setType] = useState(typeFilter);
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    if (onFilter) {
      onFilter({
        status,
        type,
        search
      });
    }
  }, [status, type, search, onFilter]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (onStatusChange) {
      onStatusChange(value);
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    if (onTypeChange) {
      onTypeChange(value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="churned">Churned</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="client">Client</SelectItem>
          <SelectItem value="partner">Partner</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
