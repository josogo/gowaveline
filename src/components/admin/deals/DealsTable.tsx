
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Deal } from '@/contexts/CrmDataContext';

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

const DealsTable: React.FC<DealsTableProps> = ({ 
  deals, 
  sortField, 
  sortDirection, 
  onSortChange, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  onDealSelect,
  getStatusBadgeColor,
  getTeamMemberName
}) => {
  
  const getSortIcon = (field: keyof Deal) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('name')}
            >
              <div className="flex items-center">
                Business Name
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('value')}
            >
              <div className="flex items-center">
                Value
                {getSortIcon('value')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('contactName')}
            >
              <div className="flex items-center">
                Contact
                {getSortIcon('contactName')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('status')}
            >
              <div className="flex items-center">
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSortChange('assignedTo')}
            >
              <div className="flex items-center">
                Assigned To
                {getSortIcon('assignedTo')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No deals found
              </TableCell>
            </TableRow>
          ) : (
            deals.map((deal) => (
              <TableRow key={deal.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onDealSelect(deal)}>
                <TableCell className="font-medium">{deal.name}</TableCell>
                <TableCell>${deal.value.toLocaleString()}</TableCell>
                <TableCell>{deal.contactName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(deal.status)}>
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{getTeamMemberName(deal.assignedTo)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(deal);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(deal.id, 'closed');
                      }}>
                        Mark as Closed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(deal.id, 'pending');
                      }}>
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(deal.id, 'lost');
                      }}>
                        Mark as Lost
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(deal.id);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
