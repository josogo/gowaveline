
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  visible: boolean;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  visible
}) => {
  if (!visible) return null;
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Button 
      className="fixed bottom-20 md:bottom-6 right-6 bg-[#0EA5E9] rounded-full h-10 w-10 p-0 shadow-md"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTopButton;
