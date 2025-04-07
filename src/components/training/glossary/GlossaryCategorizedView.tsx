
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import GlossaryTermItem from './GlossaryTermItem';
import { groupTermsByFirstLetter } from '@/utils/trainingHelpers';

interface GlossaryCategorizedViewProps {
  terms: Array<{
    term: string;
    definition: string;
    example: string;
    simpleDefinition?: string;
  }>;
  expandedItems: string[];
  toggleExpanded: (itemValue: string) => void;
}

const GlossaryCategorizedView: React.FC<GlossaryCategorizedViewProps> = ({
  terms,
  expandedItems,
  toggleExpanded,
}) => {
  const categorizedTerms = groupTermsByFirstLetter(terms);
  
  return (
    <div className="space-y-6">
      {Object.entries(categorizedTerms).map(([letter, terms]) => (
        <div key={letter} id={`category-${letter}`}>
          <h3 className="text-lg font-bold mb-2 bg-gray-50 p-2 rounded-md">{letter}</h3>
          <Accordion type="multiple" value={expandedItems} className="w-full">
            {terms.map((term, termIndex) => (
              <GlossaryTermItem
                key={termIndex}
                term={term}
                itemId={`item-${letter}-${termIndex}`}
                onToggle={toggleExpanded}
              />
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default GlossaryCategorizedView;
