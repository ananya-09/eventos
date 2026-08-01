import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Session } from "next-auth";
import CommentComposer from "./CommentComposer";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
};

type CommentSectionProps = {
  session: Session | null;
  comments: Comment[];
  isSubmitting: boolean;
  newCommentText: string;
  onTextChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CommentSection({
  session,
  comments,
  isSubmitting,
  newCommentText,
  onTextChange,
  onSubmit,
}: CommentSectionProps) {
  return (
    <div className="space-y-4">
      {/* Inline Comment Composer */}
      <CommentComposer
        session={session}
        newCommentText={newCommentText}
        isSubmitting={isSubmitting}
        onTextChange={onTextChange}
        onSubmit={onSubmit}
      />

      {/* Flat Comment List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
        <AnimatePresence initial={false}>
          {comments.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-400 text-center py-3 font-medium"
            >
              No comments yet. Be the first to share your thoughts!
            </motion.p>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3 bg-slate-50/50 rounded-2xl p-3 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/50">
                  {comment.author.image ? (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#34629f]/10 flex items-center justify-center text-[#34629f] font-bold text-xs">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs leading-none">
                      {comment.author.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-normal">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
