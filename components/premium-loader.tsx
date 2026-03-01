'use client';

import { useState, useEffect } from 'react';

interface PremiumLoaderProps {
  onComplete?: () => void;
}

export default function PremiumLoader({ onComplete }: PremiumLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Simulate loading progress with non-linear curve
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99.5) {
          clearInterval(progressInterval);
          // Complete to 100% immediately
          return 100;
        }
        
        // Non-linear progress (faster at start, slower at end)
        const increment = Math.random() * (8 - 1.5) + 1.5;
        const newProgress = Math.min(prev + increment, 99.5);
        return newProgress;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Trigger completion callback immediately
      onComplete?.();

      // Start fade out after reaching 100%
      const fadeTimer = setTimeout(() => {
        setIsHiding(true);
      }, 300);

      // Remove from DOM after fade completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[999] transition-opacity duration-500 ${
        isHiding ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Brand Text with Glowing Gradient Shimmer */}
      <div className="mb-16 text-center">
        <h1 className="text-7xl md:text-8xl font-serif font-bold tracking-tighter">
          <span
            className="inline-block bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Eventos
          </span>
        </h1>
      </div>

      {/* Percentage Counter */}
      <div className="mb-12 text-center">
        <p className="text-white text-xl font-light tracking-wide tabular-nums">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Thin Animated Progress Bar */}
      <div className="w-64 h-0.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            width: `${progress}%`,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
