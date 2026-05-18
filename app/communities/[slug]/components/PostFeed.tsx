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

      {posts.length === 0 ? (
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
