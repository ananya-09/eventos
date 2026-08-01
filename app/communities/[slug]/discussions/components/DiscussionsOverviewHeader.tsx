"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import NewDiscussionButton from "./NewDiscussionButton";
import { fadeUp } from "@/lib/animations";

interface DiscussionsOverviewHeaderProps {
  communitySlug: string;
  totalDiscussions: number;
  totalChannels: number;
  isMember: boolean;
}

export default function DiscussionsOverviewHeader({
  communitySlug,
  totalDiscussions,
  totalChannels,
  isMember,
}: DiscussionsOverviewHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-surface-strong rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-[#34629f]/6 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2 text-[#34629f]">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">
            Community Discussions
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          Channels & threads
        </h2>
        <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
          Browse categories on the left, or start a new discussion in any channel.
          {totalDiscussions > 0 && (
            <span className="font-semibold text-slate-600">
              {" "}
              {totalDiscussions} active thread{totalDiscussions !== 1 ? "s" : ""} across{" "}
              {totalChannels} channel{totalChannels !== 1 ? "s" : ""}.
            </span>
          )}
        </p>
      </div>

      {isMember && (
        <div className="relative z-10 shrink-0">
          <NewDiscussionButton communitySlug={communitySlug} />
        </div>
      )}
    </motion.div>
  );
}
