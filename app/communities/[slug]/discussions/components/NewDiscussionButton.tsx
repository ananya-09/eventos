"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, MessageSquarePlus } from "lucide-react";

interface NewDiscussionButtonProps {
  communitySlug: string;
  variant?: "primary" | "compact";
  channelSlug?: string;
  className?: string;
}

export default function NewDiscussionButton({
  communitySlug,
  variant = "primary",
  channelSlug,
  className = "",
}: NewDiscussionButtonProps) {
  const href = channelSlug
    ? `/communities/${communitySlug}/discussions/new?channel=${channelSlug}`
    : `/communities/${communitySlug}/discussions/new`;

  if (variant === "compact") {
    return (
      <Link href={href} className={className}>
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#34629f]/10 hover:bg-[#34629f]/15 text-[#34629f] font-bold text-[10px] uppercase tracking-wider rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </motion.span>
      </Link>
    );
  }

  return (
    <Link href={href} className={className}>
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#34629f] hover:bg-[#2e68a8] text-white font-bold text-sm rounded-xl shadow-sm shadow-[#34629f]/20 hover:shadow-md transition-all"
      >
        <MessageSquarePlus className="w-4 h-4" />
        Start Discussion
      </motion.span>
    </Link>
  );
}
