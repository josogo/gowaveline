
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Deal } from '@/contexts/CrmDataContext';
import { Badge } from '@/components/ui/badge';
import { ArrowDownUp, ChevronDown, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DealsTableProps {
  deals: Deal[];
  sortField: keyof Deal;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: keyof Deal) => void;
  onStatusChange: (id: string, status: 'pending' | 'closed' | 'lost') => void;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
  onDealSelect: (deal: Deal) => void;
  getStatusBadgeColor: (status: string) => string;
  getTeamMemberName: (id: string) => string;
}

const DealsTable = ({ 
  deals, 
  sortField, 
  sortDirection,
  onSortChange,
  onStatusChange,
  onEdit,
  onDelete,
  onDealSelect,
  getStatusBadgeColor,
  getTeamMemberName,
}: DealsTableProps) => {
  const SortIcon = ({ field }: { field: keyof Deal }) => {
    if (field !== sortField) {
      return <ArrowDownUp className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[250px] cursor-pointer"
              onClick={() => onSortChange('name')}
            >
              <div className="flex items-center">
                Deal Name
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSortChange('contactName')}
            >
              <div className="flex items-center">
                Contact
                <SortIcon field="contactName" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('value')}
            >
              <div className="flex items-center">
                Revenue
                <SortIcon field="value" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Processing Volume
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSortChange('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSortChange('assignedTo')}
            >
              <div className="flex items-center">
                Assigned To
                <SortIcon field="assignedTo" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                No deals found. Add your first deal to get started.
              </TableCell>
            </TableRow>
          ) : (
            deals.map((deal) => (
              <TableRow 
                key={deal.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onDealSelect(deal)}
              >
                <TableCell className="font-medium">{deal.name}</TableCell>
                <TableCell>{deal.contactName}</TableCell>
                <TableCell>${deal.value}</TableCell>
                <TableCell>${deal.processingVolume || 0}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(deal.status)}>
                    {deal.status}
                  </Badge>
                </TableCell>
                <TableCell>{getTeamMemberName(deal.assignedTo)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => onEdit(deal)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this deal?')) {
                              onDelete(deal.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealsTable;
