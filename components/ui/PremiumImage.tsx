"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface PremiumImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
}

export default function PremiumImage({
  src,
  alt,
  fallbackSrc,
  className,
  ...props
}: PremiumImageProps) {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  // Sync state if source changes externally
  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
  }, [src]);

  const isFill = !!props.fill;

  return (
    <div 
      className={`relative overflow-hidden bg-slate-100 ${
        isFill ? "w-full h-full absolute inset-0" : ""
      } ${className || ""}`}
    >
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse z-10" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        className={`transition-all duration-500 ease-out ${
          isFill ? "object-cover w-full h-full" : ""
        } ${
          loading ? "scale-95 opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (fallbackSrc) setImgSrc(fallbackSrc);
        }}
        {...props}
      />
    </div>
  );
}
