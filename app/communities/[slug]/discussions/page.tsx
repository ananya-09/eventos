import { MessageSquare } from "lucide-react";

export default function DiscussionsTab() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm min-h-[300px]">
      <div className="bg-purple-50 p-6 rounded-full mb-4 shadow-inner text-purple-500">
        <MessageSquare className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Discussions and Q&A</h3>
      <p className="text-slate-500 max-w-sm">
        No threads have been started yet. Feel free to use the main community feed above to publish questions or start a conversation!
      </p>
    </div>
  );
}
