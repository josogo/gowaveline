
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { saveQuizResult, updateLessonProgress } from '@/services/trainingService';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  lessonId: number;
  lessonTitle: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ lessonId, lessonTitle, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
    percentage: 0
  });

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(parseInt(value));
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    
    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz(newAnswers);
    }
  };

  const completeQuiz = async (finalAnswers: number[]) => {
    setIsSubmitting(true);
    
    // Calculate results
    let correctCount = 0;
    
    finalAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const incorrectCount = questions.length - correctCount;
    const percentageScore = Math.round((correctCount / questions.length) * 100);
    
    // Set score state
    setScore({
      correct: correctCount,
      incorrect: incorrectCount,
      percentage: percentageScore
    });
    
    // Save quiz result to Supabase
    const quizResult = {
      lessonId,
      score: correctCount,
      totalQuestions: questions.length,
      percentage: percentageScore,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount
    };
    
    const saved = await saveQuizResult(quizResult);
    
    // Mark lesson as completed
    if (percentageScore >= 60) { // Consider 60% as passing
      await updateLessonProgress(lessonId, true);
    } else {
      await updateLessonProgress(lessonId, false);
    }
    
    if (saved) {
      toast.success("Quiz results saved!");
    } else {
      toast.error("Failed to save quiz results");
    }
    
    setQuizCompleted(true);
    setIsSubmitting(false);
  };

  const renderScoreMessage = () => {
    if (score.percentage >= 80) {
      return "Excellent job! You've mastered this lesson.";
    } else if (score.percentage >= 60) {
      return "Good work! You've passed the quiz.";
    } else {
      return "You might want to review the lesson material and try again.";
    }
  };

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-t-4 border-t-blue-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{score.percentage}%</h3>
            <p className="text-gray-600">{renderScoreMessage()}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Questions</span>
              <span>{questions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Correct Answers
              </span>
              <span className="font-medium text-green-600">{score.correct}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                Incorrect Answers
              </span>
              <span className="font-medium text-red-600">{score.incorrect}</span>
            </div>
            
            <Progress 
              value={score.percentage} 
              className="h-2"
              indicatorClassName={score.percentage >= 60 ? "bg-green-500" : "bg-red-500"}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            onClick={onComplete}
          >
            Return to Lesson
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  
  return (
    <Card className="w-full max-w-3xl mx-auto border border-gray-200">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {lessonTitle}
          </span>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="h-1 mb-4" />
        <CardTitle>{currentQ.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={handleAnswerChange}>
          {currentQ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 mb-3 hover:bg-gray-50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
          disabled={selectedAnswer === null || isSubmitting}
          onClick={handleNext}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : currentQuestion < questions.length - 1 ? (
            "Next Question"
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
