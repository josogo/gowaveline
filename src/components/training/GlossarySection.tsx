
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;
  simpleDefinition?: string;
}

interface GlossarySectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredGlossaryTerms: GlossaryTerm[];
}

const GlossarySection: React.FC<GlossarySectionProps> = ({
  searchTerm,
  setSearchTerm,
  filteredGlossaryTerms
}) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Helper to toggle expanded state
  const toggleExpanded = (itemValue: string) => {
    setExpandedItems(prev => 
      prev.includes(itemValue) 
        ? prev.filter(item => item !== itemValue) 
        : [...prev, itemValue]
    );
  };
  
  // Extract unique categories from terms (first letter)
  const categories = Array.from(
    new Set(
      filteredGlossaryTerms.map(term => term.term.charAt(0).toUpperCase())
    )
  ).sort();
  
  // Filter terms by active category
  const displayedTerms = activeCategory 
    ? filteredGlossaryTerms.filter(term => 
        term.term.charAt(0).toUpperCase() === activeCategory
      )
    : filteredGlossaryTerms;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Processing Terms Glossary</CardTitle>
        <CardDescription>Search and learn common industry terminology</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search terms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          
          {/* Category filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {activeCategory ? `Letter: ${activeCategory}` : 'All Terms'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                onClick={() => setActiveCategory(null)}
                className="cursor-pointer"
              >
                All Terms
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setActiveCategory(category)}
                  className="cursor-pointer"
                >
                  Letter: {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Category pills on desktop */}
        {!isMobile && categories.length > 0 && (
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
        
        {/* Active category indicator */}
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
        
        {/* Glossary terms */}
        <div className="space-y-4">
          {displayedTerms.length > 0 ? (
            <Accordion 
              type="multiple" 
              value={expandedItems}
              className="w-full"
            >
              {displayedTerms.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  onClick={() => toggleExpanded(`item-${index}`)}
                >
                  <AccordionTrigger className="font-medium hover:no-underline">
                    {item.term}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Definition:</div>
                        <p>{item.definition}</p>
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Example:</div>
                        <p className="text-sm bg-gray-50 p-3 rounded">{item.example}</p>
                      </div>
                      
                      {item.simpleDefinition && (
                        <div className="bg-orange-50 p-3 rounded-md border border-orange-100 mt-3">
                          <div className="font-medium text-orange-700 mb-1 text-sm">Explain Like I'm 5:</div>
                          <p className="text-sm">{item.simpleDefinition}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlossarySection;
