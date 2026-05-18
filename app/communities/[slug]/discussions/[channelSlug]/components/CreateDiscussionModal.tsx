"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { modalVariants, overlayVariants } from "@/lib/animations";
import { ChannelPost } from "@/lib/discussions/types";

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  communitySlug: string;
  onAddOptimisticPost: (post: ChannelPost) => string;
  onConfirmPost: (tempId: string, realPost: ChannelPost) => void;
  onRollbackPost: (tempId: string) => void;
}

export default function CreateDiscussionModal({
  isOpen,
  onClose,
  channelId,
  communitySlug,
  onAddOptimisticPost,
  onConfirmPost,
  onRollbackPost,
}: CreateDiscussionModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);

    const tempId = crypto.randomUUID();
    const currentUser = {
      id: "temp-user-id",
      name: session?.user?.name || "Member",
      image: session?.user?.image || null,
      email: session?.user?.email || undefined,
    };

    const tempPost: ChannelPost = {
      id: tempId,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      author: currentUser,
      channelId,
    };

    onAddOptimisticPost(tempPost);
    onClose();

    try {
      const res = await fetch(`/api/communities/${communitySlug}/discussions/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          channelId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to publish thread");
      }

      onConfirmPost(tempId, data.post);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Rolling back.");
      onRollbackPost(tempId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg z-10 relative"
      >
        <Card className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Start a New Thread</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100/50">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Discussion Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to talk about?"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Thread Context
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your question or insight details here..."
                required
                rows={5}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#34629f] text-white hover:bg-[#2e68a8] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Publish Thread</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
