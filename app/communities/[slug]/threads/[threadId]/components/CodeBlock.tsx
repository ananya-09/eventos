"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-md">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400 select-none">
        <span className="uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      
      {/* Scrollable code body */}
      <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <code className={`hljs language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
