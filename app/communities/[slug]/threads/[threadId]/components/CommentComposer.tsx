"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentComposerProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  submitButtonText?: string;
}

export default function CommentComposer({
  onSubmit,
  placeholder = "Join the discussion...",
  autoFocus = false,
  submitButtonText = "Comment",
}: CommentComposerProps) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <Loader2 className="w-5 h-5 animate-spin text-[#34629f]" />
        <span className="text-sm text-slate-500 font-medium">Loading session...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3.5 my-4">
        <div className="p-2.5 rounded-full bg-sky-50 dark:bg-[#34629f]/10 text-[#34629f]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sign in to participate</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Join this community to post comments, reply to discussions, and save your bookmarks.
          </p>
        </div>
        <Button
          onClick={() => signIn()}
          size="sm"
          className="bg-[#34629f] hover:bg-[#2e68a8] text-white shadow-md font-semibold text-xs rounded-lg px-4"
        >
          Sign In / Register
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3.5 my-4 items-start w-full">
      {/* User Avatar */}
      <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm mt-0.5">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            fill
            className="object-cover"
            sizes="36px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-xs md:text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="relative group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-200 focus-within:border-[#34629f] focus-within:ring-2 focus-within:ring-[#34629f]/10 shadow-sm overflow-hidden">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={isSubmitting}
            className="w-full min-h-[90px] p-3 text-sm resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
            maxLength={1000}
          />
          
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {content.length}/1000 • Markdown support
            </span>

            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              size="sm"
              className="bg-[#34629f] hover:bg-[#2e68a8] text-white flex items-center gap-1.5 shadow-sm text-xs font-semibold rounded-lg h-8 px-3.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitButtonText}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
