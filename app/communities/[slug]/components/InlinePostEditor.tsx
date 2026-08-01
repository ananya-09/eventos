import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InlinePostEditorProps = {
  initialTitle: string;
  initialContent: string;
  isSaving: boolean;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
};

export default function InlinePostEditor({
  initialTitle,
  initialContent,
  isSaving,
  onSave,
  onCancel,
}: InlinePostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, content);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      onSubmit={handleSubmit}
      className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mt-2"
    >
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Editing Post</span>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        disabled={isSaving}
        className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post content"
        disabled={isSaving}
        rows={4}
        className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all resize-none"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
        >
          Cancel
        </button>
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={title.trim().length < 3 || content.trim().length < 10}
          className="px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          Save Changes
        </Button>
      </div>
    </motion.form>
  );
}
