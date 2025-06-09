
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
        <DialogTitle className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">{post.title}</DialogTitle>
        <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500">
          <span className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            {format(post.date, 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center mr-4">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </span>
          <span className="flex items-center mr-4">
            <Tag className="h-4 w-4 mr-1" />
            {post.category}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime} min read
          </span>
        </div>
      </DialogHeader>
      
      <div className="mt-8">
        <div 
          className="w-full h-72 md:h-96 bg-center bg-cover rounded-lg mb-8 shadow-md" 
          style={{ backgroundImage: `url(${post.image})` }}
        />
        
        <article 
          className="prose prose-lg max-w-none prose-headings:text-orange-500 prose-headings:font-bold prose-a:text-[#0EA5E9] prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-md prose-strong:text-[#0EA5E9] prose-strong:font-semibold prose-li:text-gray-700 space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <span className="text-gray-600 font-medium">Found this article helpful? Share it!</span>
          <button 
            onClick={() => navigate('/get-started')}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-3 rounded-md font-medium"
          >
            Get Your Free Analysis
          </button>
        </div>
      </div>
    </>
  );
};

export default BlogPostDetail;
