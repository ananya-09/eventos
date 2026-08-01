"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2 } from "lucide-react";
import { ThreadReply } from "@/lib/discussions/types";

interface ThreadReplyComposerProps {
  postId: string;
  onAddOptimisticReply: (reply: ThreadReply) => string;
  onConfirmReply: (tempId: string, realReply: ThreadReply) => void;
  onRollbackReply: (tempId: string) => void;
}

export default function ThreadReplyComposer({
  postId,
  onAddOptimisticReply,
  onConfirmReply,
  onRollbackReply,
}: ThreadReplyComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    const tempId = crypto.randomUUID();
    const currentUser = {
      id: "temp-user-id",
      name: session?.user?.name || "Member",
      image: session?.user?.image || null,
      email: session?.user?.email || undefined,
    };

    const tempReply: ThreadReply = {
      id: tempId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      author: currentUser,
      postId,
    };

    onAddOptimisticReply(tempReply);
    setContent("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempReply.content }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit reply");
      }

      onConfirmReply(tempId, {
        id: data.comment.id,
        content: data.comment.content,
        createdAt: data.comment.createdAt,
        author: {
          id: data.comment.author.id,
          name: data.comment.author.name,
          image: data.comment.author.image,
        },
        postId,
      });
    } catch (err) {
      console.error(err);
      onRollbackReply(tempId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pl-6 sm:pl-10 mt-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post a quick reply..."
        required
        disabled={submitting}
        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200/50 rounded-2xl text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="p-2 rounded-2xl bg-[#34629f] text-white hover:bg-[#2e68a8] transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center shadow-sm"
      >
        {submitting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5" />
        )}
      </button>
    </form>
  );
}
