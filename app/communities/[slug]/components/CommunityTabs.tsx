"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { id: "about", name: "About" },
  { id: "feed", name: "Feed" },
  { id: "events", name: "Events" },
  { id: "members", name: "Members" },
  { id: "discussions", name: "Discussions" },
  { id: "resources", name: "Resources" },
];

export default function CommunityTabs({ slug }: { slug: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
      {tabs.map((tab) => {
        const path = `/communities/${slug}/${tab.id}`;
        const isActive = pathname === path || (tab.id === "about" && pathname === `/communities/${slug}`);

        return (
          <Link
            key={tab.id}
            href={path}
            className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap select-none ${
              isActive 
                ? "text-[#34629f]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-[#34629f]/5 border border-[#34629f]/10 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
