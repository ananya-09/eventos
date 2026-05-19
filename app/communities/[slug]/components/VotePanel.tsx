"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface VotePanelProps {
  postId: string;
  initialScore: number;
  initialUserVote: number | null; // 1, -1, or null
}

export default function VotePanel({ postId, initialScore, initialUserVote }: VotePanelProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (val: 1 | -1) => {
    if (isLoading) return;

    // Save original states for rollback
    const originalVote = userVote;
    const originalScore = score;

    let nextVote: number | null = val;
    let scoreDiff: number = val;

    if (originalVote === val) {
      // Undo vote
      nextVote = null;
      scoreDiff = -val;
    } else if (originalVote !== null) {
      // Toggle vote direction
      scoreDiff = 2 * val;
    }

    setUserVote(nextVote);
    setScore((s) => s + scoreDiff);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserVote(data.userVoted);
          setScore(data.score);
        } else {
          // Rollback
          setUserVote(originalVote);
          setScore(originalScore);
          toast.error(data.message || "Failed to submit vote");
        }
      } else {
        setUserVote(originalVote);
        setScore(originalScore);
        toast.error("You need at least 10 reputation to downvote!");
      }
    } catch (err) {
      setUserVote(originalVote);
      setScore(originalScore);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-full px-2 py-0.5 shadow-sm">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => handleVote(1)}
        className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer ${
          userVote === 1 ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
        }`}
        title="Upvote"
      >
        <ChevronUp className="w-4 h-4" />
      </motion.button>
      <span className={`text-xs font-bold tabular-nums px-0.5 min-w-[16px] text-center ${
        userVote === 1 ? "text-rose-500" : userVote === -1 ? "text-blue-500" : "text-slate-600 dark:text-slate-400"
      }`}>
        {score}
      </span>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => handleVote(-1)}
        className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer ${
          userVote === -1 ? "text-blue-500" : "text-slate-500 hover:text-blue-500"
        }`}
        title="Downvote"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
