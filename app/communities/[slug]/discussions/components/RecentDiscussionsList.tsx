"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageSquare, Hash, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChannelPost } from "@/lib/discussions/types";
import { itemVariants, staggerContainer } from "@/lib/animations";

interface RecentDiscussionsListProps {
  posts: ChannelPost[];
  communitySlug: string;
}

export default function RecentDiscussionsList({
  posts,
  communitySlug,
}: RecentDiscussionsListProps) {
  if (posts.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Recent Discussions
        </h3>
      </div>

      <motion.div variants={staggerContainer} className="space-y-3">
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Link
              href={`/communities/${communitySlug}/threads/${post.id}`}
              className="block glass-surface rounded-2xl p-4 sm:p-5 border border-slate-200/60 hover:border-[#34629f]/25 hover:shadow-md transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ x: 2 }}
                className="flex gap-3 sm:gap-4"
              >
                <Avatar className="w-9 h-9 shrink-0 border border-slate-100">
                  <AvatarImage src={post.author.image || undefined} alt={post.author.name} />
                  <AvatarFallback className="bg-[#34629f] text-white text-xs font-bold">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base group-hover:text-[#34629f] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#34629f] shrink-0 mt-0.5 transition-colors" />
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>
                      {formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}
                    </span>
                    {post.channel && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-[#34629f]">
                          <Hash className="w-3 h-3" />
                          {post.channel.name}
                        </span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-0.5 ml-auto">
                      <MessageSquare className="w-3 h-3" />
                      {post.commentsCount}
                    </span>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap gap-1 pt-1"
                    >
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
