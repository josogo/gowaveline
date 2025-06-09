
import React from 'react';
import { Calendar, Tag, User, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto">
      <DialogHeader className="border-b border-gray-100 pb-6 mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            <Tag className="h-4 w-4 mr-1" />
            {post.category}
          </span>
        </div>
        
        <DialogTitle className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </DialogTitle>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(post.date, 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </DialogHeader>
      
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div 
            className="w-full h-80 md:h-96 bg-center bg-cover" 
            style={{ backgroundImage: `url(${post.image})` }}
          />
        </div>
        
        <article 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-md prose-strong:text-orange-600 prose-strong:font-semibold prose-li:text-gray-700 prose-blockquote:border-orange-200 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Found this article helpful? Take the next step and get your free payment processing analysis today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Button 
                onClick={() => navigate('/get-started')}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Get Your Free Analysis
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg font-medium transition-all"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
