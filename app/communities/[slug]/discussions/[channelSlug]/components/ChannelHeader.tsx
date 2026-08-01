"use client";

import Link from "next/link";
import { Hash, Plus, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChannelHeaderProps {
  name: string;
  description: string | null;
  postsCount: number;
  communitySlug: string;
  channelSlug: string;
  onCreateClick?: () => void;
}

export default function ChannelHeader({
  name,
  description,
  postsCount,
  communitySlug,
  channelSlug,
  onCreateClick,
}: ChannelHeaderProps) {
  const newDiscussionHref = `/communities/${communitySlug}/discussions/new?channel=${channelSlug}`;

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-1.5 text-slate-800">
          <Hash className="w-5 h-5 text-[#34629f] shrink-0" />
          <h2 className="text-lg font-extrabold tracking-tight">{name}</h2>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
          {description || `Welcome to the #${name} channel! Join the thread discussions and share resources.`}
        </p>

        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1 pt-1">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{postsCount} {postsCount === 1 ? "Discussion" : "Discussions"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 relative z-10">
        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#34629f] hover:bg-[#2e68a8] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Thread</span>
        </button>
        <Link
          href={newDiscussionHref}
          className="hidden sm:inline-flex text-[10px] font-extrabold text-[#34629f] hover:underline uppercase tracking-wider px-2"
        >
          Full editor
        </Link>
      </div>
    </Card>
  );
}
