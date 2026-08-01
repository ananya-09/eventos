import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Pin, Lock, ArrowLeft, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ThreadHeaderProps {
  title: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: string | Date;
  communitySlug: string;
  communityName: string;
  pinned?: boolean;
  locked?: boolean;
}

export default function ThreadHeader({
  title,
  author,
  createdAt,
  communitySlug,
  communityName,
  pinned = false,
  locked = false,
}: ThreadHeaderProps) {
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="w-full space-y-5 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Back button and Community indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/communities/${communitySlug}/discussions`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#34629f] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Discussions
        </Link>

        <Badge variant="outline" className="bg-slate-50/50 border-slate-200 text-slate-600 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400">
          Posted in {communityName}
        </Badge>
      </div>

      {/* Badges and Title */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          {pinned && (
            <Badge className="bg-sky-50 text-[#34629f] hover:bg-sky-100/80 border border-sky-100 flex items-center gap-1 text-[11px] font-semibold dark:bg-[#34629f]/10 dark:text-sky-400 dark:border-[#34629f]/20">
              <Pin className="w-3 h-3 fill-current rotate-45" />
              Pinned Thread
            </Badge>
          )}
          {locked && (
            <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100/80 border border-amber-100 flex items-center gap-1 text-[11px] font-semibold dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              <Lock className="w-3 h-3" />
              Locked Discussion
            </Badge>
          )}
        </div>

        <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {title}
        </h1>
      </div>

      {/* Author and Timestamp */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border-2 border-[#34629f]/20 shadow-sm shrink-0">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-base">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate hover:text-[#34629f] transition-colors cursor-pointer">
              {author.name}
            </span>
            <span title="Community Member" className="shrink-0 flex items-center">
              <Shield className="w-3.5 h-3.5 text-[#34629f]" />
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Published {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
