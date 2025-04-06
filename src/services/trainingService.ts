
import { supabase } from '@/integrations/supabase/client';

interface QuizResult {
  lessonId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export async function saveQuizResult(quizResult: QuizResult) {
  try {
    // Get the current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    // Save the quiz result to Supabase
    // We're using any type here because the TypeScript definitions haven't been updated yet
    // with the quiz_results table
    const { data, error } = await supabase
      .from('quiz_results' as any)
      .insert({
        user_id: user?.id || null, // Will be null for non-authenticated users
        lesson_id: quizResult.lessonId,
        score: quizResult.score,
        total_questions: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        correct_answers: quizResult.correctAnswers,
        incorrect_answers: quizResult.incorrectAnswers
      } as any);
    
    if (error) {
      console.error('Error saving quiz result:', error);
      return false;
    }
    
    // Send email notification about the quiz result
    await supabase.functions.invoke('send-email', {
      body: JSON.stringify({
        type: 'quiz',
        subject: `Quiz Result - Lesson ${quizResult.lessonId}`,
        data: {
          lessonId: quizResult.lessonId,
          score: quizResult.score,
          totalQuestions: quizResult.totalQuestions,
          percentage: quizResult.percentage,
          correctAnswers: quizResult.correctAnswers,
          incorrectAnswers: quizResult.incorrectAnswers,
          userId: user?.id || 'anonymous',
        }
      }),
    });
    
    console.log('Quiz result saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
}

export async function updateLessonProgress(lessonId: number, completed: boolean = false) {
  try {
    // Get the current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated, not saving lesson progress');
      return false;
    }
    
    // Check if a record already exists
    // Using any type because the TypeScript definitions haven't been updated yet
    const { data: existingProgress } = await supabase
      .from('lesson_progress' as any)
      .select()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();
    
    if (existingProgress) {
      // Update existing record
      const { error } = await supabase
        .from('lesson_progress' as any)
        .update({
          completed: completed,
          last_accessed: new Date().toISOString()
        } as any)
        .eq('id', existingProgress.id);
      
      if (error) {
        console.error('Error updating lesson progress:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('lesson_progress' as any)
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: completed,
        } as any);
      
      if (error) {
        console.error('Error inserting lesson progress:', error);
        return false;
      }
    }
    
    console.log('Lesson progress updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return false;
  }
}
