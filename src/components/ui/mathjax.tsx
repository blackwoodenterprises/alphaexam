'use client';

import { useEffect, useRef, useState } from 'react';

interface MathJaxProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export function MathJax({ children, className = '', inline = false }: MathJaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const renderMath = async () => {
      if (window.MathJax && window.MathJax.typesetPromise && containerRef.current) {
        try {
          // Clear any existing MathJax content first
          if (window.MathJax.typesetClear) {
            window.MathJax.typesetClear([containerRef.current]);
          }
          // Re-render the math content
          await window.MathJax.typesetPromise([containerRef.current]);
        } catch (err) {
          console.error('MathJax rendering error:', err);
        }
      } else if (window.MathJax && !window.MathJax.typesetPromise) {
        // MathJax is still loading, wait and retry
        setTimeout(renderMath, 100);
      } else if (!window.MathJax) {
        // MathJax not loaded yet, wait for it
        setTimeout(renderMath, 200);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(renderMath, 50);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [children, isClient]);

  if (!isClient) {
    return (
      <div 
        className={className}
        style={{ display: inline ? 'inline' : 'block' }}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ display: inline ? 'inline' : 'block' }}
    >
      {children}
    </div>
  );
}

// Global MathJax type declaration
declare global {
  interface Window {
    MathJax: {
      tex?: {
        inlineMath?: string[][];
        displayMath?: string[][];
        processEscapes?: boolean;
        processEnvironments?: boolean;
      };
      options?: {
        skipHtmlTags?: string[];
      };
      startup?: {
        ready?: () => void;
        defaultReady?: () => void;
      };
      typesetPromise?: (elements: Element[]) => Promise<void>;
      typesetClear?: (elements: Element[]) => void;
    };
  }
}