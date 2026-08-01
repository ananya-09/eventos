"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThreadReply } from "@/lib/discussions/types";

interface ThreadReplyListProps {
  replies: ThreadReply[];
}

export default function ThreadReplyList({ replies }: ThreadReplyListProps) {
  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch (e) {
      return isoString;
    }
  };

  if (replies.length === 0) return null;

  return (
    <div className="pl-6 sm:pl-10 space-y-3 pt-3 border-l border-slate-100/80 ml-4 sm:ml-5">
      {replies.map((reply) => (
        <div key={reply.id} className="flex items-start gap-3 text-xs">
          <Avatar className="w-6 h-6 rounded-full border border-slate-50 shrink-0">
            <AvatarImage src={reply.author.image || undefined} alt={reply.author.name} className="object-cover" />
            <AvatarFallback className="bg-slate-100 text-slate-500 font-extrabold text-[8px]">
              {reply.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 bg-slate-50/70 border border-slate-100/60 rounded-2xl p-2.5 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-[10px] text-slate-600 tracking-tight">
                {reply.author.name}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                {formatTime(reply.createdAt)}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
