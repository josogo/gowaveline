
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface GlossaryFiltersProps {
  showSimpleDefinitionsOnly: boolean;
  setShowSimpleDefinitionsOnly: (value: boolean) => void;
  viewMode: 'all' | 'categorized';
  isMobile: boolean;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  categories: string[];
}

const GlossaryFilters: React.FC<GlossaryFiltersProps> = ({
  showSimpleDefinitionsOnly,
  setShowSimpleDefinitionsOnly,
  viewMode,
  isMobile,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  return (
    <div className="flex gap-2">
      {/* Filter dropdown - show on all screen sizes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            {showSimpleDefinitionsOnly ? 'Simple Definitions' : 'All Definitions'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem 
            onClick={() => setShowSimpleDefinitionsOnly(false)}
            className={`cursor-pointer ${!showSimpleDefinitionsOnly ? 'bg-slate-100' : ''}`}
          >
            All Definitions
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowSimpleDefinitionsOnly(true)}
            className={`cursor-pointer ${showSimpleDefinitionsOnly ? 'bg-slate-100' : ''}`}
          >
            Simple Definitions Only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Category dropdown on mobile in categorized view */}
      {isMobile && viewMode === 'categorized' && (
        <Select 
          value={activeCategory || ''} 
          onValueChange={(value) => setActiveCategory(value || null)}
        >
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Select Letter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Letters</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default GlossaryFilters;
