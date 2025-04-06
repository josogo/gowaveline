
export interface LessonSection {
  title: string;
  content: string;
  image?: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  sections: LessonSection[];
  quiz: {
    questions: Question[];
  };
}

// Re-export glossary terms if they existed in the original file
export const extendedGlossaryTerms = [
  // If glossary terms existed in the original lessonContent.ts file, 
  // they should be moved here
];
