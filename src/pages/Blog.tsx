
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import AnimatedText from '@/components/AnimatedText';
import blogPosts from '@/data/blogPosts';
import BlogCard from '@/components/blog/BlogCard';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedText type="fade" className="mb-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-500">Payment Processing Insights</h1>
            </AnimatedText>
            <AnimatedText type="fade" delay={200} className="text-center mb-16">
              <p className="text-xl text-[#0EA5E9] max-w-3xl mx-auto">
                Expert advice, industry analysis, and actionable strategies to optimize your payment processing.
              </p>
            </AnimatedText>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, visiblePosts).map((post, index) => (
                <AnimatedText key={post.id} type="fade" delay={300 + (index * 50)}>
                  <BlogCard post={post} onClick={() => openPost(post)} />
                </AnimatedText>
              ))}
            </div>
            
            {visiblePosts < blogPosts.length && (
              <AnimatedText type="fade" delay={600} className="flex justify-center mt-12">
                <Button 
                  onClick={loadMorePosts}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-2 rounded-md"
                >
                  Load More Articles
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </AnimatedText>
            )}
          </div>
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedPost && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <BlogPostDetail post={selectedPost} />
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Blog;
