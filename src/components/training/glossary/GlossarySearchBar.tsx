
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GlossarySearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const GlossarySearchBar: React.FC<GlossarySearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input 
        placeholder="Search terms..." 
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="pl-9"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8 text-gray-400"
          onClick={() => setSearchTerm('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default GlossarySearchBar;
