
// Export all lesson content
import { lesson1 } from './lessons/lesson1';
import { lesson2 } from './lessons/lesson2';
import { lesson3 } from './lessons/lesson3';
import { lesson4 } from './lessons/lesson4';
import { salesStrategiesLesson } from './lessons/salesStrategies';
import { extendedGlossaryTerms } from './lessons/glossaryTerms';
import { LessonContent } from './types/lessonTypes';

// Combine all lessons into one array
export const lessonContents: LessonContent[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  salesStrategiesLesson
];

// Export glossary terms
export { extendedGlossaryTerms };

// Export types
export type { LessonContent, LessonSection } from './types/lessonTypes';
