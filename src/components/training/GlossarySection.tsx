
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Processing Terms Glossary</CardTitle>
        <CardDescription>Search and learn common industry terminology</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search terms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="space-y-4">
          {filteredGlossaryTerms.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredGlossaryTerms.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
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
