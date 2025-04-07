
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';
import { hasSimpleDefinition } from '@/utils/trainingHelpers';

interface GlossaryTermProps {
  term: {
    term: string;
    definition: string;
    example: string;
    simpleDefinition?: string;
  };
  itemId: string;
  onToggle: (itemId: string) => void;
}

const GlossaryTermItem: React.FC<GlossaryTermProps> = ({
  term,
  itemId,
  onToggle,
}) => {
  return (
    <AccordionItem 
      value={itemId}
      onClick={() => onToggle(itemId)}
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
  );
};

export default GlossaryTermItem;
