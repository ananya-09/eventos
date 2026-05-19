"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ThreadContainerProps {
  children: ReactNode;
}

export default function ThreadContainer({ children }: ThreadContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full bg-white dark:bg-slate-900/40 dark:backdrop-blur-md rounded-3xl border border-slate-250/60 dark:border-slate-800/50 p-5 md:p-8 shadow-xl shadow-slate-100/20 dark:shadow-none space-y-6 relative overflow-hidden"
    >
      {/* Premium subtle light/glow accent on top-left of the card */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#34629f]/20 to-transparent pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
