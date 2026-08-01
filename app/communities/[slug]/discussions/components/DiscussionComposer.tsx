"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  Send,
  Hash,
  Tag,
  Eye,
  PenLine,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { CategoryWithChannels, ChannelPost } from "@/lib/discussions/types";
import { fadeUp } from "@/lib/animations";

type ComposerMode = "page" | "modal";

interface DiscussionComposerProps {
  communitySlug: string;
  categories: CategoryWithChannels[];
  isMember: boolean;
  mode?: ComposerMode;
  defaultChannelId?: string;
  onSuccess?: (post: ChannelPost) => void;
  onCancel?: () => void;
  onAddOptimisticPost?: (post: ChannelPost) => string;
  onConfirmPost?: (tempId: string, post: ChannelPost) => void;
  onRollbackPost?: (tempId: string) => void;
}

type FieldErrors = Record<string, string>;

function parseTagsInput(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);
}

export default function DiscussionComposer({
  communitySlug,
  categories,
  isMember,
  mode = "page",
  defaultChannelId,
  onSuccess,
  onCancel,
  onAddOptimisticPost,
  onConfirmPost,
  onRollbackPost,
}: DiscussionComposerProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [channelId, setChannelId] = useState(defaultChannelId || "");
  const [tagsInput, setTagsInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { ref: contentRef, resize } = useAutosizeTextarea(content, {
    minRows: mode === "modal" ? 5 : 8,
    maxHeight: mode === "modal" ? 280 : 420,
  });

  const channelsInCategory = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.channels ?? [];
  }, [categories, categoryId]);

  useEffect(() => {
    if (defaultChannelId) {
      for (const cat of categories) {
        const match = cat.channels.find((ch) => ch.id === defaultChannelId);
        if (match) {
          setCategoryId(cat.id);
          setChannelId(match.id);
          break;
        }
      }
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
      const firstChannel = categories[0].channels[0];
      if (firstChannel) setChannelId(firstChannel.id);
    }
  }, [categories, defaultChannelId, categoryId]);

  useEffect(() => {
    if (channelsInCategory.length > 0) {
      const stillValid = channelsInCategory.some((ch) => ch.id === channelId);
      if (!stillValid) setChannelId(channelsInCategory[0].id);
    } else {
      setChannelId("");
    }
  }, [channelsInCategory, channelId]);

  const parsedTags = useMemo(() => parseTagsInput(tagsInput), [tagsInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!session) {
      toast.error("Sign in to start a discussion");
      signIn();
      return;
    }

    if (!isMember) {
      toast.error("Join this community before posting discussions");
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setFieldErrors((p) => ({ ...p, title: "Title must be at least 3 characters" }));
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setFieldErrors((p) => ({ ...p, content: "Content must be at least 10 characters" }));
      return;
    }
    if (!channelId) {
      setFieldErrors((p) => ({ ...p, channelId: "Select a channel for your discussion" }));
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      channelId,
      tags: parsedTags,
    };

    const selectedChannel = channelsInCategory.find((ch) => ch.id === channelId);
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimisticPost: ChannelPost = {
      id: tempId,
      title: payload.title,
      content: payload.content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      author: {
        id: "optimistic",
        name: session.user?.name || "You",
        image: session.user?.image || null,
      },
      channelId,
      channel: selectedChannel
        ? { id: selectedChannel.id, name: selectedChannel.name, slug: selectedChannel.slug }
        : undefined,
      tags: parsedTags,
    };

    if (onAddOptimisticPost) {
      onAddOptimisticPost(optimisticPost);
    }

    const prev = { title, content, tagsInput, categoryId, channelId };
    if (mode === "modal") {
      onCancel?.();
    }

    try {
      const res = await fetch(
        `/api/communities/${communitySlug}/discussions/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors?.length) {
          const mapped: FieldErrors = {};
          for (const err of data.errors) {
            const path = err.path?.[0];
            if (path) mapped[path] = err.message;
          }
          setFieldErrors(mapped);
        }
        throw new Error(data.message || "Failed to publish discussion");
      }

      const realPost = data.post as ChannelPost;

      if (onConfirmPost) {
        onConfirmPost(tempId, realPost);
      }

      onSuccess?.(realPost);
      toast.success("Discussion published!");

      if (mode === "page") {
        router.push(
          `/communities/${communitySlug}/threads/${realPost.id}`
        );
        router.refresh();
      } else {
        setTitle("");
        setContent("");
        setTagsInput("");
      }
    } catch (err: unknown) {
      if (onRollbackPost) onRollbackPost(tempId);
      setTitle(prev.title);
      setContent(prev.content);
      setTagsInput(prev.tagsInput);
      setCategoryId(prev.categoryId);
      setChannelId(prev.channelId);

      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = useCallback(
    (nextCategoryId: string) => {
      setCategoryId(nextCategoryId);
      const cat = categories.find((c) => c.id === nextCategoryId);
      if (cat?.channels[0]) setChannelId(cat.channels[0].id);
    },
    [categories]
  );

  if (status === "loading") {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-surface-strong rounded-3xl p-10 flex items-center justify-center gap-3"
      >
        <Loader2 className="w-5 h-5 animate-spin text-[#34629f]" />
        <span className="text-sm font-medium text-slate-500">Loading composer...</span>
      </motion.div>
    );
  }

  if (!session) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-surface-strong rounded-3xl p-8 sm:p-10 text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mx-auto w-14 h-14 rounded-2xl bg-[#34629f]/10 flex items-center justify-center text-[#34629f]"
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
            Sign in to start a discussion
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Join the conversation with markdown support, channels, and community tags.
          </p>
        </motion.div>
        <Button
          onClick={() => signIn()}
          className="bg-[#34629f] hover:bg-[#2e68a8] text-white font-bold rounded-xl px-6"
        >
          Sign In
        </Button>
      </motion.div>
    );
  }

  if (!isMember) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-surface-strong rounded-3xl p-8 border border-amber-200/60 bg-amber-50/30 space-y-3"
      >
        <motion.div variants={fadeUp} className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <motion.div variants={fadeUp} className="space-y-1">
            <p className="font-bold text-slate-800 text-sm">Join the community first</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              You need to be a member before starting discussions in this community.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={fadeUp}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      className={`glass-surface-strong rounded-3xl shadow-sm border border-slate-200/70 overflow-hidden ${
        mode === "page" ? "p-6 sm:p-8" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[#34629f]">
            <PenLine className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              New Discussion
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {mode === "page" ? "Start a conversation" : "Quick compose"}
          </h2>
          <p className="text-xs text-slate-500">
            Markdown supported · Pick a channel · Up to 5 tags
          </p>
        </div>
        {mode === "modal" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <motion.div variants={fadeUp} className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="discussion-title"
            className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest"
          >
            Title
          </label>
          <input
            id="discussion-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your discussion about?"
            maxLength={120}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/15 focus:border-[#34629f] transition-all disabled:opacity-60"
          />
          <motion.div variants={fadeUp} className="flex justify-between items-center">
            {fieldErrors.title ? (
              <p className="text-xs font-semibold text-rose-500">{fieldErrors.title}</p>
            ) : (
              <span />
            )}
            <span className="text-[10px] font-bold text-slate-400">{title.length}/120</span>
          </motion.div>
        </div>

        {/* Category + Channel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="discussion-category"
              className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest"
            >
              Category
            </label>
            <select
              id="discussion-category"
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isSubmitting || categories.length === 0}
              className="w-full px-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34629f]/15 focus:border-[#34629f] disabled:opacity-60"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <motion.div variants={fadeUp} className="space-y-1.5">
            <label
              htmlFor="discussion-channel"
              className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1"
            >
              <Hash className="w-3 h-3" /> Channel
            </label>
            <select
              id="discussion-channel"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              disabled={isSubmitting || channelsInCategory.length === 0}
              className="w-full px-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34629f]/15 focus:border-[#34629f] disabled:opacity-60"
            >
              {channelsInCategory.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
            {fieldErrors.channelId && (
              <p className="text-xs font-semibold text-rose-500">{fieldErrors.channelId}</p>
            )}
          </motion.div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label
            htmlFor="discussion-tags"
            className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1"
          >
            <Tag className="w-3 h-3" /> Tags <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id="discussion-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="nextjs, career, help — comma separated"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/15 focus:border-[#34629f] transition-all disabled:opacity-60"
          />
          <AnimatePresence>
            {parsedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 pt-1"
              >
                {parsedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#34629f]/10 text-[#34629f] border border-[#34629f]/15"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content + preview toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="discussion-content"
              className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest"
            >
              Content
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#34629f] hover:text-[#2e68a8] px-2 py-1 rounded-lg hover:bg-[#34629f]/5 transition-colors"
            >
              {showPreview ? (
                <>
                  <PenLine className="w-3 h-3" /> Edit
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Preview
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="min-h-[180px] px-4 py-4 bg-slate-50/80 border border-slate-200/70 rounded-2xl prose prose-sm prose-slate max-w-none"
              >
                {content.trim() ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-sm text-slate-400 italic">Nothing to preview yet.</p>
                )}
              </motion.div>
            ) : (
              <motion.textarea
                key="edit"
                id="discussion-content"
                ref={contentRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  resize();
                }}
                placeholder="Share context, code snippets, or questions. Markdown is supported."
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-2xl text-sm text-slate-800 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/15 focus:border-[#34629f] transition-all resize-none disabled:opacity-60 font-mono text-[13px]"
              />
            )}
          </AnimatePresence>
          {fieldErrors.content && (
            <p className="text-xs font-semibold text-rose-500">{fieldErrors.content}</p>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
        {mode === "page" ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/communities/${communitySlug}/discussions`)}
            disabled={isSubmitting}
            className="text-slate-500 font-semibold"
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
        )}

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim() || !channelId}
            className="w-full sm:w-auto bg-[#34629f] hover:bg-[#2e68a8] text-white font-bold rounded-xl px-6 py-2.5 shadow-sm shadow-[#34629f]/20 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Discussion
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
