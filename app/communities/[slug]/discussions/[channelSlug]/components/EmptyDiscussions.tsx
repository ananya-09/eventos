"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyDiscussionsProps {
  channelName: string;
  onCreateClick: () => void;
}

export default function EmptyDiscussions({ channelName, onCreateClick }: EmptyDiscussionsProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[300px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#34629f] border border-blue-100/50"
      >
        <MessageSquarePlus className="w-5 h-5 animate-pulse" />
      </motion.div>

      <div className="space-y-1.5 max-w-sm relative z-10">
        <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">No threads in #{channelName} yet</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Be the first to spark a conversation! Share your insights, ask a technical question, or post resources for the community.
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#34629f] text-white hover:bg-[#2e68a8] font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-200 relative z-10"
      >
        <Plus className="w-4 h-4" />
        <span>Start First Discussion</span>
      </button>
    </Card>
  );
}
