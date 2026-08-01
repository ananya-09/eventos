"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, itemVariants } from "@/lib/animations";
import { ChannelPost, ChannelOverview, CategoryWithChannels } from "@/lib/discussions/types";
import DiscussionCard from "./DiscussionCard";
import EmptyDiscussions from "./EmptyDiscussions";
import ChannelHeader from "./ChannelHeader";
import CreateDiscussionModal from "./CreateDiscussionModal";

interface DiscussionFeedProps {
  initialPosts: ChannelPost[];
  channel: ChannelOverview;
  communitySlug: string;
  categories: CategoryWithChannels[];
  isMember: boolean;
}

export default function DiscussionFeed({
  initialPosts,
  channel,
  communitySlug,
  categories,
  isMember,
}: DiscussionFeedProps) {
  const [posts, setPosts] = useState<ChannelPost[]>(initialPosts);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleAddOptimisticPost = (newPost: ChannelPost) => {
    setPosts((prev) => [newPost, ...prev]);
    return newPost.id;
  };

  const handleConfirmPost = (tempId: string, realPost: ChannelPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === tempId ? realPost : post))
    );
  };

  const handleRollbackPost = (tempId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== tempId));
  };

  return (
    <div className="space-y-6">
      <ChannelHeader
        name={channel.name}
        description={channel.description}
        postsCount={posts.length}
        communitySlug={communitySlug}
        channelSlug={channel.slug}
        onCreateClick={() => setIsComposeOpen(true)}
      />

      {posts.length === 0 ? (
        <EmptyDiscussions 
          channelName={channel.name} 
          onCreateClick={() => setIsComposeOpen(true)} 
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants} layout>
                <DiscussionCard post={post} communitySlug={communitySlug} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isComposeOpen && (
          <CreateDiscussionModal
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            channelId={channel.id}
            communitySlug={communitySlug}
            categories={categories}
            isMember={isMember}
            onAddOptimisticPost={handleAddOptimisticPost}
            onConfirmPost={handleConfirmPost}
            onRollbackPost={handleRollbackPost}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
