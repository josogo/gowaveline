
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileUp, ArrowUpDown, Filter, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface DocumentsHeaderProps {
  onUploadClick: () => void;
  onCreatePreAppClick: () => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  currentFilter: string;
  currentSort: string;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  onUploadClick,
  onCreatePreAppClick,
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort,
}) => {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9]">
            Documents
          </h1>
          <p className="text-[#0EA5E9]/80 mt-2">
            Manage document templates and generate forms
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-[#0EA5E9] text-[#0EA5E9]">
                <Filter className="h-4 w-4 mr-2" />
                {currentFilter === 'all' ? 'All Documents' : 
                 currentFilter === 'templates' ? 'Templates Only' :
                 currentFilter === 'contracts' ? 'Contracts Only' :
                 currentFilter === 'preapp' ? 'Pre-Apps Only' : 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Documents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilterChange('all')}>
                All Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('templates')}>
                Templates Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('contracts')}>
                Contracts Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('preapp')}>
                Pre-App Forms Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-[#0EA5E9] text-[#0EA5E9]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {currentSort === 'newest' ? 'Newest First' : 
                 currentSort === 'oldest' ? 'Oldest First' :
                 currentSort === 'name-asc' ? 'Name (A-Z)' :
                 currentSort === 'name-desc' ? 'Name (Z-A)' : 'Sort'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Sort Documents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('name-asc')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('name-desc')}>
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onCreatePreAppClick} 
              className="h-9 border-[#FF9F5A] text-[#FF9F5A] hover:bg-[#FF9F5A]/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Pre-App
            </Button>
            
            <Button 
              size="sm" 
              onClick={onUploadClick} 
              className="h-9 bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
