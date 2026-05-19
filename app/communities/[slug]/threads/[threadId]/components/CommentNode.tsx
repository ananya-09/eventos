"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, CornerDownRight, ChevronDown, ChevronUp, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommentComposer from "./CommentComposer";
import { useCommentSection } from "./CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface CommentType {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  score?: number;
  userVote?: number | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  _count?: {
    replies: number;
  };
}

interface CommentNodeInnerProps {
  comment: CommentType;
  depth: number;
  replies: CommentType[];
  nextCursor: string | null;
  isExpanded: boolean;
  isLoading: boolean;
  toggleExpand: (commentId: string) => Promise<void>;
  loadMoreReplies: (commentId: string) => Promise<void>;
  addReply: (content: string, parentId?: string) => Promise<void>;
  isThreadLocked: boolean;
}

const MAX_VISUAL_DEPTH = 4;

function CommentNodeInner({
  comment,
  depth,
  replies,
  nextCursor,
  isExpanded,
  isLoading,
  toggleExpand,
  loadMoreReplies,
  addReply,
  isThreadLocked,
}: CommentNodeInnerProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [score, setScore] = useState(comment.score ?? 0);
  const [userVote, setUserVote] = useState<number | null>(comment.userVote ?? null);
  const [isVoteLoading, setIsVoteLoading] = useState(false);

  useEffect(() => {
    setScore(comment.score ?? 0);
    setUserVote(comment.userVote ?? null);
  }, [comment.score, comment.userVote]);

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  const handleReplySubmit = async (content: string) => {
    await addReply(content, comment.id);
    setIsReplying(false);
  };

  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    try {
      const res = await fetch(`/api/comments/${comment.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Comment reported successfully!");
        setIsReporting(false);
        setReportReason("");
      } else {
        toast.error(data.message || "Failed to submit report");
      }
    } catch (err) {
      toast.error("Error reporting comment");
    }
  };

  const handleCommentVote = async (val: 1 | -1) => {
    if (isVoteLoading) return;

    // Optimistic Update
    const originalVote = userVote;
    const originalScore = score;
    let nextVote: number | null = val;
    let scoreDiff: number = val;

    if (originalVote === val) {
      nextVote = null;
      scoreDiff = -val;
    } else if (originalVote !== null) {
      scoreDiff = 2 * val;
    }

    setUserVote(nextVote);
    setScore((s) => s + scoreDiff);
    setIsVoteLoading(true);

    try {
      const res = await fetch(`/api/comments/${comment.id}/vote`, {
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
          setUserVote(originalVote);
          setScore(originalScore);
          toast.error(data.message || "Failed to vote");
        }
      } else {
        setUserVote(originalVote);
        setScore(originalScore);
        toast.error("You need at least 10 reputation to downvote!");
      }
    } catch (err) {
      setUserVote(originalVote);
      setScore(originalScore);
      toast.error("Something went wrong");
    } finally {
      setIsVoteLoading(false);
    }
  };

  const isDeleted = !!comment.deletedAt;
  const displayAuthorName = isDeleted ? "[deleted]" : comment.author.name;
  const displayContent = isDeleted ? "This comment has been deleted by the user." : comment.content;
  const dbRepliesCount = comment._count?.replies || 0;
  const hasRepliesLoaded = replies.length > 0;

  return (
    <div className="w-full mt-4">
      {/* Comment Header and Body Card */}
      <div className="flex gap-3">
        {/* Left avatar or thread line representation */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm select-none">
            {!isDeleted && comment.author.image ? (
              <Image
                src={comment.author.image}
                alt={displayAuthorName}
                fill
                className="object-cover"
                sizes="28px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-[10px]">
                {isDeleted ? "?" : displayAuthorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Thread Line - only active when comment is expanded and has replies */}
          {isExpanded && hasRepliesLoaded && (
            <div
              onClick={() => toggleExpand(comment.id)}
              className="flex-1 w-0.5 my-1.5 bg-slate-150 dark:bg-slate-800/80 hover:bg-[#34629f]/40 dark:hover:bg-[#34629f]/30 transition-colors cursor-pointer rounded"
              title="Click to collapse replies"
            />
          )}
        </div>

        {/* Right side: Author meta + content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className={`font-bold ${isDeleted ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200 hover:text-[#34629f] transition-colors cursor-pointer"}`}>
              {displayAuthorName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">•</span>
            <span className="text-slate-400 font-medium">{formattedDate}</span>
            
            {/* Expand / Collapse Action Trigger */}
            {(dbRepliesCount > 0 || hasRepliesLoaded) && (
              <button
                onClick={() => toggleExpand(comment.id)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 font-semibold text-[#34629f] dark:text-sky-400 hover:underline cursor-pointer focus:outline-none ml-2 text-[10px] uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-[#34629f]" />
                    <span>Loading...</span>
                  </>
                ) : isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>
                      Expand ({hasRepliesLoaded ? replies.length : dbRepliesCount})
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {/* Content is always visible; replies list and composer are conditionally visible */}
            <div className="mt-1.5">
              <p className={`text-sm leading-relaxed whitespace-pre-line ${isDeleted ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-600 dark:text-slate-300"}`}>
                {displayContent}
              </p>

              {/* Actions (Reply toggle & Vote panel) */}
              {!isDeleted && (
                <div className="flex items-center gap-4 mt-2 select-none">
                  {/* Up/Down Vote Capsule */}
                  <div className="flex items-center gap-1 border border-slate-100 dark:border-slate-800/80 rounded-full px-2 py-0.5 bg-slate-50/20 dark:bg-slate-900/10">
                    <button
                      onClick={() => handleCommentVote(1)}
                      className={`p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer ${
                        userVote === 1 ? "text-rose-500" : "text-slate-400"
                      }`}
                      title="Upvote"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-[10px] font-bold tabular-nums min-w-[12px] text-center ${
                      userVote === 1 ? "text-rose-500" : userVote === -1 ? "text-blue-500" : "text-slate-500"
                    }`}>
                      {score}
                    </span>
                    <button
                      onClick={() => handleCommentVote(-1)}
                      className={`p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer ${
                        userVote === -1 ? "text-blue-500" : "text-slate-400"
                      }`}
                      title="Downvote"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isThreadLocked ? (
                    <button
                      onClick={() => setIsReplying(!isReplying)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-[#34629f] cursor-pointer focus:outline-none transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 select-none">
                      <Lock className="w-3 h-3" />
                      <span>Thread locked</span>
                    </span>
                  )}

                  <button
                    onClick={() => setIsReporting(!isReporting)}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-500 cursor-pointer focus:outline-none transition-colors"
                  >
                    Report
                  </button>
                </div>
              )}

              {isReporting && !isDeleted && (
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Reason (e.g. spam, hate speech)..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1 text-xs focus:outline-none flex-1 max-w-xs"
                  />
                  <button
                    onClick={submitReport}
                    className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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

              {/* Inline Composer */}
              <AnimatePresence>
                {isReplying && !isDeleted && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 bg-slate-50/30 dark:bg-slate-900/10 p-3 rounded-xl border border-slate-100 dark:border-slate-850"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Replying to {displayAuthorName}
                    </div>
                    <CommentComposer
                      onSubmit={handleReplySubmit}
                      placeholder={`Reply to ${displayAuthorName}...`}
                      submitButtonText="Reply"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lazy Loaded Replies block */}
              {isExpanded && hasRepliesLoaded && (
                <div 
                  className={`space-y-1 mt-2 border-slate-100 dark:border-slate-800/80 ${
                    depth < MAX_VISUAL_DEPTH 
                      ? "pl-2 md:pl-4 border-l" 
                      : "pl-0 border-l-0"
                  }`}
                >
                  {replies.map((reply) => (
                    <CommentNode
                      key={reply.id}
                      comment={reply}
                      depth={depth + 1}
                    />
                  ))}

                  {/* Load More Sub-thread Replies */}
                  {nextCursor && (
                    <div className="pt-2 pl-4">
                      <Button
                        onClick={() => loadMoreReplies(comment.id)}
                        disabled={isLoading}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-bold text-[#34629f] dark:text-sky-400 hover:underline p-0 h-6 flex items-center gap-1.5"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CornerDownRight className="w-3 h-3" />
                        )}
                        <span>Load more replies...</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// React.memo Comparison Function
function arePropsEqual(prev: CommentNodeInnerProps, next: CommentNodeInnerProps): boolean {
  if (prev.depth !== next.depth) return false;
  if (prev.isExpanded !== next.isExpanded) return false;
  if (prev.isLoading !== next.isLoading) return false;
  if (prev.isThreadLocked !== next.isThreadLocked) return false;
  if (prev.nextCursor !== next.nextCursor) return false;
  
  // Model changes
  if (prev.comment.id !== next.comment.id) return false;
  if (prev.comment.content !== next.comment.content) return false;
  if (prev.comment.updatedAt !== next.comment.updatedAt) return false;
  if (!!prev.comment.deletedAt !== !!next.comment.deletedAt) return false;
  if (prev.comment._count?.replies !== next.comment._count?.replies) return false;
  if (prev.comment.score !== next.comment.score) return false;
  if (prev.comment.userVote !== next.comment.userVote) return false;

  // Author details
  if (prev.comment.author.id !== next.comment.author.id) return false;
  if (prev.comment.author.name !== next.comment.author.name) return false;
  if (prev.comment.author.image !== next.comment.author.image) return false;

  // Sub-thread replies check
  if (prev.replies.length !== next.replies.length) return false;
  for (let i = 0; i < prev.replies.length; i++) {
    if (prev.replies[i].id !== next.replies[i].id) return false;
    if (prev.replies[i].updatedAt !== next.replies[i].updatedAt) return false;
    if (prev.replies[i].content !== next.replies[i].content) return false;
    if (!!prev.replies[i].deletedAt !== !!next.replies[i].deletedAt) return false;
    if (prev.replies[i].score !== next.replies[i].score) return false;
    if (prev.replies[i].userVote !== next.replies[i].userVote) return false;
  }

  return true;
}

const MemoizedCommentNodeInner = React.memo(CommentNodeInner, arePropsEqual);

// Context Consumer Wrapper Component
export default function CommentNode({ comment, depth }: { comment: CommentType; depth: number }) {
  const {
    repliesMap,
    repliesCursors,
    expandedReplies,
    loadingReplies,
    toggleExpand,
    loadMoreReplies,
    addReply,
    isThreadLocked,
  } = useCommentSection();

  const replies = repliesMap[comment.id] || [];
  const nextCursor = repliesCursors[comment.id] || null;
  const isExpanded = expandedReplies.has(comment.id);
  const isLoading = loadingReplies.has(comment.id);

  return (
    <MemoizedCommentNodeInner
      comment={comment}
      depth={depth}
      replies={replies}
      nextCursor={nextCursor}
      isExpanded={isExpanded}
      isLoading={isLoading}
      toggleExpand={toggleExpand}
      loadMoreReplies={loadMoreReplies}
      addReply={addReply}
      isThreadLocked={isThreadLocked}
    />
  );
}
