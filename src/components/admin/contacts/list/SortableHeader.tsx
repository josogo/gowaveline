
import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableHeaderProps {
  field: string;
  label: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  field, 
  label, 
  sortField, 
  sortDirection,
  onSort 
}) => {
  const isActive = sortField === field;
  
  return (
    <div 
      onClick={() => onSort ? onSort(field) : null}
      className={`flex items-center cursor-pointer hover:text-orange-500 transition-colors ${isActive ? 'text-orange-500' : ''}`}
    >
      {label}
      {isActive ? (
        sortDirection === 'asc' ? 
          <ArrowUp className="ml-1 h-4 w-4" /> : 
          <ArrowDown className="ml-1 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </div>
  );
};
