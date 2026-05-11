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
    // Smooth progress using requestAnimationFrame with easing
    const duration = 2600; // ms
    const start = performance.now();
    let frameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Trigger completion callback immediately
      onComplete?.();

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('loaderComplete', 'true');
        window.dispatchEvent(new Event('loaderComplete'));
      }

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
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-999 transition-opacity duration-500 ${
        isHiding ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Brand Text with Glowing Gradient Shimmer */}
      <div className="mb-16 text-center">
        <h1 className="text-7xl md:text-8xl font-serif font-bold tracking-tighter">
          <span
            className="inline-block bg-linear-to-r from-white via-primary to-primary-glow bg-clip-text text-transparent"
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
          {progress}%
        </p>
      </div>

      {/* Thin Animated Progress Bar */}
      <div className="w-64 h-0.5 bg-violet-950/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-transparent via-primary to-primary-glow"
          style={{
            width: `${progress}%`,
            transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 20px rgba(74, 116, 167, 0.55)',
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
