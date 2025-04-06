
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all training modules
export async function getTrainingModules() {
  try {
    const { data, error } = await supabase
      .from('training_modules')
      .select('*')
      .order('order_num', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching training modules:', error);
    throw error;
  }
}

// Function to fetch a specific training module with its lessons
export async function getTrainingModule(id: number) {
  try {
    // Get module details
    const { data: module, error: moduleError } = await supabase
      .from('training_modules')
      .select('*')
      .eq('id', id)
      .single();
    
    if (moduleError) {
      throw moduleError;
    }
    
    // Get module lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('training_lessons')
      .select('*')
      .eq('module_id', id)
      .order('order_num', { ascending: true });
    
    if (lessonsError) {
      throw lessonsError;
    }
    
    return { module, lessons };
  } catch (error) {
    console.error(`Error fetching training module ${id}:`, error);
    throw error;
  }
}

// Function to save quiz results
export async function saveModuleQuizResult(quizResult: any) {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        lesson_id: quizResult.lessonId,
        score: quizResult.score,
        total_questions: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        correct_answers: quizResult.correctAnswers,
        incorrect_answers: quizResult.incorrectAnswers,
      });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

// Function to update module progress
export async function updateModuleProgress(moduleId: number, completed: boolean = false) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Handle non-authenticated user case
      return false;
    }
    
    // Check if a record already exists
    const { data: existingProgress, error: selectError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', moduleId)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // Not found error
      throw selectError;
    }
    
    if (!existingProgress) {
      // Insert new record
      const { error: insertError } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: moduleId,
          completed: completed,
        });
      
      if (insertError) {
        throw insertError;
      }
    } else {
      // Update existing record
      const { error: updateError } = await supabase
        .from('lesson_progress')
        .update({
          completed: completed,
          last_accessed: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating module progress:', error);
    throw error;
  }
}
