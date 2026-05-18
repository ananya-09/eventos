"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageSquare, Heart, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChannelPost, ThreadReply, Creator } from "@/lib/discussions/types";
import ThreadReplyList from "./ThreadReplyList";
import ThreadReplyComposer from "./ThreadReplyComposer";
import ParticipantFacepile from "./ParticipantFacepile";

interface DiscussionCardProps {
  post: ChannelPost;
  communitySlug: string;
}

export default function DiscussionCard({ post, communitySlug }: DiscussionCardProps) {
  const [replies, setReplies] = useState<ThreadReply[]>(post.replies || []);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch (e) {
      return isoString;
    }
  };

  const getBadgeType = () => {
    const postDate = new Date(post.createdAt);
    const replyDate = new Date(post.latestReplyAt || post.createdAt);
    const now = new Date();

    const diffHoursReply = Math.abs(now.getTime() - replyDate.getTime()) / 3600000;
    const diffHoursPost = Math.abs(now.getTime() - postDate.getTime()) / 3600000;

    if (diffHoursReply < 2 && replies.length > 0) {
      return { text: "Active Now", color: "bg-emerald-50 text-emerald-600 border-emerald-100/50" };
    }
    if (diffHoursPost < 24) {
      return { text: "New", color: "bg-blue-50 text-blue-600 border-blue-100/50" };
    }
    if (post.likesCount + replies.length >= 5) {
      return { text: "Trending", color: "bg-amber-50 text-amber-600 border-amber-100/50" };
    }
    return null;
  };

  const badge = getBadgeType();

  const getUniqueParticipants = (): Creator[] => {
    const listMap = new Map<string, Creator>();
    (post.participants || []).forEach((p) => listMap.set(p.id, p));
    replies.forEach((r) => listMap.set(r.author.id, r.author));
    return Array.from(listMap.values());
  };

  const activeParticipants = getUniqueParticipants();

  const handleAddOptimisticReply = (reply: ThreadReply) => {
    setReplies((prev) => [...prev, reply]);
    return reply.id;
  };

  const handleConfirmReply = (tempId: string, realReply: ThreadReply) => {
    setReplies((prev) =>
      prev.map((rep) => (rep.id === tempId ? realReply : rep))
    );
  };

  const handleRollbackReply = (tempId: string) => {
    setReplies((prev) => prev.filter((rep) => rep.id !== tempId));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group space-y-3 relative overflow-hidden">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <Avatar className="w-8 h-8 rounded-full border border-slate-100 shadow-sm shrink-0">
          <AvatarImage src={post.author.image || undefined} alt={post.author.name} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-extrabold text-[10px]">
            {post.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Post Structured Body */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/communities/${communitySlug}/feed`} className="block">
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base group-hover:text-[#34629f] transition-colors leading-snug tracking-tight">
                  {post.title}
                </h4>
              </Link>
              {badge && (
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border tracking-wide uppercase ${badge.color}`}>
                  {badge.text}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs leading-relaxed truncate max-w-2xl">
              {post.content}
            </p>
          </div>

          {/* Compact Metadata Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-2">
            <span className="flex items-center gap-1 text-slate-500">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{post.author.name}</span>
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{formatTime(post.createdAt)}</span>
            </span>

            {/* Overlapping Avatars Row */}
            {activeParticipants.length > 0 && (
              <span className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
                <ParticipantFacepile participants={activeParticipants} />
              </span>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{post.likesCount}</span>
              </span>
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{replies.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Nested Threaded Replies Section */}
      {replies.length > 0 && <ThreadReplyList replies={replies} />}

      {/* Inline Reply Composer Block */}
      {showReplyForm && (
        <ThreadReplyComposer
          postId={post.id}
          onAddOptimisticReply={handleAddOptimisticReply}
          onConfirmReply={handleConfirmReply}
          onRollbackReply={handleRollbackReply}
        />
      )}
    </Card>
  );
}
