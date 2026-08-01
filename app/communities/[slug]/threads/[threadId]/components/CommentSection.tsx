"use client";

import React, { useState, useMemo, useCallback, createContext, useContext } from "react";
import { MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CommentComposer from "./CommentComposer";
import CommentNode, { CommentType } from "./CommentNode";
import { Button } from "@/components/ui/button";

interface CommentSectionProps {
  postId: string;
  initialComments: CommentType[];
  initialNextCursor: string | null;
  isThreadLocked?: boolean;
}

interface CommentSectionContextType {
  repliesMap: Record<string, CommentType[]>;
  repliesCursors: Record<string, string | null>;
  expandedReplies: Set<string>;
  loadingReplies: Set<string>;
  toggleExpand: (commentId: string) => Promise<void>;
  loadMoreReplies: (commentId: string) => Promise<void>;
  addReply: (content: string, parentId?: string) => Promise<void>;
  isThreadLocked: boolean;
}

const CommentSectionContext = createContext<CommentSectionContextType | null>(null);

export function useCommentSection() {
  const context = useContext(CommentSectionContext);
  if (!context) {
    throw new Error("useCommentSection must be used within a CommentSectionProvider");
  }
  return context;
}

export default function CommentSection({
  postId,
  initialComments,
  initialNextCursor,
  isThreadLocked = false,
}: CommentSectionProps) {
  // State for root-level comments pagination
  const [rootComments, setRootComments] = useState<CommentType[]>(initialComments);
  const [rootCursor, setRootCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMoreRoot, setIsLoadingMoreRoot] = useState(false);

  // States for sub-threads/replies lazy loading
  const [repliesMap, setRepliesMap] = useState<Record<string, CommentType[]>>({});
  const [repliesCursors, setRepliesCursors] = useState<Record<string, string | null>>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());

  // Toggle sub-thread expansion and fetch replies if not loaded
  const toggleExpand = useCallback(async (commentId: string) => {
    let shouldFetch = false;

    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
        if (!repliesMap[commentId]) {
          shouldFetch = true;
        }
      }
      return next;
    });

    if (shouldFetch) {
      setLoadingReplies((prev) => {
        const next = new Set(prev);
        next.add(commentId);
        return next;
      });

      try {
        const res = await fetch(`/api/comments/${commentId}/replies?limit=5`);
        if (!res.ok) throw new Error("Failed to load replies");
        const data = await res.json();
        
        if (data.success) {
          setRepliesMap((prev) => ({ ...prev, [commentId]: data.replies }));
          setRepliesCursors((prev) => ({ ...prev, [commentId]: data.nextCursor }));
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Could not load replies. Please try again.");
      } finally {
        setLoadingReplies((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    }
  }, [repliesMap]);

  // Fetch more replies for a comment (pagination of sub-threads)
  const loadMoreReplies = useCallback(async (commentId: string) => {
    const cursor = repliesCursors[commentId];
    if (!cursor) return;

    setLoadingReplies((prev) => {
      const next = new Set(prev);
      next.add(commentId);
      return next;
    });

    try {
      const res = await fetch(`/api/comments/${commentId}/replies?cursor=${cursor}&limit=5`);
      if (!res.ok) throw new Error("Failed to load more replies");
      const data = await res.json();

      if (data.success) {
        setRepliesMap((prev) => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), ...data.replies],
        }));
        setRepliesCursors((prev) => ({
          ...prev,
          [commentId]: data.nextCursor,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load replies");
    } finally {
      setLoadingReplies((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  }, [repliesCursors]);

  // Load more root-level comments
  const loadMoreRootComments = useCallback(async () => {
    if (!rootCursor || isLoadingMoreRoot) return;

    setIsLoadingMoreRoot(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments?cursor=${rootCursor}&limit=10`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();

      if (data.success) {
        setRootComments((prev) => [...prev, ...data.comments]);
        setRootCursor(data.nextCursor);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load comments");
    } finally {
      setIsLoadingMoreRoot(false);
    }
  }, [postId, rootCursor, isLoadingMoreRoot]);

  // Create a comment/reply
  const addReply = useCallback(async (content: string, parentId?: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          parentId: parentId || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post comment");
      }

      const data = await res.json();
      if (data.success && data.comment) {
        const newComment = data.comment;
        
        if (!parentId) {
          // Append new root comment to the end
          setRootComments((prev) => [...prev, newComment]);
        } else {
          // Append reply to the replies list and expand parent
          setRepliesMap((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), newComment],
          }));
          setExpandedReplies((prev) => {
            const next = new Set(prev);
            next.add(parentId);
            return next;
          });
        }
        toast.success(parentId ? "Reply posted!" : "Comment posted!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
      throw err;
    }
  }, [postId]);

  // Context value object
  const contextValue = useMemo(() => ({
    repliesMap,
    repliesCursors,
    expandedReplies,
    loadingReplies,
    toggleExpand,
    loadMoreReplies,
    addReply,
    isThreadLocked,
  }), [repliesMap, repliesCursors, expandedReplies, loadingReplies, toggleExpand, loadMoreReplies, addReply, isThreadLocked]);

  return (
    <CommentSectionContext.Provider value={contextValue}>
      <div id="comments-section" className="space-y-6 pt-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#34629f]" />
            Discussions ({rootComments.length}{rootCursor ? "+" : ""})
          </h3>
        </div>

        {/* Root Composer */}
        {!isThreadLocked ? (
          <div className="bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Share your thoughts
            </h4>
            <CommentComposer
              onSubmit={(content) => addReply(content)}
              placeholder="Write a constructive comment..."
              submitButtonText="Post Comment"
            />
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-200/50 bg-amber-50/30 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400 text-xs font-semibold text-center select-none">
            This thread has been locked. You cannot post new replies.
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-2">
          {rootComments.length > 0 ? (
            <div className="divide-y divide-slate-100/50 dark:divide-slate-800/30">
              {rootComments.map((comment) => (
                <div key={comment.id} className="first:mt-0 pt-2 pb-4">
                  <CommentNode
                    comment={comment}
                    depth={0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3.5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300">No comments yet</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Be the first to share your perspective on this discussion!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Load More Root Comments Button */}
        {rootCursor && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={loadMoreRootComments}
              disabled={isLoadingMoreRoot}
              variant="outline"
              size="sm"
              className="text-xs font-bold text-slate-650 hover:text-[#34629f] px-6 h-9 rounded-xl border-slate-200 dark:border-slate-800"
            >
              {isLoadingMoreRoot ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Loading discussions...</span>
                </>
              ) : (
                <span>Load more discussions</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </CommentSectionContext.Provider>
  );
}
