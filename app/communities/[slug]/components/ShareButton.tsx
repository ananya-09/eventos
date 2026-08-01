"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  slug: string;
  name: string;
}

export default function ShareButton({ slug, name }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/communities/${slug}`;
    }
    return `https://eventos.io/communities/${slug}`;
  };

  const handleShare = async () => {
    const fullUrl = getFullUrl();
    const shareData = {
      title: name,
      text: `Join the ${name} community on Eventos!`,
      url: fullUrl,
    };

    // If native sharing is supported, use it!
    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
        return;
      } catch (err) {
        // Share cancelled or failed, fallback to copy if it wasn't a manual AbortError
        if (err instanceof Error && err.name === "AbortError") {
          return; // user cancelled, no error toast
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-5 py-2 rounded-full glass-surface border border-slate-200/80 text-slate-800 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
      title="Share or copy community link"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={copied ? "check" : "share"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.12 }}
          className="flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#34629f]" />
              <span>Share</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
