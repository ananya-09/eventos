"use client";

import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants } from "@/lib/animations";
import { CategoryWithChannels, ChannelPost } from "@/lib/discussions/types";
import DiscussionComposer from "../../components/DiscussionComposer";

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  communitySlug: string;
  categories: CategoryWithChannels[];
  isMember: boolean;
  onAddOptimisticPost: (post: ChannelPost) => string;
  onConfirmPost: (tempId: string, realPost: ChannelPost) => void;
  onRollbackPost: (tempId: string) => void;
}

export default function CreateDiscussionModal({
  isOpen,
  onClose,
  channelId,
  communitySlug,
  categories,
  isMember,
  onAddOptimisticPost,
  onConfirmPost,
  onRollbackPost,
}: CreateDiscussionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="w-full max-w-xl z-10 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DiscussionComposer
            communitySlug={communitySlug}
            categories={categories}
            isMember={isMember}
            mode="modal"
            defaultChannelId={channelId}
            onCancel={onClose}
            onAddOptimisticPost={onAddOptimisticPost}
            onConfirmPost={onConfirmPost}
            onRollbackPost={onRollbackPost}
            onSuccess={() => onClose()}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
