
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    // Wait for window load
    const handleLoad = () => {
      // Min wait time of 2s for effect
      setTimeout(() => setIsLoaded(true), 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback
      setTimeout(handleLoad, 3000);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (isLoaded && loaderRef.current) {
        gsap.to(loaderRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => setShowPrompt(true)
        });
    }
  }, [isLoaded]);

  useEffect(() => {
      if (showPrompt && promptRef.current) {
          gsap.fromTo(promptRef.current, 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
      }
  }, [showPrompt]);

  const handleEnter = () => {
    if (!showPrompt || !containerRef.current) return;
    
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: onEnter
    });
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center bg-black text-white cursor-pointer select-none"
      onClick={handleEnter}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {!showPrompt ? (
             <div ref={loaderRef} className="flex flex-col items-center gap-4">
                 <div className="relative h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                     <div className="absolute inset-y-0 left-0 bg-white w-full origin-left animate-[shimmer_2s_infinite] opacity-50"></div>
                 </div>
             </div>
          ) : (
             <div ref={promptRef} className="flex flex-col items-center gap-3 cursor-target opacity-0">
                 <span className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-neutral-200 mix-blend-difference">
                     {isMobile ? "Tap to Enter" : "Click to Enter"}
                 </span>
             </div>
          )}

      </div>
    </div>
  );
};

export default LoadingScreen;
