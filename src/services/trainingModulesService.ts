
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all training modules
export async function getTrainingModules() {
  try {
    // Use fetch API instead of Supabase client to work around type issues
    const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/training_modules?order=order_num.asc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch training modules');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching training modules:', error);
    throw error;
  }
}

// Function to fetch a specific training module with its lessons
export async function getTrainingModule(id: number) {
  try {
    // Get module details using fetch API
    const moduleResponse = await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/training_modules?id=eq.${id}`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
      }
    });
    
    if (!moduleResponse.ok) {
      throw new Error('Failed to fetch training module');
    }
    
    const moduleData = await moduleResponse.json();
    const module = moduleData[0];
    
    // Get module lessons using fetch API
    const lessonsResponse = await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/training_lessons?module_id=eq.${id}&order=order_num.asc`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
      }
    });
    
    if (!lessonsResponse.ok) {
      throw new Error('Failed to fetch training lessons');
    }
    
    const lessons = await lessonsResponse.json();
    
    return { module, lessons };
  } catch (error) {
    console.error(`Error fetching training module ${id}:`, error);
    throw error;
  }
}

// Function to save quiz results
export async function saveModuleQuizResult(quizResult: any) {
  try {
    // Use fetch API to save quiz results
    const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/quiz_results', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lesson_id: quizResult.lessonId,
        score: quizResult.score,
        total_questions: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        correct_answers: quizResult.correctAnswers,
        incorrect_answers: quizResult.incorrectAnswers,
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save quiz result');
    }
    
    return await response.json();
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
    
    // Check if a record already exists using fetch API
    const checkResponse = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/lesson_progress?user_id=eq.${user.id}&lesson_id=eq.${moduleId}`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'
        }
      }
    );
    
    if (!checkResponse.ok) {
      throw new Error('Failed to check for existing progress');
    }
    
    const existingProgress = await checkResponse.json();
    
    if (existingProgress.length === 0) {
      // Insert new record using fetch API
      const insertResponse = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/lesson_progress', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: moduleId,
          completed: completed,
        })
      });
      
      if (!insertResponse.ok) {
        throw new Error('Failed to insert lesson progress');
      }
    } else {
      // Update existing record using fetch API
      const updateResponse = await fetch(
        `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/lesson_progress?id=eq.${existingProgress[0].id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            completed: completed,
            last_accessed: new Date().toISOString()
          })
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update lesson progress');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating module progress:', error);
    throw error;
  }
}
