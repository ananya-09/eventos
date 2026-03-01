'use client';

import { useState, useEffect } from 'react';
import PremiumLoader from '@/components/premium-loader';

interface LoaderWrapperProps {
  children: React.ReactNode;
}

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if loader has completed by checking localStorage or sessionStorage
    const checkLoaderComplete = () => {
      const isLoaderDone = sessionStorage.getItem('loaderComplete');
      if (isLoaderDone) {
        setShowContent(true);
      }
    };

    // Set up observer for loader completion
    const handleLoaderComplete = () => {
      sessionStorage.setItem('loaderComplete', 'true');
      setShowContent(true);
    };

    // Listen for custom event from loader
    window.addEventListener('loaderComplete', handleLoaderComplete);

    // Check on mount
    checkLoaderComplete();

    return () => {
      window.removeEventListener('loaderComplete', handleLoaderComplete);
    };
  }, []);

  return (
    <>
      <PremiumLoader onComplete={() => setShowContent(true)} />
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {children}
      </div>
    </>
  );
}
