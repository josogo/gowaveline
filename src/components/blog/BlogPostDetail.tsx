
import React from 'react';
import { Calendar, Tag, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#0EA5E9]">{post.title}</DialogTitle>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(post.date, 'MMMM d, yyyy')}</span>
          <span className="mx-2">•</span>
          <User className="h-4 w-4 mr-1" />
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <Tag className="h-4 w-4 mr-1" />
          <span>{post.category}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.readTime} min read</span>
        </div>
      </DialogHeader>
      
      <div 
        className="mt-6 prose prose-lg max-w-none prose-headings:text-[#0EA5E9] prose-a:text-[#0EA5E9]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-8 pt-6 border-t">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <span className="text-gray-600">Found this article helpful? Share it!</span>
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-2 rounded-md"
          >
            Submit Your Statement
          </button>
        </div>
      </div>
    </>
  );
};

export default BlogPostDetail;
