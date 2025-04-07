
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, ChevronDown, ArrowUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasSimpleDefinition, groupTermsByFirstLetter, getPaginatedTerms } from '@/utils/trainingHelpers';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showSimpleDefinitionsOnly, setShowSimpleDefinitionsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'categorized'>('all');
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);
  
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  // Effect to track scrolling for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      setScrollToTopVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Helper to toggle expanded state
  const toggleExpanded = (itemValue: string) => {
    setExpandedItems(prev => 
      prev.includes(itemValue) 
        ? prev.filter(item => item !== itemValue) 
        : [...prev, itemValue]
    );
  };
  
  // Apply filters
  let displayedTerms = [...filteredGlossaryTerms];
  
  // Filter by simple definitions if needed
  if (showSimpleDefinitionsOnly) {
    displayedTerms = displayedTerms.filter(term => hasSimpleDefinition(term));
  }
  
  // Filter by active category if in categorized view
  if (viewMode === 'categorized' && activeCategory) {
    displayedTerms = displayedTerms.filter(
      term => term.term.charAt(0).toUpperCase() === activeCategory
    );
  }
  
  // Extract unique categories from terms (first letter)
  const categories = Array.from(
    new Set(
      filteredGlossaryTerms.map(term => term.term.charAt(0).toUpperCase())
    )
  ).sort();
  
  // For pagination in non-categorized view
  const paginatedTerms = getPaginatedTerms(displayedTerms, currentPage, ITEMS_PER_PAGE);
  
  // For alphabetically categorized view
  const categorizedTerms = groupTermsByFirstLetter(displayedTerms);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of the glossary section
    const glossarySection = document.querySelector('#glossary-section');
    if (glossarySection) {
      glossarySection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Card id="glossary-section">
      <CardHeader>
        <CardTitle>Payment Processing Terms Glossary</CardTitle>
        <CardDescription>Search and learn common industry terminology</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* View mode tabs - for mobile */}
        {isMobile && (
          <Tabs 
            defaultValue="all" 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'all' | 'categorized')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">List View</TabsTrigger>
              <TabsTrigger value="categorized">By Letter</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search terms..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
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
        
        {/* Display Terms based on view mode */}
        <div className="space-y-4">
          {filteredGlossaryTerms.length > 0 ? (
            viewMode === 'all' ? (
              // List view with pagination
              <>
                <Accordion 
                  type="multiple" 
                  value={expandedItems}
                  className="w-full"
                >
                  {paginatedTerms.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${currentPage}-${index}`}
                      onClick={() => toggleExpanded(`item-${currentPage}-${index}`)}
                      className={hasSimpleDefinition(item) ? 'border-l-2 border-orange-200 pl-1' : ''}
                    >
                      <AccordionTrigger className="font-medium hover:no-underline">
                        {item.term}
                        {hasSimpleDefinition(item) && (
                          <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-600 border-orange-200 text-xs">
                            ELI5
                          </Badge>
                        )}
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
                
                {/* Pagination controls */}
                {displayedTerms.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm">
                      Page {currentPage} of {Math.ceil(displayedTerms.length / ITEMS_PER_PAGE)}
                    </span>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= Math.ceil(displayedTerms.length / ITEMS_PER_PAGE)}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              // Categorized view
              <div className="space-y-6">
                {Object.entries(categorizedTerms).map(([letter, terms]) => (
                  <div key={letter} id={`category-${letter}`}>
                    <h3 className="text-lg font-bold mb-2 bg-gray-50 p-2 rounded-md">{letter}</h3>
                    <Accordion type="multiple" value={expandedItems} className="w-full">
                      {terms.map((term, termIndex) => (
                        <AccordionItem 
                          key={termIndex} 
                          value={`item-${letter}-${termIndex}`}
                          onClick={() => toggleExpanded(`item-${letter}-${termIndex}`)}
                          className={hasSimpleDefinition(term) ? 'border-l-2 border-orange-200 pl-1' : ''}
                        >
                          <AccordionTrigger className="font-medium hover:no-underline">
                            {term.term}
                            {hasSimpleDefinition(term) && (
                              <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-600 border-orange-200 text-xs">
                                ELI5
                              </Badge>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div>
                                <div className="font-medium text-sm text-gray-500 mb-1">Definition:</div>
                                <p>{term.definition}</p>
                              </div>
                              
                              <div>
                                <div className="font-medium text-sm text-gray-500 mb-1">Example:</div>
                                <p className="text-sm bg-gray-50 p-3 rounded">{term.example}</p>
                              </div>
                              
                              {term.simpleDefinition && (
                                <div className="bg-orange-50 p-3 rounded-md border border-orange-100 mt-3">
                                  <div className="font-medium text-orange-700 mb-1 text-sm">Explain Like I'm 5:</div>
                                  <p className="text-sm">{term.simpleDefinition}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Scroll to top button */}
        {scrollToTopVisible && (
          <Button 
            className="fixed bottom-20 md:bottom-6 right-6 bg-[#0EA5E9] rounded-full h-10 w-10 p-0 shadow-md"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GlossarySection;
