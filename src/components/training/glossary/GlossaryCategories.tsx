
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlossaryCategoriesProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  isMobile: boolean;
}

const GlossaryCategories: React.FC<GlossaryCategoriesProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  isMobile,
}) => {
  if (isMobile) {
    return null;
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-2">
          <Badge 
            variant={activeCategory === null ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge 
              key={category}
              variant={activeCategory === category ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
      
      {activeCategory && (
        <div className="flex items-center">
          <div className="text-sm text-muted-foreground">
            Showing terms starting with "{activeCategory}"
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-6 p-0"
            onClick={() => setActiveCategory(null)}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </>
  );
};

export default GlossaryCategories;
