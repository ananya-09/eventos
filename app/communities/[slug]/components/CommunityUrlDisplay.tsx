"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityUrlDisplay({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayUrl = `eventos.com/communities/${slug}`;

  const handleCopy = async () => {
    try {
      const fullUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/communities/${slug}`
          : `https://eventos.com/communities/${slug}`;

      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 text-slate-400 hover:text-[#34629f] transition-all text-[11px] font-bold shadow-inner cursor-pointer"
      title="Click to copy community URL"
    >
      <span className="font-semibold select-all text-slate-500 hover:text-[#34629f] transition-colors">
        {displayUrl}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.12 }}
          className="shrink-0"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3 text-slate-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
