
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, BookOpen, ArrowRightCircle } from 'lucide-react';
import { updateLessonProgress } from '@/services/trainingService';
import Quiz from './Quiz';

export interface ModuleSection {
  title: string;
  content: string;
  image?: string;
}

export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  sections: ModuleSection[];
  quiz: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface ModuleDetailProps {
  module: ModuleContent;
  onClose: () => void;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ module, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const handleNextSection = () => {
    if (currentSection < module.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      updateLessonProgress(module.id);
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
        lessonId={module.id}
        lessonTitle={module.title}
        questions={module.quiz.questions}
        onComplete={handleCompleteQuiz}
      />
    );
  }
  
  const currentSectionData = module.sections[currentSection];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0EA5E9]">{module.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{module.duration}</span>
          </div>
        </div>
        <p className="text-gray-600">{module.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>
            Section {currentSection + 1} of {module.sections.length}
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
              {currentSection < module.sections.length - 1 ? (
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

export default ModuleDetail;
