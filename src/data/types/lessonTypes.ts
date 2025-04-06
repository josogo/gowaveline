
// Define the types for lesson content structure
export interface LessonSection {
  title: string;
  content: string;
  image?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonQuiz {
  questions: QuizQuestion[];
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  sections: LessonSection[];
  quiz: LessonQuiz;
}
