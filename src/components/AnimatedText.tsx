
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
              if (elementRef.current) {
                elementRef.current.classList.add('animate-in');
              }
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

  const getInitialStyles = () => {
    if (type === 'fade') return 'opacity-0';
    if (type === 'scale') return 'opacity-0 scale-95';
    if (type === 'slide') {
      switch (direction) {
        case 'up': return 'opacity-0 translate-y-8';
        case 'down': return 'opacity-0 translate-y-[-16px]';
        case 'left': return 'opacity-0 translate-x-8';
        case 'right': return 'opacity-0 translate-x-[-16px]';
        default: return 'opacity-0 translate-y-8';
      }
    }
    return 'opacity-0';
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700',
        getInitialStyles(),
        'animate-in:opacity-100 animate-in:translate-y-0 animate-in:translate-x-0 animate-in:scale-100',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
