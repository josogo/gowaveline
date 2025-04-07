
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
  
  // Sort the keys alphabetically and sort terms within each group alphabetically
  return Object.keys(grouped).sort().reduce((result, key) => {
    // Sort terms within this letter group alphabetically
    result[key] = grouped[key].sort((a, b) => a.term.localeCompare(b.term));
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

// Get an optimal number of items per page based on screen size
export function getOptimalItemsPerPage(isMobile: boolean, isTablet: boolean): number {
  if (isMobile) return 5;
  if (isTablet) return 8;
  return 10;
}

// Format duration string for display
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  }
}

// Detect if the current device is a tablet (useful for responsive design decisions)
export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  return width >= 640 && width < 1024;
}

// Get suggested related terms based on current term
export function getRelatedTerms(
  currentTerm: GlossaryTerm, 
  allTerms: GlossaryTerm[], 
  count: number = 3
): GlossaryTerm[] {
  // In a real app, this would use NLP or a more sophisticated algorithm
  // For now, we'll use a simple keyword matching approach
  
  // Extract keywords from the current term's definition
  const keywords = currentTerm.definition
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 4) // Only use longer words as potential keywords
    .slice(0, 5); // Limit to first 5 potential keywords
    
  // Score other terms based on keyword matches
  const scoredTerms = allTerms
    .filter(term => term.term !== currentTerm.term) // Exclude current term
    .map(term => {
      let score = 0;
      
      // Check keyword matches in definition
      keywords.forEach(keyword => {
        if (term.definition.toLowerCase().includes(keyword)) {
          score += 2;
        }
        if (term.term.toLowerCase().includes(keyword)) {
          score += 3;
        }
      });
      
      return { term, score };
    })
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, count); // Take top matches
    
  return scoredTerms.map(item => item.term);
}
