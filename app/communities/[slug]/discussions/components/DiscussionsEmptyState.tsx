"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Hash, Users } from "lucide-react";
import NewDiscussionButton from "./NewDiscussionButton";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface DiscussionsEmptyStateProps {
  communitySlug: string;
  isMember: boolean;
}

export default function DiscussionsEmptyState({
  communitySlug,
  isMember,
}: DiscussionsEmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="glass-surface-strong rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center"
    >
      <motion.div
        variants={fadeUp}
        className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#34629f]/8 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        variants={fadeUp}
        className="w-16 h-16 rounded-[22px] bg-[#34629f]/10 border border-[#34629f]/15 flex items-center justify-center text-[#34629f] mb-5 relative z-10"
      >
        <MessageSquarePlus className="w-8 h-8" />
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-2 max-w-md relative z-10">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Start the first discussion
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Organized channels help your community find answers faster. Ask a question,
          share a resource, or kick off a debate — your thread gets its own space for replies.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest relative z-10"
      >
        <span className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-[#34629f]" /> Pick a channel
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#34629f]" /> Get replies
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 relative z-10">
        {isMember ? (
          <NewDiscussionButton communitySlug={communitySlug} />
        ) : (
          <p className="text-xs font-semibold text-slate-500">
            Join this community to start discussions.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
