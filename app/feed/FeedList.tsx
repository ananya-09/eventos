"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Clock, ArrowRight } from "lucide-react";
import { itemVariants, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
  community: {
    name: string;
    slug: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export default function FeedList({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="bg-slate-100 p-6 rounded-full mb-4 shadow-sm border border-slate-200">
          <MessageSquare className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts yet</h3>
        <p className="text-slate-500 max-w-sm">
          There are no posts to display in your feed. Join a community or create an event to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6"
    >
      {posts.map((post) => (
        <motion.div
          key={post.id}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle gradient accent on hover */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-[#2e68a8] transition-all duration-500 opacity-0 group-hover:opacity-100" />
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200/50 shadow-sm relative">
                  {post.author.image ? (
                    <Image 
                      src={post.author.image} 
                      alt={post.author.name} 
                      fill 
                      className="object-cover" 
                      sizes="40px"
                    />
                  ) : (
                    post.author.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 leading-none">{post.author.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    in <Link href={`/communities/${post.community.slug}`} className="font-medium text-[#2e68a8] hover:underline">{post.community.name}</Link>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#2e68a8] transition-colors">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-600 line-clamp-2 leading-relaxed text-sm">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <div className="flex items-center justify-center p-1.5 rounded-full bg-slate-50 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                  {post._count.likes}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <div className="flex items-center justify-center p-1.5 rounded-full bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  {post._count.comments}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="flex items-end md:items-center justify-start md:justify-end border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
              <Link href={`/posts/${post.id}`}>
                <Button
                  className="px-5 py-2.5 rounded-full font-medium shadow-sm transition-all text-sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Post
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
