
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import blogPosts from '@/data/blogPosts';
import BlogCard from '@/components/blog/BlogCard';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { ChevronDown, BookOpen, TrendingUp } from 'lucide-react';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, blogPosts.length));
  };

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1, visiblePosts);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-blue-500 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <BookOpen className="h-16 w-16 text-white mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Payment Processing
                <span className="block text-orange-100">Insights</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Expert advice, industry analysis, and actionable strategies to optimize your payment processing and grow your business.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">{blogPosts.length}+ Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Expert Insights</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Article</h2>
                <p className="text-xl text-gray-600">Don't miss our latest insights</p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <BlogCard 
                  post={featuredPost} 
                  onClick={() => openPost(featuredPost)}
                />
              </div>
            </div>
          </section>
        )}

        {/* Latest Articles Grid */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
              <p className="text-xl text-gray-600">Stay updated with the latest trends and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {regularPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  onClick={() => openPost(post)}
                />
              ))}
            </div>
            
            {visiblePosts < blogPosts.length && (
              <div className="flex justify-center">
                <Button 
                  onClick={loadMorePosts}
                  variant="outline"
                  className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg rounded-lg font-medium transition-all hover:border-orange-300"
                >
                  Load More Articles
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Never Miss an Update
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest payment processing insights delivered directly to your inbox.
            </p>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-4 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Subscribe to Newsletter
            </Button>
          </div>
        </section>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedPost && (
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-white">
            <div className="p-0">
              <BlogPostDetail post={selectedPost} />
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Blog;
