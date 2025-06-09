
import React from 'react';
import { Calendar, Tag, User, Clock, Share2, Bookmark } from 'lucide-react';
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
    <div className="max-w-none">
      {/* Hero Section */}
      <div className="relative mb-8">
        <div 
          className="w-full h-80 bg-center bg-cover rounded-xl shadow-lg relative overflow-hidden" 
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="flex items-center text-sm opacity-90">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Article Meta */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2 text-orange-500" />
              <span className="font-medium">{post.author}</span>
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              {format(post.date, 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-sm border p-10">
          <article 
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
              prose-h1:text-4xl prose-h1:text-orange-600 prose-h1:border-b-2 prose-h1:border-orange-200 prose-h1:pb-4 prose-h1:mb-8 prose-h1:mt-0
              prose-h2:text-3xl prose-h2:text-gray-800 prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-orange-500 prose-h2:pl-4
              prose-h3:text-2xl prose-h3:text-gray-700 prose-h3:mt-10 prose-h3:mb-5
              prose-h4:text-xl prose-h4:text-gray-600 prose-h4:mt-8 prose-h4:mb-4
              prose-p:text-gray-700 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-0
              prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
              prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-yellow-100 prose-strong:px-1 prose-strong:rounded
              prose-em:text-gray-600 prose-em:italic
              prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-orange-50 prose-blockquote:to-orange-25 
              prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:my-8
              prose-ul:my-8 prose-ul:space-y-3 prose-li:text-gray-700 prose-li:text-lg prose-li:leading-relaxed
              prose-ol:my-8 prose-ol:space-y-3
              prose-li:marker:text-orange-500 prose-li:marker:font-bold
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:border prose-img:border-gray-200
              prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8 prose-pre:overflow-x-auto
              prose-table:my-8 prose-table:w-full prose-table:border-collapse
              prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-bold prose-th:p-4 prose-th:border prose-th:border-gray-200
              prose-td:p-4 prose-td:border prose-td:border-gray-200 prose-td:text-gray-700
              prose-hr:my-12 prose-hr:border-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* Article Footer */}
      <div className="border-t border-gray-200 pt-8">
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to optimize your payment processing?
              </h3>
              <p className="text-gray-600">
                Get your free analysis and discover how much you could be saving.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Get Free Analysis
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tags:</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                Payment Processing
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                Business Tips
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
