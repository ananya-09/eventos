"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import EmptyState from "./EmptyState";
import CreatePostCard from "./CreatePostCard";

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

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  comments?: Comment[];
  author: {
    id?: string;
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

interface PostFeedProps {
  initialPosts: Post[];
  communitySlug: string;
  isMember: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PostFeed({ 
  initialPosts, 
  communitySlug, 
  isMember 
}: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSortedPosts = async (newSort: "hot" | "new" | "top") => {
    setSort(newSort);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/communities/${communitySlug}/posts?sort=${newSort}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOptimisticPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    return newPost.id;
  };

  const handleConfirmPost = (tempId: string, realPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === tempId ? realPost : post))
    );
  };

  const handleRollbackPost = (tempId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== tempId));
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleUpdatePost = (postId: string, updatedFields: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updatedFields } : post))
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Show CreatePostCard ONLY if authenticated user is a verified member */}
      {isMember && (
        <CreatePostCard
          communitySlug={communitySlug}
          onAddOptimisticPost={handleAddOptimisticPost}
          onConfirmPost={handleConfirmPost}
          onRollbackPost={handleRollbackPost}
        />
      )}

      {/* Feed Sorting Capsule */}
      <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200/50 dark:border-slate-800/80 shadow-sm max-w-xs select-none">
        {(["hot", "new", "top"] as const).map((tab) => (
          <button
            key={tab}
            disabled={isLoading}
            onClick={() => fetchSortedPosts(tab)}
            className={`flex-1 py-1.5 px-4 rounded-xl text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
              sort === tab
                ? "bg-[#2e68a8] text-white shadow-md shadow-blue-500/10"
                : "text-slate-505 dark:text-slate-400 hover:text-[#2e68a8] hover:bg-slate-100/50 dark:hover:bg-slate-850/30"
            } disabled:opacity-50`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">Loading threads...</p>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6 pb-20"
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
