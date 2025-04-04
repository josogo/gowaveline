
import React from 'react';
import { Calendar, Tag, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="h-48 bg-center bg-cover" 
        style={{ backgroundImage: `url(${post.image})` }}
      />
      <div className="p-6">
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(post.date, 'MMM d, yyyy')}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.readTime} min read</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-[#0EA5E9]">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-500">{post.author}</span>
          </div>
          <div className="flex items-center text-sm">
            <Tag className="h-4 w-4 mr-1 text-[#0EA5E9]" />
            <span className="text-[#0EA5E9]">{post.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
