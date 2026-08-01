"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Bookmark, Share2, Loader2, Bell, BellOff, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VotePanel from "../../../components/VotePanel";

interface ThreadActionsProps {
  postId: string;
  initialLikesCount: number;
  initialCommentsCount: number;
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
  initialIsWatched: boolean;
  initialIsMuted: boolean;
  isLocked?: boolean;
}

export default function ThreadActions({
  postId,
  initialLikesCount,
  initialCommentsCount,
  initialIsLiked,
  initialIsBookmarked,
  initialIsWatched,
  initialIsMuted,
  isLocked = false,
}: ThreadActionsProps) {
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const [isWatched, setIsWatched] = useState(initialIsWatched);
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [isWatchLoading, setIsWatchLoading] = useState(false);
  const [isMuteLoading, setIsMuteLoading] = useState(false);

  const [isSharing, setIsSharing] = useState(false);

  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    try {
      const res = await fetch(`/api/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Post reported successfully!");
        setIsReporting(false);
        setReportReason("");
      } else {
        toast.error(data.message || "Failed to submit report");
      }
    } catch (err) {
      toast.error("Error reporting post");
    }
  };

  // Toggle Bookmark with Optimistic UI updates
  const handleBookmark = async () => {
    if (isBookmarkLoading) return;

    setIsBookmarked(!isBookmarked);
    setIsBookmarkLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to bookmark");
      }

      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
        toast.success(data.bookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
      } else {
        setIsBookmarked(isBookmarked);
        toast.error("You need to login to bookmark posts!");
      }
    } catch (err) {
      setIsBookmarked(isBookmarked);
      toast.error("Something went wrong");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Toggle Watch subscription
  const handleWatch = async () => {
    if (isWatchLoading) return;
    setIsWatchLoading(true);

    const nextWatchState = !isWatched;
    try {
      const res = await fetch("/api/notifications/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "THREAD",
          targetId: postId,
          type: "WATCH",
          remove: isWatched,
        }),
      });

      if (res.ok) {
        setIsWatched(nextWatchState);
        if (nextWatchState) {
          setIsMuted(false);
        }
        toast.success(nextWatchState ? "Watching thread for new activities" : "Stopped watching thread");
      } else {
        toast.error("You need to login to watch threads!");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsWatchLoading(false);
    }
  };

  // Toggle Mute subscription
  const handleMute = async () => {
    if (isMuteLoading) return;
    setIsMuteLoading(true);

    const nextMuteState = !isMuted;
    try {
      const res = await fetch("/api/notifications/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "THREAD",
          targetId: postId,
          type: "MUTE",
          remove: isMuted,
        }),
      });

      if (res.ok) {
        setIsMuted(nextMuteState);
        if (nextMuteState) {
          setIsWatched(false);
        }
        toast.success(nextMuteState ? "Muted thread notifications" : "Unmuted thread notifications");
      } else {
        toast.error("You need to login to mute threads!");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsMuteLoading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Could not copy link");
    } finally {
      setTimeout(() => setIsSharing(false), 800);
    }
  };

  const handleCommentsClick = () => {
    const section = document.getElementById("comments-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800/60 py-3.5 mt-4">
      <div className="flex items-center gap-5">
        {/* Up/Down Vote Capsule */}
        <VotePanel
          postId={postId}
          initialScore={initialLikesCount}
          initialUserVote={initialIsLiked ? 1 : null}
        />

        {/* Comment Count Button */}
        <button
          onClick={handleCommentsClick}
          className="flex items-center gap-2 group cursor-pointer text-slate-500 hover:text-[#34629f] transition-colors focus:outline-none text-xs font-semibold"
          aria-label="Scroll to comments"
        >
          <div className="p-2 rounded-full transition-colors duration-200 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/10">
            <MessageSquare className="w-4 h-4 stroke-slate-500 group-hover:stroke-[#34629f]" />
          </div>
          <span className="tabular-nums">{initialCommentsCount} Comments</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Watch/Follow Button */}
        <button
          onClick={handleWatch}
          title={isWatched ? "Unwatch Thread" : "Watch Thread"}
          className={`group p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
            isWatched
              ? "bg-blue-50 dark:bg-blue-950/20 text-[#34629f]"
              : "bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/10 text-slate-500 hover:text-[#34629f]"
          }`}
          aria-label="Watch thread"
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {isWatchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#34629f]" />
            ) : (
              <Bell
                className={`w-4 h-4 transition-all ${
                  isWatched ? "fill-[#34629f] stroke-[#34629f]" : "stroke-slate-500 group-hover:stroke-[#34629f]"
                }`}
              />
            )}
          </motion.div>
        </button>

        {/* Mute Button */}
        <button
          onClick={handleMute}
          title={isMuted ? "Unmute Thread" : "Mute Thread"}
          className={`group p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
            isMuted
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500"
              : "bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/10 text-slate-500 hover:text-rose-500"
          }`}
          aria-label="Mute thread"
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {isMuteLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            ) : (
              <BellOff
                className={`w-4 h-4 transition-all ${
                  isMuted ? "fill-rose-500 stroke-rose-500" : "stroke-slate-500 group-hover:stroke-rose-500"
                }`}
              />
            )}
          </motion.div>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`group p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
            isBookmarked
              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-500"
              : "bg-transparent hover:bg-amber-50 dark:hover:bg-amber-950/10 text-slate-500 hover:text-amber-500"
          }`}
          aria-label="Bookmark post"
        >
          <motion.div
            whileTap={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {isBookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            ) : (
              <Bookmark
                className={`w-4 h-4 transition-all ${
                  isBookmarked ? "fill-amber-500 stroke-amber-500" : "stroke-slate-500 group-hover:stroke-amber-500"
                }`}
              />
            )}
          </motion.div>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className={`group p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
            isSharing
              ? "bg-sky-50 dark:bg-sky-950/20 text-[#34629f]"
              : "bg-transparent hover:bg-sky-50 dark:hover:bg-sky-950/10 text-slate-500 hover:text-[#34629f]"
          }`}
          aria-label="Share post"
        >
          <motion.div
            animate={isSharing ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Share2 className="w-4 h-4 stroke-slate-500 group-hover:stroke-[#34629f]" />
          </motion.div>
        </button>

        {/* Report Button */}
        <button
          onClick={() => setIsReporting(!isReporting)}
          title="Report Post"
          className={`group p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 ${
            isReporting
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500"
              : "bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/10 text-slate-500 hover:text-rose-500"
          }`}
          aria-label="Report post"
        >
          <motion.div whileTap={{ scale: 0.9 }}>
            <AlertTriangle className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {isReporting && (
        <div className="flex gap-2 items-center w-full mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/40">
          <input
            type="text"
            placeholder="Tell us why this post is inappropriate (e.g. spam, abuse)..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none flex-1"
          />
          <button
            onClick={submitReport}
            className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Submit
          </button>
          <button
            onClick={() => setIsReporting(false)}
            className="text-xs text-slate-400 font-bold hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
