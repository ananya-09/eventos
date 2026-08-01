"use client";

import { motion } from "framer-motion";
import { MessageSquare, PenSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/50"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200/50">
        <MessageSquare className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">No posts yet</h3>
      <p className="text-slate-500 max-w-md mb-8">
        This community is quiet right now. Be the first to start a conversation!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 rounded-full bg-[#34629f] text-white font-semibold shadow-sm hover:bg-[#2e68a8] transition-all flex items-center gap-2"
      >
        <PenSquare className="w-4 h-4" />
        Create the first post
      </motion.button>
    </motion.div>
  );
}
