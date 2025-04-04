
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: 'fade' | 'slide' | 'scale';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className,
  delay = 0,
  type = 'fade'
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 opacity-0',
        {
          'translate-y-8': type === 'slide',
          'scale-95': type === 'scale',
        },
        'animate-in:opacity-100 animate-in:translate-y-0 animate-in:scale-100',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
