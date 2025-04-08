
import React from 'react';
import { Tag } from 'lucide-react';

interface TagListProps {
  tags: string[];
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </div>
      ))}
    </div>
  );
};
