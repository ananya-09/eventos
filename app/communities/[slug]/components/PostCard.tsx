"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

// Shared custom hooks
import { useLikePost } from "@/hooks/useLikePost";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useUpdatePost } from "@/hooks/useUpdatePost";

// Shared UI primitives
import ConfirmModal from "@/components/ui/confirm-modal";

// Global Framer Motion animations
import { itemVariants } from "@/lib/animations";

// Split subcomponents
import PostHeader from "./PostHeader";
import VotePanel from "./VotePanel";
import CommentSection from "./CommentSection";
import InlinePostEditor from "./InlinePostEditor";

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
  userVote?: number | null;
  score?: number;
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

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, updatedFields: Partial<Post>) => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { data: session } = useSession();

  const {
    comments,
    commentsCount,
    isSubmitting: isSubmittingComment,
    addComment,
  } = useCreateComment(post.id, post.comments || [], post._count?.comments || 0);

  const { isDeleting, deletePost } = useDeletePost(post.id, onDelete);
  const { isSaving: isSavingEdit, updatePost } = useUpdatePost(post, onUpdate);

  // Expandable drawers and modular dropdown/modal triggers
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const showControls = !!(session?.user?.id && post.author.id && session.user.id === post.author.id);

  const handleSaveEdit = async (title: string, content: string) => {
    const success = await updatePost(title, content);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addComment(newCommentText);
    if (success) {
      setNewCommentText("");
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      whileHover={!isEditing ? { y: -4, transition: { duration: 0.2 } } : {}}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-[#2e68a8] transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="flex flex-col md:flex-row gap-6 mb-4 relative">
        <div className="flex-1 space-y-4">
          <PostHeader
            author={post.author}
            createdAt={post.createdAt}
            showControls={showControls}
            onEditClick={() => setIsEditing(true)}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
          />

          {/* Conditional Editor vs Post content */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <InlinePostEditor
                key="editor"
                initialTitle={post.title}
                initialContent={post.content}
                isSaving={isSavingEdit}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <motion.div
                key="reader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#2e68a8] transition-colors">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-600 line-clamp-2 leading-relaxed text-sm">
                  {post.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isEditing && (
            <div className="flex items-center gap-6 pt-2">
              <VotePanel
                postId={post.id}
                initialScore={post.score ?? post._count?.likes ?? 0}
                initialUserVote={post.userVote ?? (post.isLiked ? 1 : null)}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isCommentsExpanded ? "text-[#34629f]" : "text-slate-500 hover:text-[#34629f]"
                }`}
              >
                <div className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
                  isCommentsExpanded ? "bg-blue-50 text-[#34629f]" : "bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                }`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>{commentsCount.toLocaleString()}</span>
              </motion.button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-end md:items-center justify-start md:justify-end border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
            <Link href={`/posts/${post.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium hover:bg-white hover:border-[#34629f] hover:text-[#34629f] transition-all text-sm group/btn"
              >
                View Post
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        )}
      </div>

      {/* Collapsible drawer for comments */}
      <AnimatePresence initial={false}>
        {isCommentsExpanded && !isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden border-t border-slate-100 pt-4 mt-4"
          >
            <CommentSection
              session={session}
              comments={comments}
              isSubmitting={isSubmittingComment}
              newCommentText={newCommentText}
              onTextChange={setNewCommentText}
              onSubmit={handleCommentSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable premium glassmorphism confirm modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deletePost}
        isLoading={isDeleting}
        title="Delete Post"
        description="Are you absolutely sure? This action cannot be undone and will permanently remove this post."
        confirmText="Delete Post"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="w-6 h-6" />}
      />
    </motion.div>
  );
}
