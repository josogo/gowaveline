
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import GlossaryTermItem from './GlossaryTermItem';
import { getPaginatedTerms } from '@/utils/trainingHelpers';

interface GlossaryListProps {
  displayedTerms: Array<{
    term: string;
    definition: string;
    example: string;
    simpleDefinition?: string;
  }>;
  expandedItems: string[];
  toggleExpanded: (itemValue: string) => void;
  currentPage: number;
  handlePageChange: (page: number) => void;
  itemsPerPage: number;
}

const GlossaryList: React.FC<GlossaryListProps> = ({
  displayedTerms,
  expandedItems,
  toggleExpanded,
  currentPage,
  handlePageChange,
  itemsPerPage,
}) => {
  const paginatedTerms = getPaginatedTerms(displayedTerms, currentPage, itemsPerPage);
  
  if (displayedTerms.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No terms found matching your search.</p>
      </div>
    );
  }
  
  return (
    <>
      <Accordion 
        type="multiple" 
        value={expandedItems}
        className="w-full"
      >
        {paginatedTerms.map((item, index) => (
          <GlossaryTermItem
            key={index}
            term={item}
            itemId={`item-${currentPage}-${index}`}
            onToggle={toggleExpanded}
          />
        ))}
      </Accordion>
      
      {/* Pagination controls */}
      {displayedTerms.length > itemsPerPage && (
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
            Page {currentPage} of {Math.ceil(displayedTerms.length / itemsPerPage)}
          </span>
          
          <Button 
            variant="outline"
            size="sm"
            disabled={currentPage >= Math.ceil(displayedTerms.length / itemsPerPage)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default GlossaryList;
