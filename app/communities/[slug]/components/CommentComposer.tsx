import Image from "next/image";
import { Send } from "lucide-react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";

type CommentComposerProps = {
  session: Session | null;
  newCommentText: string;
  isSubmitting: boolean;
  onTextChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CommentComposer({
  session,
  newCommentText,
  isSubmitting,
  onTextChange,
  onSubmit,
}: CommentComposerProps) {
  if (!session) {
    return (
      <p className="text-xs text-slate-400 font-medium text-center py-1">
        Please log in to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/50">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="Your Avatar"
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <div className="w-full h-full bg-[#34629f]/10 flex items-center justify-center text-[#34629f] font-bold text-xs">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
      <div className="flex-1 flex gap-2 items-center relative">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/60 rounded-full px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
        />
        <Button
          type="submit"
          size="icon-sm"
          isLoading={isSubmitting}
          disabled={newCommentText.trim().length < 2}
          className="rounded-full w-8 h-8 bg-[#34629f] text-white hover:bg-[#2e68a8]"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </form>
  );
}
