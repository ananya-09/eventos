"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { modalVariants, overlayVariants } from "@/lib/animations";
import { CategoryWithChannels } from "@/lib/discussions/types";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  communitySlug: string;
  categories: CategoryWithChannels[];
  onChannelCreated: () => void;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
  communitySlug,
  categories,
  onChannelCreated,
}: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlugInput(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slugInput.trim() || !categoryId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/communities/${communitySlug}/discussions/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slugInput.trim(),
          description: description.trim() || undefined,
          categoryId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create channel");
      }

      onChannelCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md z-10 relative"
      >
        <Card className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Create a New Channel</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100/50">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Channel Name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. general"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Channel Slug
              </label>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="e.g. general"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this channel for?"
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#34629f] transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#34629f] text-white hover:bg-[#2e68a8] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Channel</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
