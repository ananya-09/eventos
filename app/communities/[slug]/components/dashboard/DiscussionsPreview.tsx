import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageSquare, Heart, Plus, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Creator = {
  id: string;
  name: string;
  image: string | null;
};

type DiscussionPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  author: Creator;
};

export default function DiscussionsPreview({ posts, slug }: { posts: DiscussionPost[]; slug: string }) {
  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#34629f]" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Threads</h3>
        </div>
        <Link 
          href={`/communities/${slug}/feed`}
          className="text-xs font-bold text-[#34629f] hover:text-[#2e68a8] flex items-center gap-1 group transition-colors"
        >
          <span>Open Feed</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center text-center p-8 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm mb-1">No threads shared yet</h4>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
            Be the first to share an update, ask a question, or introduce yourself!
          </p>
          <Link 
            href={`/communities/${slug}/feed`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#34629f] text-white hover:bg-[#2e68a8] font-bold text-xs rounded-full shadow-sm transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100/60">
          {posts.map((post) => (
            <div key={post.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              <Avatar className="w-9 h-9 border border-slate-200 shadow-sm rounded-full shrink-0">
                <AvatarImage src={post.author.image || undefined} alt={post.author.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-xs">
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-800 text-sm">{post.author.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{formatTime(post.createdAt)}</span>
                </div>

                <Link href={`/communities/${slug}/feed`} className="block group">
                  <h4 className="font-bold text-slate-700 text-sm group-hover:text-[#2e68a8] transition-colors leading-snug truncate">
                    {post.title}
                  </h4>
                </Link>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-1">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{post.likesCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{post.commentsCount}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
