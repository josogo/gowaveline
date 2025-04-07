
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
    // Simpler animation approach - immediately show content
    const timer = setTimeout(() => {
      if (elementRef.current) {
        elementRef.current.classList.add('animate-in');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-500',
        // Make content fully visible by default, not faded
        {
          'opacity-100': type === 'fade',
          'translate-y-0': type === 'slide',
          'scale-100': type === 'scale',
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
