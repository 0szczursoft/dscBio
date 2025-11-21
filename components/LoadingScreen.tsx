
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        onComplete: () => setShowPrompt(true)
      });
    }
  }, [isLoaded]);

  const handleEnter = () => {
    if (!showPrompt) return;
    
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
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none overflow-hidden"
      onClick={handleEnter}
    >
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center p-4">
        {!isLoaded ? (
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
             </div>
        ) : (
            <div 
                ref={textRef} 
                className="opacity-0 translate-y-4 flex flex-col items-center gap-4 cursor-pointer"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mix-blend-difference font-display uppercase">
                    System Ready
                </h1>
                <div 
                    className={`text-sm md:text-base tracking-[0.3em] uppercase text-neutral-400 transition-opacity duration-500 ${showPrompt ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
                >
                    {isMobile ? "Tap to Initialize" : "Click to Initialize"}
                </div>
            </div>
        )}
      </div>
      
      {/* Abstract Background Elements for Loading */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
