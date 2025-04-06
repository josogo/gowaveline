
import React from 'react';
import { Book, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface TrainingModuleProps {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  topics: readonly string[] | string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onClick: () => void;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({
  id,
  title,
  description,
  category,
  duration,
  topics,
  difficulty,
  onClick
}) => {
  // Determine badge color based on difficulty
  const getBadgeColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine icon based on category
  const getIcon = () => {
    switch (category) {
      case 'Sales Techniques':
        return <GraduationCap className="h-5 w-5 text-[#0EA5E9]" />;
      case 'Processing Knowledge':
        return <Book className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-[#0EA5E9]" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
      <div className="h-2 bg-gradient-to-r from-orange-400 to-[#0EA5E9]"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm text-gray-500">{category}</span>
          </div>
          <Badge className={`${getBadgeColor()}`}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium">
            {id}
          </span>
          <h3 className="text-lg font-bold text-[#0EA5E9]">{title}</h3>
        </div>
        
        <p className="text-orange-500 mb-4">{description}</p>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-600">Key Topics:</p>
          {topics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">{topic}</span>
            </div>
          ))}
          {topics.length > 3 && (
            <p className="text-xs text-gray-500 pl-6">+{topics.length - 3} more topics</p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button 
            variant="default"
            size="sm" 
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            onClick={onClick}
          >
            Start Module
          </Button>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainingModule;
