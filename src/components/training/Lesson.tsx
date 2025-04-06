
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, BookOpen, ArrowRightCircle, FileText } from 'lucide-react';
import { updateLessonProgress } from '@/services/trainingService';
import Quiz from './Quiz';

interface LessonSection {
  title: string;
  content: string;
  image?: string;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  sections: LessonSection[];
  quiz: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface LessonProps {
  lesson: LessonContent;
  onClose: () => void;
}

const Lesson: React.FC<LessonProps> = ({ lesson, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const handleNextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      updateLessonProgress(lesson.id);
    } else {
      setShowQuiz(true);
    }
  };
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };
  
  const handleCompleteQuiz = () => {
    onClose();
  };
  
  if (showQuiz) {
    return (
      <Quiz 
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        questions={lesson.quiz.questions}
        onComplete={handleCompleteQuiz}
      />
    );
  }
  
  const currentSectionData = lesson.sections[currentSection];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0EA5E9]">{lesson.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{lesson.duration}</span>
          </div>
        </div>
        <p className="text-gray-600">{lesson.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <FileText className="h-4 w-4 mr-1" />
          <span>
            Section {currentSection + 1} of {lesson.sections.length}
          </span>
        </div>
      </div>
      
      <Card className="shadow-lg border-t-4 border-t-orange-500">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold">{currentSectionData.title}</h2>
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentSectionData.content }} />
          </div>
          
          {currentSectionData.image && (
            <div className="my-6 flex justify-center">
              <img 
                src={currentSectionData.image} 
                alt={currentSectionData.title}
                className="rounded-lg shadow-md max-h-[400px]"
              />
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            <Button
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              onClick={handleNextSection}
            >
              {currentSection < lesson.sections.length - 1 ? (
                <>
                  Next Section
                  <ArrowRightCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Take Quiz
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lesson;
