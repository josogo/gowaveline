
import React from 'react';
import { Calendar, Tag, User, Clock, Share2, ArrowLeft, Bookmark, Heart, MessageCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-none mx-auto bg-white">
      {/* Hero Image Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div 
          className="w-full h-full bg-center bg-cover"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Close Button */}
        <DialogClose className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all">
          <ArrowLeft className="h-5 w-5" />
        </DialogClose>
        
        {/* Article Meta Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-500/90 backdrop-blur-sm text-white">
                <Tag className="h-4 w-4 mr-2" />
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-base">{post.author}</p>
                  <p className="text-xs text-white/80">Author</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-white/90">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(post.date, 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  2.4k views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              24
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              8
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          <div className="text-xl text-gray-700 leading-relaxed mb-8 font-light border-l-4 border-orange-500 pl-6 bg-orange-50 py-4 rounded-r-lg">
            {post.excerpt}
          </div>
          
          <div 
            className="prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-img:rounded-xl prose-img:shadow-lg prose-strong:text-orange-600 prose-strong:font-semibold prose-li:text-gray-700 prose-li:mb-2 prose-blockquote:border-orange-200 prose-blockquote:bg-orange-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        {/* Article Footer */}
        <div className="mt-16 pt-8 border-t-2 border-gray-100">
          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Payment Processing', 'Merchant Services', 'Business Growth', 'Financial Technology'].map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-2xl p-8 border border-orange-100">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to Optimize Your Payments?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Found this article helpful? Take the next step and get your free payment processing analysis today. Our experts will review your current setup and identify opportunities for savings.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button 
                  onClick={() => navigate('/get-started')}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Get Your Free Analysis
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  Contact Our Experts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
