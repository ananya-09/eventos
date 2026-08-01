import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import CodeBlock from "./CodeBlock";

interface ThreadContentProps {
  content: string;
}

export default function ThreadContent({ content }: ThreadContentProps) {
  return (
    <article className="w-full prose prose-slate max-w-none dark:prose-invert prose-headings:font-extrabold prose-h1:text-2xl prose-h2:text-xl prose-a:text-[#34629f] prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none py-4 text-slate-700 dark:text-slate-300">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            
            return match ? (
              <CodeBlock language={match[1]} code={codeString} />
            ) : (
              <code
                className="bg-slate-100 dark:bg-slate-800 text-[#34629f] dark:text-sky-400 px-1.5 py-0.5 rounded font-mono text-sm font-semibold border border-slate-200/50 dark:border-slate-800/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <div className="my-6">{children}</div>;
          },
          p({ children }) {
            return <p className="leading-relaxed mb-4 text-sm md:text-base font-normal">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-4 space-y-2 text-sm md:text-base font-normal">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-4 space-y-2 text-sm md:text-base font-normal">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3 tracking-tight">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 mt-5 mb-3 tracking-tight">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 tracking-tight">{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
