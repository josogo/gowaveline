
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that scrolls the window to the top when the route changes
 * This is important for mobile UX
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Sometimes the first scroll doesn't work on all mobile browsers,
    // so we add a small delay to ensure it happens
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
};
