"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, MessageSquarePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryWithChannels } from "@/lib/discussions/types";
import CreateChannelModal from "./CreateChannelModal";
import NewDiscussionButton from "./NewDiscussionButton";

interface ChannelSidebarProps {
  categories: CategoryWithChannels[];
  slug: string;
  isManager?: boolean;
}

export default function ChannelSidebar({ categories, slug, isManager = false }: ChannelSidebarProps) {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 sm:p-5 shadow-sm space-y-6">
        {/* Sidebar Section Title Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-[#34629f]" />
            <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Categories</h3>
          </div>
          {isManager && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-[10px] font-extrabold text-[#34629f] hover:text-[#2e68a8] bg-[#34629f]/5 hover:bg-[#34629f]/10 px-2 py-1 rounded-lg transition-all duration-200"
            >
              + Channel
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-semibold">No discussions created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                {/* Category Name Tag label */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    {category.name}
                  </span>
                </div>

                {/* Child Discussion Subchannels directory links */}
                <div className="space-y-1">
                  {category.channels.map((chan) => {
                    const channelUrl = `/communities/${slug}/discussions/${chan.slug}`;
                    const isActive = pathname === channelUrl;

                    return (
                      <Link
                        key={chan.id}
                        href={channelUrl}
                        className="block group relative"
                      >
                        <div
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-[#34629f]/10 text-[#34629f] font-bold"
                              : "hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Hash
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? "text-[#34629f]" : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            <span className="text-xs truncate block">{chan.name}</span>
                          </div>

                          {/* Group engagement posts total metric */}
                          {chan.postsCount > 0 && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                                isActive
                                  ? "bg-[#34629f]/20 text-[#34629f]"
                                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                              }`}
                            >
                              {chan.postsCount}
                            </span>
                          )}
                        </div>

                        {/* Active highlight indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeHighlightIndicator"
                            className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[#34629f] rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <NewDiscussionButton
            communitySlug={slug}
            className="w-full flex justify-center"
          />
        </div>
      </Card>

      <AnimatePresence>
        {isCreateOpen && (
          <CreateChannelModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            communitySlug={slug}
            categories={categories}
            onChannelCreated={handleRefresh}
          />
        )}
      </AnimatePresence>
    </>
  );
}
