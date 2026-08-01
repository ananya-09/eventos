'use client';

import { useState, useEffect } from 'react';
import PremiumLoader from '@/components/premium-loader';

interface LoaderWrapperProps {
  children: React.ReactNode;
}

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  const [showContent, setShowContent] = useState(false);
  const [needsLoader, setNeedsLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const isLoaderDone = sessionStorage.getItem('loaderComplete');
    if (isLoaderDone) {
      setNeedsLoader(false);
      setShowContent(true);
    } else {
      setNeedsLoader(true);
    }
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Solid black cover screen to completely hide hydration layout shifts */}
      {!isMounted && (
        <div className="fixed inset-0 bg-black z-[99999]" />
      )}
      
      {needsLoader && (
        <PremiumLoader
          onComplete={() => {
            setNeedsLoader(false);
            setShowContent(true);
          }}
        />
      )}
      
      <div
        className={`transition-opacity duration-500 ${
          showContent || !isMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </>
  );
}
