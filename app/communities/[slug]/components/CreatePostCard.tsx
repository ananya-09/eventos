"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenSquare, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

interface CreatePostCardProps {
  communitySlug: string;
  onAddOptimisticPost: (post: Post) => string; // returns tempId
  onConfirmPost: (tempId: string, realPost: Post) => void;
  onRollbackPost: (tempId: string) => void;
}

export default function CreatePostCard({ 
  communitySlug, 
  onAddOptimisticPost, 
  onConfirmPost, 
  onRollbackPost 
}: CreatePostCardProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!content.trim() || content.length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    // 1. Create optimistic post object
    const tempId = `temp-${Date.now()}`;
    const optimisticPost: Post = {
      id: tempId,
      title,
      content,
      createdAt: new Date().toISOString(),
      author: {
        name: session?.user?.name || "Community Member",
        image: session?.user?.image || null,
      },
      _count: {
        likes: 0,
        comments: 0,
      },
    };

    // 2. Optimistically add to UI immediately
    onAddOptimisticPost(optimisticPost);
    
    // Clear inputs immediately for amazing UX feel
    const prevTitle = title;
    const prevContent = content;
    setTitle("");
    setContent("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: prevTitle,
          content: prevContent,
          communitySlug,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create post");
      }

      // 3. Confirm with real DB post
      onConfirmPost(tempId, data.post);
      toast.success("Post published successfully!");
    } catch (error: any) {
      // 4. Rollback if API fails
      onRollbackPost(tempId);
      setTitle(prevTitle);
      setContent(prevContent);
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/60 mb-8 relative overflow-hidden group"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#34629f]">
          <PenSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 tracking-tight">Create a Post</h3>
          <p className="text-xs text-slate-400 font-medium">Share your thoughts or announcements</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 items-start">
          {/* Optional User Avatar in Composer */}
          <div className="hidden sm:block w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 relative border border-slate-200/50">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Your Avatar" 
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full bg-[#34629f]/10 flex items-center justify-center text-[#34629f] font-bold text-sm">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <input
              type="text"
              placeholder="Title of your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all font-semibold tracking-tight text-md"
            />
            <textarea
              placeholder="What's on your mind? (Markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all resize-none text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <motion.button
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className={`px-6 py-2.5 rounded-full font-semibold text-white bg-[#34629f] hover:bg-[#2e68a8] shadow-sm shadow-[#34629f]/15 hover:shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
