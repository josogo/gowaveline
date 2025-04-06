
import { lessonContents, extendedGlossaryTerms } from '@/data/lessonContent';

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
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
