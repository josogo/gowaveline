
import React from 'react';
import { Filter } from 'lucide-react';
import { TrainingModule } from '@/components/training';

interface ModuleData {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
}

interface ModulesSectionProps {
  modules: ModuleData[];
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  onOpenModule: (moduleId: number) => void;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  modules,
  categoryFilter,
  setCategoryFilter,
  onOpenModule
}) => {
  // Get unique categories for filtering
  const categories = [...new Set(modules.map(module => module.category))];
  
  // Filter modules based on category
  const filteredModules = categoryFilter 
    ? modules.filter(module => module.category === categoryFilter)
    : modules;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0EA5E9]">Advanced Training Modules</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select 
            className="text-sm border rounded px-2 py-1"
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category, i) => (
              <option key={i} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <TrainingModule
            key={module.id}
            id={module.id}
            title={module.title}
            description={module.description}
            category={module.category}
            duration={module.duration}
            topics={module.topics}
            difficulty={module.difficulty}
            onClick={() => onOpenModule(module.id)}
          />
        ))}
      </div>
    </>
  );
};

export default ModulesSection;
