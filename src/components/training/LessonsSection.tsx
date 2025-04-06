
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, CheckCircle } from 'lucide-react';

interface LessonData {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
}

interface LessonsSectionProps {
  lessons: LessonData[];
  onOpenLesson: (index: number) => void;
}

const LessonsSection: React.FC<LessonsSectionProps> = ({ lessons, onOpenLesson }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-3 bg-gradient-to-r from-orange-400 to-[#0EA5E9]"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9]">
                {lesson.id}
              </span>
              <span>{lesson.title}</span>
            </CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{lesson.topics.length} Topics</span>
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="topics">
                  <AccordionTrigger className="text-sm">
                    View Topics
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      {lesson.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-[#0EA5E9]"
                  onClick={() => onOpenLesson(lesson.id - 1)}
                >
                  <PlayCircle className="mr-1 h-4 w-4" />
                  Start Lesson
                </Button>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 flex items-center">
                  {lesson.duration}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LessonsSection;
