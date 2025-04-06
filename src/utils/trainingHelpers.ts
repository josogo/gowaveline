
import { lessonContents } from '@/data';
import { extendedGlossaryTerms } from '@/data';

// Define the GlossaryTerm type to match the structure
interface GlossaryTerm {
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
  return terms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.example.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (term.simpleDefinition && term.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}
