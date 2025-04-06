
import { lessonContents } from '@/data';
import { extendedGlossaryTerms } from '@/data';

// Define the GlossaryTerm type to match the structure
export interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;
  simpleDefinition?: string;
}

// Process lesson data for display
export function prepareLessonData() {
  return lessonContents.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    topics: lesson.topics
  }));
}

// Filter glossary terms based on search
export function filterGlossaryTerms(terms: GlossaryTerm[], searchTerm: string) {
  if (!searchTerm) return terms;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
  
  return terms.filter(term => 
    term.term.toLowerCase().includes(lowerCaseSearchTerm) || 
    term.definition.toLowerCase().includes(lowerCaseSearchTerm) ||
    term.example.toLowerCase().includes(lowerCaseSearchTerm) ||
    (term.simpleDefinition && term.simpleDefinition.toLowerCase().includes(lowerCaseSearchTerm))
  );
}

// Group glossary terms by first letter for alphabetical navigation
export function groupTermsByFirstLetter(terms: GlossaryTerm[]) {
  const grouped: Record<string, GlossaryTerm[]> = {};
  
  terms.forEach(term => {
    const firstLetter = term.term.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(term);
  });
  
  // Sort the keys alphabetically
  return Object.keys(grouped).sort().reduce((result, key) => {
    result[key] = grouped[key];
    return result;
  }, {} as Record<string, GlossaryTerm[]>);
}

// Check if a term has a simple definition
export function hasSimpleDefinition(term: GlossaryTerm): boolean {
  return !!term.simpleDefinition;
}

// Get a filtered subset of terms for mobile view to improve performance
export function getPaginatedTerms(
  terms: GlossaryTerm[], 
  page: number, 
  itemsPerPage: number
): GlossaryTerm[] {
  const startIdx = (page - 1) * itemsPerPage;
  return terms.slice(startIdx, startIdx + itemsPerPage);
}
