
import { lessonContents } from '@/data';
import { extendedGlossaryTerms } from '@/data';

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
export function filterGlossaryTerms(terms: typeof extendedGlossaryTerms, searchTerm: string) {
  return terms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.example.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (term.simpleDefinition && term.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}
