
import React from 'react';
import { Calendar, Tag, User, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <article 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <div 
          className="h-56 bg-center bg-cover transition-transform duration-300 group-hover:scale-105" 
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white shadow-sm">
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(post.date, 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime} min read
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author}</span>
          </div>
          
          <div className="flex items-center gap-1 text-orange-500 group-hover:gap-2 transition-all">
            <span className="text-sm font-medium">Read More</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
