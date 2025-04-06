
import { ModuleContent } from '@/components/training/ModuleDetail';

// Initialize placeholder modules for future implementation
export const createPlaceholderModule = (id: number): ModuleContent => ({
  id,
  title: `Module ${id}`,
  description: "This module content will be implemented in the future",
  duration: "Coming soon",
  sections: [
    {
      title: "Coming Soon",
      content: "<p>The full content for this module is being developed.</p>"
    }
  ],
  quiz: {
    questions: [
      {
        question: "Sample question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0
      }
    ]
  }
});

// Create placeholder modules for IDs 9 through 15
export const placeholderModules: Record<number, ModuleContent> = {};

// Populate placeholder modules
for (let i = 9; i <= 15; i++) {
  placeholderModules[i] = createPlaceholderModule(i);
}
