
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

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#0EA5E9]">Payment Processing Insights</h1>
            <p className="text-xl text-[#0EA5E9] text-center mb-16 max-w-3xl mx-auto">
              Expert advice, industry analysis, and actionable strategies to optimize your payment processing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  onClick={() => openPost(post)}
                />
              ))}
            </div>
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
