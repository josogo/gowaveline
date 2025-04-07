
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className,
  delay = 0,
  type = 'fade',
  direction = 'up'
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
        'transition-all duration-700',
        {
          'opacity-0': type === 'fade',
          'opacity-0 translate-y-6': type === 'slide' && direction === 'up',
          'opacity-0 translate-y-[-24px]': type === 'slide' && direction === 'down',
          'opacity-0 translate-x-6': type === 'slide' && direction === 'left',
          'opacity-0 translate-x-[-24px]': type === 'slide' && direction === 'right',
          'opacity-0 scale-95': type === 'scale',
        },
        'animate-in:opacity-100 animate-in:translate-y-0 animate-in:translate-x-0 animate-in:scale-100',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
