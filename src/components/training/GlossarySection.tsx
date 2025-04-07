
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { hasSimpleDefinition, filterGlossaryTerms } from '@/utils/trainingHelpers';
import {
  GlossarySearchBar,
  GlossaryFilters,
  GlossaryCategories,
  GlossaryList,
  GlossaryCategorizedView,
  ScrollToTopButton,
  ViewModeTabs
} from './glossary';

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
        <ViewModeTabs 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          isMobile={isMobile} 
        />
        
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <GlossarySearchBar 
            searchTerm={searchTerm}
            setSearchTerm={(value) => {
              setSearchTerm(value);
              setCurrentPage(1); // Reset to first page on new search
            }}
          />
          
          <GlossaryFilters 
            showSimpleDefinitionsOnly={showSimpleDefinitionsOnly}
            setShowSimpleDefinitionsOnly={setShowSimpleDefinitionsOnly}
            viewMode={viewMode}
            isMobile={isMobile}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
          />
        </div>
        
        {/* Category pills on desktop */}
        <GlossaryCategories 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isMobile={isMobile}
        />
        
        {/* Display Terms based on view mode */}
        <div className="space-y-4">
          {filteredGlossaryTerms.length > 0 ? (
            viewMode === 'all' ? (
              // List view with pagination
              <GlossaryList 
                displayedTerms={displayedTerms}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            ) : (
              // Categorized view
              <GlossaryCategorizedView 
                terms={displayedTerms}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
              />
            )
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Scroll to top button */}
        <ScrollToTopButton visible={scrollToTopVisible} />
      </CardContent>
    </Card>
  );
};

export default GlossarySection;
